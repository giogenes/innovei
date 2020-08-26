CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE pallets (
    pallet_id uuid DEFAULT uuid_generate_v4 () primary key,
    pallet_name varchar(16) NOT NULL,
    bay smallserial NOT NULL,
    about varchar(128) NOT NULL,
    UNIQUE(pallet_id, bay)
);

CREATE TABLE manufacturers (
    manufacturer_id uuid DEFAULT uuid_generate_v4 () primary key,
    manufacturer_name varchar(30) NOT NULL CHECK (LENGTH(manufacturer_name) > 0)
);

CREATE TABLE unit_types (
    unit_type_id uuid DEFAULT uuid_generate_v4 () primary key,
    unit_name varchar(30) NOT NULL,
    part_number varchar(30) NOT NULL,
    manufacturer_id uuid references manufacturers(manufacturer_id),
    unit_description varchar(128) NOT NULL
);

CREATE TABLE ticket_types (
    ticket_type_id uuid DEFAULT uuid_generate_v4 () primary key,
    ticket_type_name varChar(10) NOT NULL
);

CREATE TABLE customers (
    customer_id uuid DEFAULT uuid_generate_v4 () primary key,
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
    ticket_id uuid DEFAULT uuid_generate_v4 () primary key,
    ticket_name varChar(30) NOT NULL,
    ticket_type_id uuid references ticket_types(ticket_type_id),
    customer_id uuid references customers(customer_id)
);


CREATE TABLE units (

    unit_id uuid DEFAULT uuid_generate_v4 () primary key,
    serial_num varChar(30) NOT NULL,
    unit_type_id uuid references unit_types(unit_type_id), 
    ticket_id uuid references tickets(ticket_id),
    pallet_id uuid references pallets(pallet_id)
);


CREATE TABLE locations (

location_id uuid DEFAULT uuid_generate_v4 () primary key,
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

INSERT INTO locations (location_id, location_name, next_location_ids)
VALUES ('1b0b1fe9-3a7f-41a9-88d9-8085cb85d970', 'A Stock', '{"44c14344-dda6-4741-b755-691f79895174", "159bca70-4945-4e5d-bb81-79a3a75db460", "008185d8-0324-4627-b817-6e9dd17538e3"}');


DROP TABLE unit_types CASCADE;
DROP TABLE manufacturers CASCADE;
DROP TABLE pallets CASCADE;
DROP TABLE tickets CASCADE;
DROP TABLE unit_types CASCADE;
DROP TABLE ticket_types CASCADE;
DROP TABLE customers CASCADE;
DROP TABLE units CASCADE;
DROP TABLE locations CASCADE;

SELECT unit_id, serial_num, manufacturer_name, part_number, unit_name, pallet_name, bay, unit_description, ticket_id FROM units 
    INNER JOIN unit_types 
        INNER JOIN manufacturers 
            ON unit_types.manufacturer_id = manufacturers.manufacturer_id 
        ON units.unit_type_id = unit_types.unit_type_id
    INNER JOIN pallets 
        ON units.pallet_id = pallets.pallet_id;

SELECT * FROM tickets WHERE ticket_id = 'b63f1b75-d786-4cd5-aa4e-359ce2407e76'

