export interface Message {
  id: string;
  sender: string; // quem enviou (bot, user, sistema)
  text: string;
  timestamp: number; // data/Hora da mensagem enviada
}

export interface MessageInputProps {
  onSendMessage: (text: string) => void;
}

export interface MessageListProps {
  messages: Message[];
}
