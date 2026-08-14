INSERT INTO users (
    id,
    keycloak_id,
    username,
    created_at,
    updated_at
)
VALUES (
    gen_random_uuid(),
    'd8f6b3c1-2b7e-4d75-9a31-6f2c8e4b1a90',
    'admin',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
)
ON CONFLICT (username) DO UPDATE
SET keycloak_id = EXCLUDED.keycloak_id,
    updated_at = CURRENT_TIMESTAMP;
