export type Message = {
  id: string;
  senderUsername: string;
  recipientUsername: string;
  content: string;
  status: 'SENT' | 'READ';
  createdAt: string;
  readAt: string | null;
};
