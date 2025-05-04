export interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: number;
}

export interface MessageInputProps {
  onSendMessage: (text: string) => void;
}

export interface MessageListProps {
  messages: Message[];
}
