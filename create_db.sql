CREATE DATABASE fjell_consultation;

\c fjell_consultation;

CREATE TABLE tickets (
    id UUID PRIMARY KEY,
    title varchar(255),
    description TEXT,
    category int NOT NULL,
    user_id UUID NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name varchar(127) NOT NULL
);

CREATE TABLE ticket_messages (
    id UUID PRIMARY KEY,
    ticket_id UUID NOT NULL,
    message TEXT,
)

CREATE TABLE message_embeds (
    id UUID PRIMARY KEY,
    ticket_message_id UUID NOT NULL,
    url TEXT NOT NULL
)