CREATE TABLE pallets (
    id SERIAL primary key,
    name varchar(16) NOT NULL,
    bay smallserial NOT NULL,
    description varchar(128) NOT NULL
);

CREATE TABLE locations (

id SERIAL primary key,
name varChar(30) NOT NULL,
super_id SMALLINT,
next_ids SMALLINT []
);

CREATE TABLE manufacturers (
    id SERIAL primary key,
    name varchar(30) NOT NULL
);

CREATE TABLE ticket_types (
    id SERIAL primary key,
    name varChar(10) NOT NULL
);

CREATE TABLE customers (
    id SERIAL primary key,
    name varChar(50) NOT NULL,
    email varChar(50) NOT NULL,
    phone varChar(15) NOT NULL,
    address1  varChar(50) NOT NULL,
    address2 varChar(50) NOT NULL,
    city varChar(50) NOT NULL,
    state  varChar(10) NOT NULL,
    zipcode varChar(10) NOT NULL,
    country varChar(10) NOT NULL
);

CREATE TABLE unit_types (
    id SERIAL primary key,
    name varchar(30) NOT NULL,
    pn varchar(30) NOT NULL,
    manufacturer_id SERIAL references manufacturers(id),
    description varchar(128) NOT NULL
);

CREATE TABLE tickets (
    id SERIAL primary key,
    name varChar(30) NOT NULL,
    ticket_type_id SERIAL references ticket_types(id),
    customer_id SERIAL references customers(id)
);


CREATE TABLE units (

    id SERIAL primary key,
    sn varChar(30) NOT NULL,
    unit_type_id SERIAL references unit_types(id), 
    ticket_id SERIAL references tickets(id),
    pallet_id SERIAL references pallets(id),
    location_id SERIAL references locations(id)
);

CREATE TABLE users (

    id SERIAL primary key,
    username varChar(30) NOT NULL,
    email varChar(30) NOT NULL,
    password text NOT NULL,
    admin BOOLEAN NOT NULL
);

INSERT INTO manufacturers (name)
VALUES ('PowerVision Robot');

INSERT INTO pallets (name, bay, description)
VALUES ('INNPLLT082420001', 1, 'dummy pallet');

INSERT INTO ticket_types (name)
VALUES ('RMA');

INSERT INTO customers (name, email, phone, address1, address2, city, state, zipcode, country)
VALUES ('PowerVision Robot', 'support.us@powervision.me', '855-562-6699', '9570 Pan American Dr.', 'DOCK #6', 'El Paso', 'TX', '79928', 'USA');

INSERT INTO unit_types (name, pn, manufacturer_id, description)
SELECT 'PowerEgg', 'PEG10', manufacturers.id,'Egg shaped areal drone'
FROM manufacturers
WHERE manufacturers.name = 'PowerVision Robot';

INSERT INTO tickets (name, ticket_type_id, customer_id)
SELECT '0001', ticket_types.id, customers.id
FROM ticket_types, customers
WHERE ticket_types.name = 'RMA'
AND customers.name = 'PowerVision Robot';

INSERT INTO locations (name, next_ids)
VALUES ('A Stock', '{"2", "3", "4"}');

INSERT INTO units (sn, unit_type_id, ticket_id, pallet_id, location_id)
SELECT '110AAAA0000000', unit_types.id, tickets.id, pallets.id, locations.id
FROM unit_types, tickets, pallets, locations
WHERE unit_types.name = 'PowerEgg'
AND tickets.name = '0001'
AND pallets.name = 'INNPLLT082420001'
AND locations.name = 'A Stock';