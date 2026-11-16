CREATE TABLE game_history (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  game_id VARCHAR(100) NOT NULL,
  last_played_at TIMESTAMP NOT NULL,
  PRIMARY KEY (user_id, game_id)
);

CREATE INDEX idx_game_history_game ON game_history (game_id, last_played_at DESC);
