import React from 'react';
import { MessageListProps } from '../../types/index'; // Importa o tipo Message
import {
  BotName,
  HourText,
  ListContainer,
  NoMessageContainer,
  SpanMessage,
} from '../../styles/StyleMessageList.ts/style';

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const getSenderStyle = (sender: string): React.CSSProperties => {
    if (sender === 'user') {
      return {
        display: 'flex',
        flexDirection: 'column',
        alignSelf: 'flex-end',
        backgroundColor: 'var(--furia-gray-dark-2)',
        color: 'var(--white-off)',
        fontFamily: 'var(--font-nunito)',
      };
    } else {
      return {
        display: 'flex',
        flexDirection: 'column',
        alignSelf: 'flex-start',
        backgroundColor: 'var(--furia-gray-light)',
        fontFamily: 'var(--font-nunito)',
        color: 'var(--black-primary)',
      };
    }
  };

  return (
    <ListContainer>
      {messages.length === 0 && (
        <NoMessageContainer>
          Nenhuma mensagem ainda. Digite algo ou "!schedule"!
        </NoMessageContainer>
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
          {msg.sender === 'bot' && <BotName>FURIA BOT: </BotName>}
          <SpanMessage>{msg.text}</SpanMessage>
          <HourText>
            {new Date(msg.timestamp).toLocaleTimeString('pt-BR', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </HourText>
        </div>
      ))}
    </ListContainer>
  );
};

export default MessageList;
