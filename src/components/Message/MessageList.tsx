import React from 'react';
import { MessageListProps } from '../../types/index'; // Importa o tipo Message

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const getSenderStyle = (sender: string): React.CSSProperties => {
    if (sender === 'user') {
      return {
        alignSelf: 'flex-end',
        backgroundColor: 'var(--furia-gray-dark-2)',
        color: 'var(--white-off)',
      };
    } else {
      return {
        alignSelf: 'flex-start',
        backgroundColor: 'var(--white-primary)',
        color: '#333',
      };
    }
  };

  return (
    <div>
      {messages.length === 0 && (
        <p style={{ textAlign: 'center', color: '#aaa' }}>
          Nenhuma mensagem ainda. Digite algo ou "!schedule"!
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
            ...getSenderStyle(msg.sender), // Aplica o estilo simplificado
          }}
        >
          {msg.sender === 'bot' && <strong>FURIA Bot: </strong>}
          <span>{msg.text}</span>
          <div>
            {new Date(msg.timestamp).toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
