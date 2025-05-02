import json
import datetime
import logging
import os
from typing import Dict
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

origins = [
    "http://localhost",  # url base
    "http://localhost:5173",  # porta padrão do vite
    "https://desafio1-experiencia-conversacional.vercel.app",
]

# carregamento do json (furiaData.json)
script_dir = os.path.dirname(os.path.abspath(__file__))
json_file_path = os.path.join(script_dir, "src", "data", "furiaData.json")
try:
    with open(json_file_path, "r", encoding="utf-8") as data_file:
        furia_data = json.load(data_file)
    logging.info("Dados carregados com sucesso!")
except Exception as e:
    logging.error(f"Erro ao carregar os dados: {e}")
    furia_data = {"schedule": [], "lineup": [], "results": []}


# gerenciador de conexões
class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = []

    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        self.active_connections.append(websocket)
        logging.info(f"Cliente {user_id} conectado!")

    def disconnect(self, user_id: str):
        if user_id in self.active_connections:
            del self.active_connections[user_id]
            logging.info(f"Cliente {user_id} desconectado!")

    async def send_personal_message(self, message: str, user_id: str):
        if user_id in self.active_connections:
            websocket = self.active_connections[user_id]
            try:
                await websocket.send_text(message)
            except Exception as e:
                logging.error(f"Erro ao enviar mensagem para {user_id}: {e}")
                self.disconnect(user_id)

    async def broadcast(self, message: str, sender_id: str = None):
        disconnected_users = []
        # para iterar sobre os usuários conectados
        active_users = list(self.active_connections.items())
        for user_id, websocket in active_users:
            try:
                # não enviar para o remetente
                if user_id != sender_id:
                    await websocket.send_text(message)
            except Exception as e:
                logging.warning(
                    f"Erro de broadcast para {user_id}: {e}. Marcando para dc."
                )
                # dc = disconnect
                disconnected_users.append(user_id)


manager = ConnectionManager()


# processamnento de comandos
async def process_command(command: str, user_id: str) -> str:
    lower_cmd = command.lower()
    response = (
        f"Comando '{command}' não reconhecido. Tente !schedule, !lineup, !results"
    )
    logging.info(f"Processando comando: {lower_cmd}")

    if lower_cmd == "!schedule":
        schedule = furia_data.get("schedule", [])
        if schedule:
            next_match = schedule[0]
            try:
                game_date_utc = datetime.datetime.fromisoformat(
                    next_match.get("date", "").replace("Z", "+00:00")
                )
                brasilia_tz = datetime.timezone(datetime.timedelta(hours=-3))
                game_date_br = game_date_utc.astimezone(brasilia_tz)
                date_str = game_date_br.strftime("%d/%m/%Y %H:%M")
                opponent = next_match.get("opponent", "?")
                tournament = next_match.get("tournament", "?")
                response = f"Próximo jogo: FURIA vs {opponent} ({tournament}) em {date_str} (Horário de Brasília)"
                return response
            except (ValueError, KeyError, TypeError) as e:
                logging.error(f"Erro ao processar data do jogo: {e}")
                response = "Próxima data do jogo não encontrada ou inválida."
                return response

        elif lower_cmd == "!lineup":
            lineup = furia_data.get("lineup", [])
            if lineup:
                player_list = ", ".join(
                    [f"{p.get('name', '?')} ({p.get('role', '?')})" for p in lineup]
                )
                response = f"Line-up atual: {player_list}"
                return response
            else:
                response = "Lineup não encontrada. Acho que estão de férias!"

        elif lower_cmd == "!results":
            results = furia_data.get("results", [])
            if results:
                last_result = results[0]
                opponent = last_result.get("opponent", "?")
                score = last_result.get("score", "?")
                tournament = last_result.get("tournament", "?")
                response = f"Último resultado: FURIA {score} {opponent} ({tournament})"
                return response
            else:
                response = "Nenhum resultado recente encontrado."
                return response


# endpoint websocket
@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    # simplificação: permitir ids duplicados
    if user_id in manager.active_connections:
        logging.warning(f"ID '{user_id}' já conectado.")

    await manager.connect(websocket, user_id)
    await manager.broadcast(f"Usuário {user_id} entrou no chat!")

    try:
        while True:
            data = await websocket.receive_text()
            logging.info(f"Mensagem recebida de {user_id}: {data}")
            if data.startswith("!"):
                bot_response = process_command(data)
                await manager.send_personal_message(
                    f"BOT:{bot_response}", user_id
                )  # responde só pra quem pediu
            else:
                # envia mensagem para todos os usuários conectados
                await manager.broadcast(f"{user_id}:{data}", sender_id=user_id)

    except WebSocketDisconnect:
        logging.info(f"Usuário '{user_id}' desconectou (normal).")
    except Exception as e:
        logging.error(f"Erro inesperado com '{user_id}': {e}")
    finally:
        # Garante desconexão e notificação na saída do loop/try
        manager.disconnect(user_id)
        await manager.broadcast(f"System:{user_id} saiu do chat.")


# confirmando que o servidor está rodando na rota raiz
@app.get("/")
def read_root():
    return {"Status": "Servidor do Chat FURIA no ar!"}
