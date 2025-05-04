import { useState, useCallback, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import MessageList from '../components/Message/MessageList';
import MessageInput from '../components/Message/MessageInput';
import { Message } from '../types';
import {
  ChatContainer,
  ChatHeader,
  ChatTitle,
  ChatTitleItalic,
  Content,
  MainContainer,
} from './style';

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);

  const addMessage = useCallback((sender: 'user' | 'bot', text: string) => {
    const newMessage: Message = {
      id: uuidv4(),
      sender: sender,
      text: text,
      timestamp: Date.now(),
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  }, []);

  useEffect(() => {
    if (ws.current) return;

    const checkServer = async () => {
      try {
        const res = await fetch('http://localhost:8000/');
        const json = await res.json();
        if (json?.Status) {
          connectWebSocket();
        } else {
          console.warn('Servidor ainda não disponível, tentando novamente...');
          setTimeout(checkServer, 1000); // tenta de novo em 1 segundo
        }
      } catch (e) {
        console.warn('Erro ao conectar com servidor, tentando novamente...', e);
        setTimeout(checkServer, 1000);
      }
    };

    const connectWebSocket = () => {
      if (ws.current) return;
      const connectionId = uuidv4();
      const serverAddress = `ws://localhost:8000/ws/${connectionId}`;
      console.log(`[WebSocket] Conectando a: ${serverAddress}`);
      const socket = new WebSocket(serverAddress);
      ws.current = socket;

      socket.onopen = () => {
        console.log('[WebSocket] Conexão aberta.');
        setIsConnected(true);
      };

      socket.onclose = (event) => {
        console.log(`[WebSocket] Conexão fechada: Code=${event.code}`);
        setIsConnected(false);
        ws.current = null;
      };

      socket.onerror = (error) => {
        console.error('[WebSocket] Erro:', error);
        setIsConnected(false);
        ws.current = null;
      };

      socket.onmessage = (event) => {
        try {
          const messageData = event.data as string;
          console.log('<- [WebSocket] Recebido:', messageData);
          const separatorIndex = messageData.indexOf(':');
          if (separatorIndex > 0) {
            const senderFromServer = messageData.substring(0, separatorIndex);
            const text = messageData.substring(separatorIndex + 1).trim();

            // Adiciona a mensagem APENAS se o remetente for 'BOT' (case-insensitive)
            if (senderFromServer.toUpperCase() === 'BOT') {
              addMessage('bot', text);
            } else {
              console.log(
                '[WebSocket] Mensagem recebida de usuário ignorada:',
                senderFromServer,
              );
            }
          } else {
            console.warn(
              '[WebSocket] Mensagem recebida sem formato esperado:',
              messageData,
            );
          }
        } catch (e) {
          console.error('Erro ao processar mensagem recebida:', e);
        }
      };
    };

    checkServer();

    return () => {
      ws.current?.close(1000, 'Navegação ou Desmontagem');
    };
  }, [addMessage]);

  // handler para enviar mensagens
  const handleSendMessage = (text: string) => {
    console.log(ws.current?.readyState);
    console.log(WebSocket.OPEN);
    if (isConnected && ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(text);
      addMessage('user', text);
      if (!text.trim().startsWith('!')) {
        // mensagem padrão para entradas não-comando
        addMessage(
          'bot',
          'Desculpe, mas não fui programado para conversar diretamente. Você pode digitar os comandos !schedule, !lineup ou !results para saber mais sobre os futuros jogos, lineup ou até mesmo resultados!',
        );
      }
    } else {
      alert('Você não está conectado ao chat.');
      console.warn('Tentativa de enviar mensagem sem conexão.');
    }
  };

  return (
    <MainContainer>
      <Content>
        <ChatHeader>
          <ChatTitle>
            <ChatTitleItalic>FURIA </ChatTitleItalic> Chat
          </ChatTitle>
        </ChatHeader>
        <ChatContainer>
          <MessageList messages={messages} />
          <MessageInput onSendMessage={handleSendMessage} />
        </ChatContainer>
      </Content>
    </MainContainer>
  );
};

export default ChatPage;
