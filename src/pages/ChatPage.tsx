import { useState, useCallback, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import MessageList from '../components/Message/MessageList';
import MessageInput from '../components/Message/MessageInput';
import { Message } from '../types';
import { ChatContainer, Content, MainContainer } from '../styles/StyleChatPage';

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null); //referência para o WebSocket

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

    const connectionId = uuidv4();
    const serverAddress = `ws://localhost:8000/ws/${connectionId}`;
    console.log(`[WebSocket] Conectando a: ${serverAddress}`);

    const socket = new WebSocket(serverAddress);
    ws.current = socket;

    // handler quando a conexão é iniciada
    socket.onopen = () => {
      console.log('[WebSocket] Conexão aberta.');
      setIsConnected(true);
      // Sem mensagem de sistema
    };

    // handler quando a conexão é fechada
    socket.onclose = (event) => {
      console.log(`[WebSocket] Conexão fechada: Code=${event.code}`);
      setIsConnected(false);
      ws.current = null;
    };

    // handler para erros na conexão
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

    return () => {
      socket?.close(1000, 'Navegação ou Desmontagem');
    };
  }, [addMessage]);

  // handler para enviar mensagens
  const handleSendMessage = (text: string) => {
    console.log(ws.current?.readyState);
    console.log(WebSocket.OPEN);
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(text);
      addMessage('user', text);
      if (!text.trim().startsWith('!')) {
        addMessage('bot', text);
      }
    } else {
      console.warn('Tentativa de enviar mensagem sem conexão.');
      alert('Você não está conectado ao chat.');
    }
  };

  return (
    <MainContainer>
      <Content>
        <h1>Chat FURIA</h1>
        <ChatContainer>
          <MessageList messages={messages} currentUserId={''} />
          <MessageInput onSendMessage={handleSendMessage} />
        </ChatContainer>
      </Content>
    </MainContainer>
  );
};

export default ChatPage;
