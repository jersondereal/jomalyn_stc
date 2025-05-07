use jomalyn_stc;

INSERT INTO Passenger (RFID, FirstName, LastName, PhoneNumber, CurrentBalance)
VALUES 
    ('10000001', 'John',      'Doe',      '09123456789',  0.00),
    ('10000002', 'Jane',      'Smith',    '09234567890',  60.00),
    ('10000003', 'Mary',      'Johnson',  '09345678901', 110.00),
    ('10000004', 'James',     'Brown',    '09456789012',  0.00),
    ('10000005', 'Patricia',  'Davis',    '09567890123',  50.00),
    ('10000006', 'Michael',   'Miller',   '09678901234',  0.00),
    ('10000007', 'Linda',     'Wilson',   '09789012345', 250.00),
    ('10000008', 'Robert',    'Moore',    '09890123456',  0.00),
    ('10000009', 'Barbara',   'Taylor',   '09123456780',  50.00),
    ('10000010', 'William',   'Anderson', '09234567881',  0.00),
    ('10000011', 'Elizabeth', 'Thomas',   '09345678902',  10.00),
    ('10000012', 'David',     'Jackson',  '09456789013',  50.00),
    ('10000013', 'Jennifer',  'White',    '09567890124',  30.00),
    ('10000014', 'Richard',   'Harris',   '09678901235',  60.00),
    ('10000015', 'Susan',     'Martin',   '09789012346',  20.00),
    ('10000016', 'Joseph',    'Thompson', '09890123457', 150.00),
    ('10000017', 'Sarah',     'Garcia',   '09123456782', 200.00),
    ('10000018', 'Charles',   'Martinez', '09234567883',  50.00),
    ('10000019', 'Karen',     'Robinson', '09345678903',  75.00),
    ('10000020', 'Thomas',    'Clark',    '09456789014', 100.00);


INSERT INTO Transactions (TransactionID, RFID, TransactionType, Amount, Destination, Fare, RemainingBalance, Timestamp)
VALUES 
    (1,  '10000001', 'Cash-in',   50.00, NULL,          NULL,   50.00,  '2024-03-01 08:00:00'),
    (2,  '10000001', 'Payment',   50.00, 'Sulangan',     50.00,   0.00, '2024-03-01 09:15:00'),
    (3,  '10000002', 'Cash-in',  100.00, NULL,          NULL,  100.00, '2024-03-01 10:30:00'),
    (4,  '10000002', 'Payment',   40.00, 'Baras',        40.00,  60.00, '2024-03-01 11:45:00'),
    (5,  '10000003', 'Payment',   40.00, 'Ngolos',       40.00,  60.00, '2024-03-01 13:00:00'),
    (6,  '10000003', 'Cash-in',   50.00, NULL,          NULL,  110.00, '2024-03-01 14:15:00'),
    (7,  '10000004', 'Payment',   50.00, 'Sulangan',     50.00,   0.00, '2024-03-01 15:30:00'),
    (8,  '10000005', 'Cash-in',  100.00, NULL,          NULL,  100.00, '2024-03-01 16:45:00'),
    (9,  '10000005', 'Payment',   50.00, 'Sulangan',     50.00,  50.00, '2024-03-02 08:00:00'),
    (10, '10000006', 'Cash-in',   40.00, NULL,          NULL,   40.00, '2024-03-02 09:15:00'),
    (11, '10000006', 'Payment',   40.00, 'Baras',        40.00,   0.00, '2024-03-02 10:30:00'),
    (12, '10000007', 'Payment',   50.00, 'Sulangan',     50.00, 200.00, '2024-03-02 11:45:00'),
    (13, '10000007', 'Cash-in',   50.00, NULL,          NULL,  250.00, '2024-03-02 13:00:00'),
    (14, '10000008', 'Payment',   40.00, 'Ngolos',       40.00,   0.00, '2024-03-02 14:15:00'),
    (15, '10000009', 'Cash-in',  100.00, NULL,          NULL,  100.00, '2024-03-02 15:30:00'),
    (16, '10000009', 'Payment',   50.00, 'Sulangan',     50.00,  50.00, '2024-03-02 16:45:00'),
    (17, '10000010', 'Cash-in',   40.00, NULL,          NULL,   40.00, '2024-03-03 08:00:00'),
    (18, '10000010', 'Payment',   40.00, 'Baras',        40.00,   0.00, '2024-03-03 09:15:00'),
    (19, '10000011', 'Payment',   40.00, 'Ngolos',       40.00,  10.00, '2024-03-03 10:30:00'),
    (20, '10000012', 'Cash-in',   50.00, NULL,          NULL,   50.00, '2024-03-03 11:45:00');

INSERT INTO Users (UserID, Username, Email, Password, Role, RFID, CreatedAt)
VALUES 
    (1,  'johndoe',      'johndoe@example.com',      '$2b$10$5QZX.QyPv0QNfnCjhz5EYOYJWzEL3X5tGz6HqF3RBGKwO4YEQb0Uy', 'Passenger', '10000001', '2024-03-01 00:00:00'),
    (2,  'janesmith',    'janesmith@example.com',    '$2b$10$5QZX.QyPv0QNfnCjhz5EYOYJWzEL3X5tGz6HqF3RBGKwO4YEQb0Uy', 'Passenger', '10000002', '2024-03-01 00:00:00'),
    (3,  'maryjohnson',  'maryjohnson@example.com',  '$2b$10$5QZX.QyPv0QNfnCjhz5EYOYJWzEL3X5tGz6HqF3RBGKwO4YEQb0Uy', 'Passenger', '10000003', '2024-03-01 00:00:00'),
    (4,  'admin',        'admin@example.com',        '$2b$10$5QZX.QyPv0QNfnCjhz5EYOYJWzEL3X5tGz6HqF3RBGKwO4YEQb0Uy', 'Admin',     NULL,        '2024-03-01 00:00:00'),
    (5,  'operator1',    'operator1@example.com',    '$2b$10$5QZX.QyPv0QNfnCjhz5EYOYJWzEL3X5tGz6HqF3RBGKwO4YEQb0Uy', 'Operator',  NULL,        '2024-03-01 00:00:00'),
    (6,  'operator2',    'operator2@example.com',    '$2b$10$5QZX.QyPv0QNfnCjhz5EYOYJWzEL3X5tGz6HqF3RBGKwO4YEQb0Uy', 'Operator',  NULL,        '2024-03-01 00:00:00'),
    (7,  'jamesbrown',   'jamesbrown@example.com',   '$2b$10$5QZX.QyPv0QNfnCjhz5EYOYJWzEL3X5tGz6HqF3RBGKwO4YEQb0Uy', 'Passenger', '10000004', '2024-03-01 00:00:00'),
    (8,  'patriciadavis','patriciadavis@example.com','$2b$10$5QZX.QyPv0QNfnCjhz5EYOYJWzEL3X5tGz6HqF3RBGKwO4YEQb0Uy', 'Passenger', '10000005', '2024-03-01 00:00:00'),
    (9,  'michaelmiller','michaelmiller@example.com','$2b$10$5QZX.QyPv0QNfnCjhz5EYOYJWzEL3X5tGz6HqF3RBGKwO4YEQb0Uy', 'Passenger', '10000006', '2024-03-01 00:00:00'),
    (10, 'lindawilson',  'lindawilson@example.com',  '$2b$10$5QZX.QyPv0QNfnCjhz5EYOYJWzEL3X5tGz6HqF3RBGKwO4YEQb0Uy', 'Passenger', '10000007', '2024-03-01 00:00:00');