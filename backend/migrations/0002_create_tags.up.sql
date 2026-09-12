CREATE TABLE tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    identifier VARCHAR(255) NOT NULL,
    tag_token VARCHAR(255) NOT NULL UNIQUE,
    tag_type VARCHAR(50) NOT NULL CHECK (tag_type IN ('Home', 'Vehicle')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    expiry_at TIMESTAMPTZ NULL
);

CREATE INDEX idx_tags_user_id ON tags(user_id);
CREATE INDEX idx_tags_identifier ON tags(identifier);