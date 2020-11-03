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
INSERT INTO manufacturers (name)
VALUES ('Roborock Robot');

INSERT INTO pallets (name, bay, description)
VALUES ('INNPLLT082420001', 1, 'dummy pallet');
INSERT INTO pallets (name, bay, description)
VALUES ('INNPLLT090620001', 1, 'dummy pallet 2');

INSERT INTO ticket_types (name)
VALUES ('RMA');
INSERT INTO ticket_types (name)
VALUES ('RGA');

INSERT INTO customers (name, email, phone, address1, address2, city, state, zipcode, country)
VALUES ('PowerVision Robot', 'support.us@powervision.me', '855-562-6699', '9570 Pan American Dr.', 'DOCK #6', 'El Paso', 'TX', '79928', 'USA');
INSERT INTO customers (name, email, phone, address1, address2, city, state, zipcode, country)
VALUES ('Roborock Robot', 'support.us@powervision.me', '855-562-6699', '9570 Pan American Dr.', 'DOCK #6', 'El Paso', 'TX', '79928', 'USA');
INSERT INTO customers (name, email, phone, address1, address2, city, state, zipcode, country)
VALUES ('John Doe', 'john.doe@domain.com', '123-456-7890', '123 Main St.', 'APT A', 'El Paso', 'TX', '79928', 'USA');


INSERT INTO unit_types (name, pn, manufacturer_id, description)
SELECT 'PowerEgg', 'PEG10', manufacturers.id,'Egg shaped areal drone'
FROM manufacturers
WHERE manufacturers.name = 'PowerVision Robot';
INSERT INTO unit_types (name, pn, manufacturer_id, description)
SELECT 'PowerRay Wizard', 'PRW10', manufacturers.id,'Underwater drone with wizard kit'
FROM manufacturers
WHERE manufacturers.name = 'PowerVision Robot';
INSERT INTO unit_types (name, pn, manufacturer_id, description)
SELECT 'S6', 'S6-IE3', manufacturers.id,'Smart vaccuum cleaner'
FROM manufacturers
WHERE manufacturers.name = 'Roborock Robot';

INSERT INTO tickets (name, ticket_type_id, customer_id)
SELECT '0001', ticket_types.id, customers.id
FROM ticket_types, customers
WHERE ticket_types.name = 'RMA'
AND customers.name = 'John Doe';
INSERT INTO tickets (name, ticket_type_id, customer_id)
SELECT '0002', ticket_types.id, customers.id
FROM ticket_types, customers
WHERE ticket_types.name = 'RGA'
AND customers.name = 'PowerVision Robot';
INSERT INTO tickets (name, ticket_type_id, customer_id)
SELECT '0002', ticket_types.id, customers.id
FROM ticket_types, customers
WHERE ticket_types.name = 'RGA'
AND customers.name = 'Roborock Robot ';

INSERT INTO locations (name, next_ids)
VALUES ('A Stock', '{"2", "3", "4"}');



insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3530709883269929', 3, 2, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('30115873787873', 2, 3, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('5610424850231062', 2, 1, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3575508175195198', 2, 3, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3577821092026471', 1, 1, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('56022236525593923', 3, 2, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3529470329409453', 1, 2, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('5602239778882410', 2, 3, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3573106128447717', 2, 1, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('4312302572461', 3, 2, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3588420332943038', 1, 2, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3531520775279523', 2, 3, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('5602228032739268', 3, 2, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3573330444193942', 2, 1, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3532014350902765', 1, 1, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3566916713397500', 1, 3, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3528722270162429', 2, 3, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('5602254050526437', 2, 3, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('560221509525045536', 2, 3, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3530709883269929', 3, 2, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3572196011616800', 3, 3, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('374622052856415', 2, 1, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('6709640134982394358', 2, 3, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3584059283086290', 3, 2, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3549886485535730', 3, 3, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('67066491349860867', 2, 2, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3566414388136700', 3, 2, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3532361944237145', 2, 2, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('50208493073173884', 1, 1, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('6304953333476326584', 2, 3, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3561419911211222', 3, 1, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3552883489912936', 2, 3, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('4903899287770335386', 3, 1, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('5602253147705677285', 1, 2, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3561353555032745', 2, 3, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('5100179925094542', 3, 1, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3575543830123731', 2, 3, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('490553696616671805', 3, 3, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3555040956079346', 1, 1, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('5018147464471968', 2, 3, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('5610505710835231', 2, 1, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3539072745638562', 3, 1, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('4544919028291389', 1, 1, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('30099195972449', 1, 3, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3589988991015933', 1, 1, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3534425957492372', 3, 1, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('4917393449592198', 1, 1, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3531635650778280', 3, 1, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3560149027006783', 1, 3, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3539923464960910', 1, 3, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('6331100125547591', 3, 3, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('5602227346546807', 3, 1, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3533312432411758', 1, 2, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('633110358758233503', 1, 1, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('349862416142753', 2, 1, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3543377861194108', 3, 2, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3560569695406991', 3, 2, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('676176533660630927', 3, 1, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3543522926788648', 3, 1, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3554082068876814', 3, 2, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3563411470988447', 3, 1, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3536148850350681', 2, 1, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('6763868951095524', 1, 2, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('5602247271669580', 1, 1, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3535933041585399', 2, 3, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('5421818731419979', 2, 1, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3575788555238400', 3, 3, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('4913255342866157', 3, 3, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3544215032176712', 2, 2, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3540420621439489', 1, 2, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3577446740099900', 2, 2, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3535983766058676', 2, 2, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('5565738727104748', 1, 1, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('374283443220264', 2, 3, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('6304768406537938', 1, 3, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3589241351817740', 1, 1, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('630414454616935634', 2, 2, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('6761363123082624414', 1, 2, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('4844973568328421', 3, 3, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('5641828844467952617', 3, 3, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3546259639607354', 3, 3, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('630458892927124215', 3, 3, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3562317183517814', 3, 1, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3560980427709976', 3, 1, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('5020231570140290137', 3, 3, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3576435639860044', 2, 3, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3551901966538098', 3, 3, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('201583328105012', 1, 1, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('374622634092711', 3, 2, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3533951901389993', 2, 1, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3559812416263504', 2, 1, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3534483362049089', 2, 2, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('201540132139926', 1, 3, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('201612388684499', 1, 2, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3545033019871612', 1, 2, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('5143664297021966', 2, 3, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3532001237063218', 3, 2, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('676356454259631055', 2, 1, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3533998242645344', 1, 3, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('4041595889102515', 1, 1, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3536898229019231', 2, 2, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('0604593210139562463', 1, 1, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('6397738774420544', 3, 2, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3565307707776704', 1, 2, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('5100174312098883', 1, 1, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3560586226472797', 2, 1, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('341632841868902', 3, 3, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('58936805644737537', 2, 2, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3550801962166541', 1, 3, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('5596600844072815', 2, 1, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('4017957352509669', 3, 2, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3558369829140168', 2, 2, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('5315106347744785', 1, 1, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('58939728851696674', 1, 2, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3570428075845815', 2, 1, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('374288722892519', 1, 2, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('201575429944265', 1, 1, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3557510763381646', 2, 3, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('337941518330872', 2, 3, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('6771518120745834441', 2, 3, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3538807661765845', 2, 3, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('5010129501379519', 3, 3, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3545186429740148', 1, 3, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('4026986532847391', 3, 3, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3534416528162776', 1, 2, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3549631331646962', 1, 1, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('6334540056763996952', 2, 2, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('6771337295503585', 3, 1, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3540668196072651', 3, 1, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('30143918958796', 1, 3, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3543703841601583', 3, 3, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3530392315917199', 1, 1, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('30115692511611', 2, 2, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('5610022385295402', 2, 2, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3541481765462371', 1, 2, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('4844273662479489', 1, 3, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('5468283513558037', 3, 3, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3534087475814733', 1, 1, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('5602217918067654', 1, 2, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3532667845136073', 3, 2, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('67630012730543438', 3, 1, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('5893013005876370997', 2, 1, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3560824368056544', 3, 2, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3580471346351906', 1, 3, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('63048671794801274', 2, 3, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3536780591423466', 3, 1, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('5048374425636240', 1, 2, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3534778416907129', 1, 3, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3579445579797566', 3, 3, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3574190542066831', 1, 1, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3558982980034895', 3, 2, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('6762764265149050', 1, 2, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3528037899412927', 2, 1, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('5455169429796081', 1, 2, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3560647081298477', 3, 1, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('4905344750667685', 2, 2, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3529851256077555', 3, 1, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3551952180675752', 3, 1, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('344709110846624', 3, 3, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('5018301834565195', 2, 1, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('201850791448868', 2, 1, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('337941577032542', 1, 3, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('503828488903704914', 2, 1, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3577153192597635', 2, 1, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3537683813365771', 2, 2, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('5610821413742073', 3, 2, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3571283843193330', 1, 1, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3570704992393299', 3, 2, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3566245834927122', 3, 1, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('201425173498250', 3, 1, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('6759063434162408', 2, 3, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('5602253071941807', 3, 2, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('372301154186169', 2, 1, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3552946832622112', 3, 3, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3557221550934288', 3, 1, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('5602216301731140', 1, 3, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('6334728975905282', 3, 1, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('6383883401960185', 2, 2, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('5602243451771353', 2, 3, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('675991498005555475', 2, 2, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('6331104458052293949', 2, 1, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('201879595406863', 1, 2, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3543247531312283', 2, 2, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3575127394147714', 2, 2, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3553068645995236', 3, 1, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('56022305460020737', 2, 3, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3551784830734824', 3, 1, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('5038795226908516334', 2, 3, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('5509345316860489', 3, 1, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('374283389732462', 2, 3, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3541549853977367', 2, 1, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3530042810238548', 3, 3, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('5610951045566747', 3, 3, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('5602254356521843', 3, 2, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('337941442486915', 3, 3, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('5641821660729981393', 1, 2, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3581280744195768', 1, 3, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('6333711930865982', 2, 2, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('3583496320681652', 3, 2, 1, 1);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('5100175072532862', 3, 3, 1, 2);
insert into units (sn, unit_type_id, ticket_id, location_id, pallet_id) values ('5108752964443820', 1, 1, 1, 1);
