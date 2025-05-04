# Chat FURIA Fans - Desafio Blip: Experiência Conversacional

![Logo da FURIA (Exemplo)](https://upload.wikimedia.org/wikipedia/pt/f/f9/Furia_Esports_logo.png)
_(Substitua o placeholder acima pelo link real de uma imagem do logo da FURIA, se desejar)_

Este projeto é uma aplicação web de chat desenvolvida como parte do **Desafio #1: Experiência Conversacional [NORMAL]** proposto pela Blip. O objetivo é criar uma experiência conversacional para os fãs do time de CS da FURIA, permitindo que acompanhem informações sobre a equipe através de comandos interativos.

## 🚀 Sobre o Projeto

A aplicação consiste em uma interface de chat onde o usuário pode enviar mensagens. Se a mensagem for um comando reconhecido (iniciando com `!`), um Bot (implementado no backend) responde com informações relevantes sobre a equipe FURIA, buscando dados de um arquivo JSON local. As mensagens do usuário e as respostas do Bot são exibidas na interface. A comunicação entre o frontend (React) e o backend (Python/FastAPI) é feita via WebSockets.

## ✨ Funcionalidades Implementadas

- **Interface de Chat:** Layout simples com área de exibição de mensagens e campo de input para envio.
- **Exibição de Mensagens:** Mostra as mensagens enviadas pelo usuário e as respostas recebidas do Bot.
- **Processamento de Comandos:** O usuário pode enviar comandos específicos:
  - `!schedule`: Exibe os próximos jogos agendados da FURIA (até 3).
  - `!lineup`: Exibe a line-up atual do time de CS.
  - `!results`: Exibe os últimos resultados registrados (até 3).
- **Respostas do Bot:** O backend processa os comandos e envia respostas formatadas de volta para o chat.
- **Dados Estáticos:** As informações sobre agenda, line-up e resultados são lidas de um arquivo `furiaData.json` local no backend.
- **Comunicação WebSocket:** Frontend e Backend se comunicam usando WebSockets.
- **Navegação:** Inclui uma Landing Page simples e navegação para a página do chat.

## 🛠️ Tecnologias Utilizadas

- **Frontend:**
  - React
  - TypeScript
  - Create React App - especifique qual usou
  - React Router DOM (para navegação)
  - uuid (para gerar IDs)
  - Styled-Components
- **Backend:**
  - Python
  - FastAPI (framework web)
  - Uvicorn (servidor ASGI)
  - WebSockets (para comunicação)
- **Dados:**
  - JSON (para armazenamento estático dos dados da FURIA)
- **Ambiente:**
  - Node.js e npm (ou yarn)
  - Python Virtual Environment (`venv`)
  - pip (gerenciador de pacotes Python)

## ⚙️ Como Rodar Localmente

Siga os passos abaixo para configurar e executar o projeto na sua máquina:

**1. Pré-requisitos:**

- Node.js (v16 ou superior recomendado) - [https://nodejs.org/](https://nodejs.org/)
- npm (geralmente vem com Node.js) ou yarn
- Python (v3.8 ou superior recomendado) - [https://www.python.org/](https://www.python.org/)
- pip (geralmente vem com Python)
- Git (para clonar o repositório) - [https://git-scm.com/](https://git-scm.com/)

**2. Clone o Repositório:**

```bash
git clone [https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git](https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git)
cd SEU_REPOSITORIO

(Substitua SEU_USUARIO/SEU_REPOSITORIO pelo caminho real do seu repositório)

3. Configure o Ambiente Python (Backend):

Crie um ambiente virtual (recomendado):

python -m venv .venv

Ative o ambiente virtual:

Windows (Cmd/PowerShell): .\.venv\Scripts\activate

MacOS/Linux (bash/zsh): source .venv/bin/activate

(Você verá (.venv) no início do prompt do terminal)

Instale as dependências Python a partir do arquivo requirements.txt:

pip install -r requirements.txt

4. Configure o Ambiente Node.js (Frontend):

Instale as dependências do Node.js:

npm install
# ou
yarn install

5. Execute a Aplicação (Dois Terminais):

Terminal 1 (Backend):

Certifique-se de que o ambiente virtual Python (.venv) está ativo.

Inicie o servidor FastAPI/Uvicorn:

uvicorn main:app --reload --host 0.0.0.0 --port 8000

Terminal 2 (Frontend):

Inicie o servidor de desenvolvimento React/Vite:

npm run dev
# ou
yarn dev

6. Acesse a Aplicação:

Abra seu navegador e acesse a URL fornecida pelo servidor de desenvolvimento do frontend (geralmente http://localhost:5173).

Navegue até a página do chat e interaja com os comandos!

📝 Limitações Atuais
Interação User-Bot Apenas: A comunicação Fã-Fã não está implementada nesta versão. Mensagens normais são ignoradas pelo backend.

Dados Estáticos: As informações do Bot vêm de um arquivo JSON local e não são atualizadas dinamicamente de fontes externas.

Sem Contas de Usuário: Não há sistema de login ou persistência de identidade de usuário.
```
