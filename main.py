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
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        self.active_connections[user_id] = websocket
        logging.info(f"Usuário '{user_id}' conectado.")

    def disconnect(self, user_id: str):
        websocket = self.active_connections.pop(user_id, None)
        if websocket:
            logging.info(f"Usuário '{user_id}' desconectado.")

    async def send_personal_message(self, message: str, user_id: str):
        websocket = self.active_connections.get(user_id)
        if websocket:
            try:
                await websocket.send_text(message)
            except Exception as e:
                self.disconnect(user_id)
                logging.warning(f"Erro send_personal para {user_id}: {e}")


manager = ConnectionManager()


def format_game_date(date_str: str | None) -> str:
    if not date_str:
        return "Data Indefinida"
    try:
        game_date_utc = datetime.datetime.fromisoformat(date_str.replace("Z", "+00:00"))
        brasilia_tz = datetime.timezone(datetime.timedelta(hours=-3))
        game_date_br = game_date_utc.astimezone(brasilia_tz)
        return game_date_br.strftime("%d/%m %H:%M")
    except Exception:
        return date_str


# processamnento de comandos
def process_command(command: str) -> str:
    lower_cmd = command.lower().strip()
    response = (
        f"Comando '{command}' não reconhecido. Tente !schedule, !lineup ou  !results."
    )
    logging.info(f"Processando comando: {lower_cmd}")
    if lower_cmd == "!schedule":
        schedule = furia_data.get("schedule", [])
        if schedule:
            response_lines = ["📅 Próximos Jogos:"]
            max_items_to_show = 3
            count = 0
            for game in schedule:
                if count >= max_items_to_show:
                    break
                opponent = game.get("opponent", "?")
                tournament = game.get("tournament", "?")
                date_str = format_game_date(game.get("date"))
                response_lines.append(
                    f" FURIA vs {opponent} ({tournament}) em {date_str} (BRT)"
                )
                count += 1
            if count > 0:
                response = "\n".join(response_lines)
            else:
                response = "Nenhum jogo agendado."
        else:
            response = "Nenhum jogo agendado."
    elif lower_cmd == "!lineup":
        lineup = furia_data.get("lineup", [])
        if lineup:
            response_lines = ["👥 Line-up Atual:"]
            for p in lineup:
                response_lines.append(f" {p.get('name', '?')} ({p.get('role', '?')})")
            response = "\n".join(response_lines)
        else:
            response = "Line-up não encontrada."
    elif lower_cmd == "!results":
        results = furia_data.get("results", [])
        if results:
            response_lines = ["📊 Últimos Resultados:"]
            max_items_to_show = 3
            count = 0
            for result in results:
                if count >= max_items_to_show:
                    break
                opponent = result.get("opponent", "?")
                score = result.get("score", "?")
                tournament = result.get("tournament", "?")
                response_lines.append(f" FURIA {score} {opponent} ({tournament})")
                count += 1
            if count > 0:
                response = "\n".join(response_lines)
            else:
                response = "Nenhum resultado encontrado."
        else:
            response = "Nenhum resultado recente."
    return response


# endpoint websocket
@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await manager.connect(websocket, user_id)

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
                logging.info(
                    f"Mensagem de '{user_id}' ignorada (não é comando): {data}"
                )

    except WebSocketDisconnect:
        logging.info(f"Usuário '{user_id}' desconectou (normal).")
    except Exception as e:
        logging.error(f"Erro inesperado com '{user_id}': {e}")
    finally:
        manager.disconnect(user_id)


# confirmando que o servidor está rodando na rota raiz
@app.get("/")
def read_root():
    return {"Status": "Servidor do Chat FURIA no ar!"}


# uvicorn main:app --reload --host 0.0.0.0 --port 8000
