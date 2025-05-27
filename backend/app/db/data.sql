-- Create users
INSERT INTO Users (name, password)
VALUES
('TestA', 'a'),
('TestB', 'b'),
('TestC', 'c');

INSERT INTO servers (name, server_type, ip, port, status) VALUES
('Survival Realm', 'java', '192.168.1.100', 25565, 'running'),
('Creative Bedrock', 'bedrock', '192.168.1.101', 19132, 'stopped'),
('PvP Arena', 'java', '192.168.1.102', 25565, 'running');
