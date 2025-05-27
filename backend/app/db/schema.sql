CREATE TABLE Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE servers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    server_type TEXT NOT NULL CHECK (server_type IN ('bedrock', 'java')),
    domain_name varchar(255) NOT NULL,
    ip VARCHAR(20) NOT NULL,
    port VARCHAR(6) NOT NULL,
    status VARCHAR(8) NOT NULL CHECK (status IN ('running', 'stopped')) DEFAULT "running"
);
