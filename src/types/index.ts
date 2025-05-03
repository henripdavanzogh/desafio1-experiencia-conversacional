export interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: number;
}

export interface MessageInputProps {
  onSendMessage: (text: string) => void;
  // onAddMessage?: (sender: string, text: string) => void; //  onAddMessage prop
}

export interface MessageListProps {
  messages: Message[];
  currentUserId?: string;
}
