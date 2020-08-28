CREATE EXTENSION IF NOT EXISTS "SERIAL-ossp";

CREATE TABLE pallets (
    pallet_id SERIAL primary key,
    pallet_name varchar(16) NOT NULL,
    bay smallserial NOT NULL,
    about varchar(128) NOT NULL,
    UNIQUE(pallet_id, bay)
);

CREATE TABLE manufacturers (
    manufacturer_id SERIAL primary key,
    manufacturer_name varchar(30) NOT NULL
);

CREATE TABLE unit_types (
    unit_type_id SERIAL primary key,
    unit_name varchar(30) NOT NULL,
    part_number varchar(30) NOT NULL,
    manufacturer_id SERIAL references manufacturers(manufacturer_id),
    unit_description varchar(128) NOT NULL
);

CREATE TABLE ticket_types (
    ticket_type_id SERIAL primary key,
    ticket_type_name varChar(10) NOT NULL
);

CREATE TABLE customers (
    customer_id SERIAL primary key,
    customer_name varChar(50) NOT NULL,
    customer_email varChar(50) NOT NULL,
    customer_phone varChar(15) NOT NULL,
    customer_address_1  varChar(50) NOT NULL,
    customer_address_2 varChar(50) NOT NULL,
    customer_city varChar(50) NOT NULL,
    customer_state  varChar(10) NOT NULL,
    customer_zip_code varChar(10) NOT NULL,
    customer_country varChar(10) NOT NULL
);

CREATE TABLE tickets (
    ticket_id SERIAL primary key,
    ticket_name varChar(30) NOT NULL,
    ticket_type_id SERIAL references ticket_types(ticket_type_id),
    customer_id SERIAL references customers(customer_id)
);


CREATE TABLE units (

    unit_id SERIAL primary key,
    serial_num varChar(30) NOT NULL,
    unit_type_id SERIAL references unit_types(unit_type_id), 
    ticket_id SERIAL references tickets(ticket_id),
    pallet_id SERIAL references pallets(pallet_id)
);

CREATE TABLE users (

    user_id SERIAL primary key,
    username varChar(30) NOT NULL,
    email varChar(30) NOT NULL,
    password text NOT NULL,
    is_admin BOOLEAN NOT NULL
);


CREATE TABLE locations (

location_id SERIAL primary key,
location_name varChar(30) NOT NULL,
super_location varChar(40),
next_location_ids varChar(40)[]
);


INSERT INTO manufacturers (manufacturer_name)
VALUES ('PowerVision Robot');

INSERT INTO pallets (pallet_name, bay, about)
VALUES ('INNPLLT082420001', 1, 'dummy pallet');

INSERT INTO ticket_types (ticket_type_name)
VALUES ('RMA');

INSERT INTO customers (customer_name, customer_email, customer_phone, customer_address_1, customer_address_2, customer_city, customer_state, customer_zip_code, customer_country)
VALUES ('PowerVision Robot', 'support.us@powervision.me', '855-562-6699', '9570 Pan American Dr.', 'DOCK #6', 'El Paso', 'TX', '79928', 'USA');

INSERT INTO unit_types (unit_name, part_number, manufacturer_id, unit_description)
SELECT 'PowerEgg', 'PEG10', manufacturers.manufacturer_id,'Egg shaped areal drone'
FROM manufacturers
WHERE manufacturers.manufacturer_name = 'PowerVision Robot';

INSERT INTO tickets (ticket_name, ticket_type_id, customer_id)
SELECT '0001', ticket_types.ticket_type_id, customers.customer_id
FROM ticket_types, customers
WHERE ticket_types.ticket_type_name = 'RMA'
AND customers.customer_name = 'PowerVision Robot';

INSERT INTO units (serial_num, unit_type_id, ticket_id, pallet_id)
SELECT '110AAAA0000000', unit_types.unit_type_id, tickets.ticket_id, pallets.pallet_id
FROM unit_types, tickets, pallets
WHERE unit_types.unit_name = 'PowerEgg'
AND tickets.ticket_name = '0001'
AND pallets.pallet_name = 'INNPLLT082420001';

/* 
INSERT INTO locations (location_id, location_name, next_location_ids)
VALUES ('1b0b1fe9-3a7f-41a9-88d9-8085cb85d970', 'A Stock', '{"44c14344-dda6-4741-b755-691f79895174", "159bca70-4945-4e5d-bb81-79a3a75db460", "008185d8-0324-4627-b817-6e9dd17538e3"}');
*/

