SELECT unit_id, serial_num, manufacturer_name, part_number, unit_name, pallet_name, bay, unit_description, ticket_id FROM units 
    INNER JOIN unit_types 
        INNER JOIN manufacturers 
            ON unit_types.manufacturer_id = manufacturers.manufacturer_id 
        ON units.unit_type_id = unit_types.unit_type_id
    INNER JOIN pallets 
        ON units.pallet_id = pallets.pallet_id;

SELECT * FROM tickets WHERE ticket_id = 'b63f1b75-d786-4cd5-aa4e-359ce2407e76'

