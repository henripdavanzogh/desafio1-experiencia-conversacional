import React, { useRef, useEffect } from 'react';
import { MessageListProps } from '../../types';

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // efeito para rolar para baixo quando aparecer novas mensagens
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getSenderStyle = (sender: string): React.CSSProperties => {
    if (sender === 'user') {
      return {
        alignSelf: 'flex-end',
        backgroundColor: '#dcf8c6',
        color: '#333',
      }; // Verde claro - Usuário
    } else if (sender === 'bot') {
      return {
        alignSelf: 'flex-start',
        backgroundColor: '#e5e5ea',
        color: '#333',
      }; // Cinza claro - Bot
    } else {
      // System ou outros usuários (se implementar depois)
      return {
        alignSelf: 'center',
        backgroundColor: '#f1f1f1',
        color: '#555',
        fontStyle: 'italic',
        fontSize: '0.9em',
      }; // Cinza mais claro/itálico - Sistema
    }
  };

  return (
    <div
      style={{
        height: '450px',
        overflowY: 'auto',
        border: '1px solid #eee',
        marginBottom: '10px',
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px' /* Espaço entre msgs */,
      }}
    >
      {messages.length === 0 && (
        <p style={{ textAlign: 'center', color: '#aaa' }}>
          Nenhuma mensagem ainda. Digite algo ou um comando!
        </p>
      )}
      {messages.map((msg) => (
        <div
          key={msg.id}
          style={{
            maxWidth: '75%',
            padding: '8px 12px',
            borderRadius: '15px',
            wordWrap: 'break-word',
            ...getSenderStyle(msg.sender), // Aplica estilo baseado no remetente
          }}
        >
          {/* Opcional: Mostrar remetente se não for user ou bot */}
          {msg.sender !== 'user' &&
            msg.sender !== 'bot' &&
            msg.sender !== 'System' && <strong>{msg.sender}:</strong>}
          {/* Opcional: Mostrar remetente BOT explicitamente */}
          {msg.sender === 'bot' && <strong>FURIA Bot:</strong>}
          <span>{msg.text}</span>
          {/* Adiciona timestamp */}
          <div
            style={{
              fontSize: '0.7em',
              color: '#666',
              textAlign: 'right',
              marginTop: '4px',
              opacity: 0.8,
            }}
          >
            {new Date(msg.timestamp).toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
      ))}
      {/* Elemento invisível no final para ajudar a rolar */}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
