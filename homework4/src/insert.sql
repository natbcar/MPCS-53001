-- 1. Start the transaction
START TRANSACTION;

-- 2. Insert a test rental
-- Note: We use IDs that we know exist (Customer 1, Inventory 1, Staff 1)
INSERT INTO rental (rental_date, inventory_id, customer_id, staff_id, last_update)
VALUES (NOW(), 1, 1, 1, NOW());

-- 3. Capture the ID so you can verify it in SQLite
SET @new_id = LAST_INSERT_ID();
SELECT CONCAT('New Rental ID created: ', @new_id) AS Status;

-- STOP! Run your 'npm start incremental' command in your terminal now.
-- Once you verify the data is in SQLite, come back here.

-- 4. Undo the change
COMMIT;

-- 5. Verify it's gone
SELECT * FROM rental WHERE rental_id = @new_id;