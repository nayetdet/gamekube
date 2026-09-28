CREATE TABLE messages (
  id UUID NOT NULL,
  sender_id UUID NOT NULL,
  recipient_id UUID NOT NULL,
  content VARCHAR(2000) NOT NULL,
  status VARCHAR(20) NOT NULL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  read_at TIMESTAMP,
  CONSTRAINT pk_messages PRIMARY KEY (id),
  CONSTRAINT fk_messages_sender FOREIGN KEY (sender_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT fk_messages_recipient FOREIGN KEY (recipient_id) REFERENCES users (id) ON DELETE CASCADE
);

CREATE INDEX idx_messages_conversation ON messages (sender_id, recipient_id, created_at);
CREATE INDEX idx_messages_recipient_status ON messages (recipient_id, status);
