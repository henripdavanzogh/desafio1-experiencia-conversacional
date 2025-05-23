import React, { useState } from 'react';
import { MessageInputProps } from '../../types/index';
import {
  Button,
  InputContainer,
  SendMessageContainer,
} from '../../styles/StyleMessageInput.ts/style';

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [inputValue, setInputValue] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedValue = inputValue.trim();
    if (trimmedValue) {
      onSendMessage(trimmedValue);
      setInputValue('');
    } else {
      console.log('Tentativa de enviar mensagem vazia ignorada.');
    }
  };

  return (
    <SendMessageContainer onSubmit={handleSubmit}>
      <InputContainer
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Apareça no FURIA Chat!"
      />
      <Button type="submit" disabled={!inputValue.trim()}>
        Enviar
      </Button>
    </SendMessageContainer>
  );
};
export default MessageInput;
