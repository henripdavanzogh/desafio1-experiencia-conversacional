import React, { useState } from 'react';
import { MessageInputProps } from '../../types/index';

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '') {
      onSendMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="f">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Apareça no FURIA Chat!"
        className=""
      />
      <button type="submit" className="">
        Enviar
      </button>
    </form>
  );
};

export default MessageInput;
