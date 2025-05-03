import React, { useState } from 'react';
import { MessageInputProps } from '../../types/index';

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
    <form onSubmit={handleSubmit} className="f">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Apareça no FURIA Chat!"
      />
      <button type="submit" disabled={!inputValue.trim()}>
        Enviar
      </button>
    </form>
  );
};
export default MessageInput;
