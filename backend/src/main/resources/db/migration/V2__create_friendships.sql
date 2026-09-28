CREATE TABLE friendships (
  id UUID NOT NULL,
  requester_id UUID NOT NULL,
  addressee_id UUID NOT NULL,
  status VARCHAR(20) NOT NULL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  CONSTRAINT pk_friendships PRIMARY KEY (id),
  CONSTRAINT fk_friendships_requester FOREIGN KEY (requester_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT fk_friendships_addressee FOREIGN KEY (addressee_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT uk_friendships_pair UNIQUE (requester_id, addressee_id),
  CONSTRAINT chk_friendships_no_self CHECK (requester_id <> addressee_id)
);

CREATE INDEX idx_friendships_requester ON friendships (requester_id);
CREATE INDEX idx_friendships_addressee ON friendships (addressee_id);
