CREATE TABLE users (
    id UUID NOT NULL,
    keycloak_id UUID NOT NULL,
    username VARCHAR(50) NOT NULL,
    name VARCHAR(100),
    description VARCHAR(1000),
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT pk_users PRIMARY KEY (id),
    CONSTRAINT uk_users_keycloak_id UNIQUE (keycloak_id),
    CONSTRAINT uk_users_username UNIQUE (username)
);
