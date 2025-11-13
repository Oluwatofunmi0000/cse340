-- Assignment 2 - Task 1 SQL Queries
-- Course Database CRUD Operations
-- 1. Insert Tony Stark into account table
INSERT INTO account (
        account_firstname,
        account_lastname,
        account_email,
        account_password
    )
VALUES (
        'Tony',
        'Stark',
        'tony@starkent.com',
        'Iam1ronM@n'
    );
-- 2. Update Tony Stark account_type to 'Admin'
UPDATE account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';
-- 3. Delete Tony Stark from account table
DELETE FROM account
WHERE account_email = 'tony@starkent.com';
-- 4. Update GM Hummer description to replace 'small interiors' with 'a huge interior'
UPDATE inventory
SET inv_description = REPLACE(
        inv_description,
        'small interiors',
        'a huge interior'
    )
WHERE inv_make = 'GM'
    AND inv_model = 'Hummer';
-- 5. Select make, model, and classification name for Sport category using INNER JOIN
SELECT inv.inv_make,
    inv.inv_model,
    cls.classification_name
FROM inventory inv
    INNER JOIN classification cls ON inv.classification_id = cls.classification_id
WHERE cls.classification_name = 'Sport';
-- 6. Update inv_image and inv_thumbnail paths to add '/vehicles'
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');