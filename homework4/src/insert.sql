INSERT INTO rental (rental_date, inventory_id, customer_id, staff_id, last_update)
VALUES (NOW(), 1, 1, 1, NOW());

SET @new_id = LAST_INSERT_ID();
SELECT CONCAT('New Rental ID created: ', @new_id) AS Status;

SELECT * FROM rental WHERE rental_id = @new_id;


INSERT INTO payment (customer_id, staff_id, rental_id, amount, payment_date, last_update)
VALUES (1, 1, 1, 4.99, NOW(), NOW());

SET @new_payment_id = LAST_INSERT_ID();

SELECT CONCAT('New Payment ID created: ', @new_payment_id) AS Status;

-- 4. View the record to ensure the timestamp is fresh
SELECT * FROM payment WHERE payment_id = @new_payment_id;