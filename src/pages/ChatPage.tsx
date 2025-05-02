import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import MessageList from '../components/Message/MessageList';
import MessageInput from '../components/Message/MessageInput';
import { Message } from '../types';
import furiaData from '../data/furiaData.json';

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null); //referência para o WebSocket
  const userId = useRef<string>(uuidv4()); // id do usuário

  const addMessage = useCallback((sender: Message['sender'], text: string) => {
    const newMessage: Message = {
      id: uuidv4(),
      sender,
      text,
      timestamp: Date.now(),
    };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  }, []);

  useEffect(() => {
    if (ws.current) return;

    const serverAddress = `ws://localhost:8000/ws/${userId.current}`;
    console.log(`[WebSocket] Conectando a: ${serverAddress}`);

    const socket = new WebSocket(serverAddress);
    ws.current = socket;

    // handler quando a conexão é iniciada
    socket.onopen = () => {
      console.log('[WebSocket] Conexão aberta.');
      setIsConnected(true);
      addMessage('System', 'Bem-vindo a FURIA Chat!');
    };

    // handler quando a conexão é fechada
    socket.onclose = (event) => {
      console.log(
        `[WebSocket] Conexão fechada: Code=${event.code}, Reason=${event.reason}, Clean=${event.wasClean}`,
      );
      setIsConnected(false);
      if (event.code !== 1000) {
        // código 1000 = fechamento normal/limpo
        addMessage(
          'System',
          `Desconectado do servidor (${event.code}). Tente recarregar.`,
        );
      }
      ws.current = null; // limpa a instacia do WebSocket
    };

    // handler para erros na conexão
    socket.onerror = (error) => {
      console.error('[WebSocket] Erro:', error);
      addMessage(
        'System',
        'Erro na conexão com o chat. O servidor pode estar offline.',
      );
      setIsConnected(false);
      ws.current = null;
    };

    return () => {
      // verifica se a conexão WebSocket existe e está aberta
      if (socket && socket.readyState === WebSocket.OPEN) {
        console.log('[WebSocket] A fechar conexão na limpeza do componente...');
        // fecha a conexão
        socket.close(1000, 'Navegação encerrada.');
      }
    };
  }, [addMessage]);

  // handler para enviar mensagens
  const handleSendMessage = (text: string) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      console.log('-> mensagem enviada:', text);
      ws.current.send(text);

      if (!text.trim().startsWith('!')) {
        addMessage(userId.current, text); //usa o id da sessão atual como remetente
      }
    } else {
      addMessage(
        'System',
        'Não está conectado ao chat. Impossível enviar mensagem.',
      );
    }
  };

  return <p>vish</p>;
};

export default ChatPage;
