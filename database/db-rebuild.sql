-- Database Rebuild File
-- This file contains all SQL code to rebuild the course database
-- Including: CREATE TYPE, CREATE TABLES, INSERT data, and critical updates
-- ==================================================
-- CREATE TYPE
-- ==================================================
-- Create account_type ENUM if it doesn't exist
DO $$ BEGIN CREATE TYPE account_type AS ENUM ('Client', 'Employee', 'Admin');
EXCEPTION
WHEN duplicate_object THEN null;
END $$;
-- ==================================================
-- CREATE TABLES
-- ==================================================
-- Create classification table
CREATE TABLE IF NOT EXISTS classification (
    classification_id SERIAL PRIMARY KEY,
    classification_name VARCHAR(50) NOT NULL UNIQUE
);
-- Create inventory table
CREATE TABLE IF NOT EXISTS inventory (
    inv_id SERIAL PRIMARY KEY,
    inv_make VARCHAR(50) NOT NULL,
    inv_model VARCHAR(50) NOT NULL,
    inv_year INTEGER NOT NULL CHECK (inv_year >= 1900),
    inv_description TEXT NOT NULL,
    inv_image VARCHAR(200) NOT NULL,
    inv_thumbnail VARCHAR(200) NOT NULL,
    inv_price NUMERIC(10, 2) NOT NULL CHECK (inv_price >= 0),
    inv_miles INTEGER NOT NULL CHECK (inv_miles >= 0),
    inv_color VARCHAR(50) NOT NULL,
    classification_id INTEGER NOT NULL REFERENCES classification(classification_id) ON DELETE CASCADE
);
-- Create account table
CREATE TABLE IF NOT EXISTS account (
    account_id SERIAL PRIMARY KEY,
    account_firstname VARCHAR(50) NOT NULL,
    account_lastname VARCHAR(50) NOT NULL,
    account_email VARCHAR(100) NOT NULL UNIQUE,
    account_password VARCHAR(255) NOT NULL,
    account_type account_type DEFAULT 'Client'
);
-- ==================================================
-- INSERT DATA - CLASSIFICATION TABLE
-- ==================================================
INSERT INTO classification (classification_name)
VALUES ('Custom'),
    ('Sport'),
    ('SUV'),
    ('Truck'),
    ('Sedan') ON CONFLICT (classification_name) DO NOTHING;
-- ==================================================
-- INSERT DATA - INVENTORY TABLE
-- ==================================================
-- Get classification IDs for use in inventory inserts
DO $$
DECLARE custom_id INTEGER;
sport_id INTEGER;
suv_id INTEGER;
truck_id INTEGER;
sedan_id INTEGER;
BEGIN
SELECT classification_id INTO custom_id
FROM classification
WHERE classification_name = 'Custom';
SELECT classification_id INTO sport_id
FROM classification
WHERE classification_name = 'Sport';
SELECT classification_id INTO suv_id
FROM classification
WHERE classification_name = 'SUV';
SELECT classification_id INTO truck_id
FROM classification
WHERE classification_name = 'Truck';
SELECT classification_id INTO sedan_id
FROM classification
WHERE classification_name = 'Sedan';
-- Insert Custom vehicles
INSERT INTO inventory (
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
    )
VALUES (
        'DMC',
        'DeLorean',
        1981,
        'The DMC DeLorean is a rear-engine two-passenger sports car manufactured and marketed by John DeLorean''s DeLorean Motor Company (DMC) for the American market from 1981 until 1983—ultimately the only car ever produced by the company.',
        '/images/delorean.jpg',
        '/images/delorean-tn.jpg',
        55000.00,
        15000,
        'Silver',
        custom_id
    ) ON CONFLICT DO NOTHING;
-- Insert Sport vehicles
INSERT INTO inventory (
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
    )
VALUES (
        'Chevrolet',
        'Camaro',
        2018,
        'The Chevrolet Camaro is a mid-size American automobile manufactured by Chevrolet, classified as a pony car and some versions also as a muscle car. It went on sale on September 29, 1966, for the 1967 model year.',
        '/images/camaro.jpg',
        '/images/camaro-tn.jpg',
        35000.00,
        22000,
        'Yellow',
        sport_id
    ),
    (
        'Ford',
        'Mustang',
        2019,
        'The Ford Mustang is a series of American automobiles manufactured by Ford. In continuous production since 1964, the Mustang is currently the longest-produced Ford car nameplate.',
        '/images/mustang.jpg',
        '/images/mustang-tn.jpg',
        38000.00,
        18000,
        'Red',
        sport_id
    ) ON CONFLICT DO NOTHING;
-- Insert SUV vehicles
INSERT INTO inventory (
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
    )
VALUES (
        'GM',
        'Hummer',
        2016,
        'The Hummer is a brand of trucks and SUVs that was first marketed in 1992 when AM General began selling a civilian version of the M998 Humvee with small interiors.',
        '/images/hummer.jpg',
        '/images/hummer-tn.jpg',
        65000.00,
        30000,
        'Black',
        suv_id
    ),
    (
        'Jeep',
        'Wrangler',
        2020,
        'The Jeep Wrangler is a series of compact and mid-size four-wheel drive off-road SUVs manufactured by Jeep since 1986, and currently in its fourth generation.',
        '/images/wrangler.jpg',
        '/images/wrangler-tn.jpg',
        42000.00,
        12000,
        'Green',
        suv_id
    ) ON CONFLICT DO NOTHING;
-- Insert Truck vehicles
INSERT INTO inventory (
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
    )
VALUES (
        'Ford',
        'F-150',
        2021,
        'The Ford F-Series is a series of light-duty trucks marketed and manufactured by Ford since 1948. The most popular variant of the F-Series is the F-150.',
        '/images/f150.jpg',
        '/images/f150-tn.jpg',
        48000.00,
        8000,
        'Blue',
        truck_id
    ),
    (
        'Chevrolet',
        'Silverado',
        2020,
        'The Chevrolet Silverado is a range of trucks manufactured by General Motors under the Chevrolet brand.',
        '/images/silverado.jpg',
        '/images/silverado-tn.jpg',
        45000.00,
        15000,
        'White',
        truck_id
    ) ON CONFLICT DO NOTHING;
-- Insert Sedan vehicles
INSERT INTO inventory (
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
    )
VALUES (
        'Toyota',
        'Camry',
        2019,
        'The Toyota Camry is an automobile sold internationally by the Japanese auto manufacturer Toyota since 1982, spanning multiple generations.',
        '/images/camry.jpg',
        '/images/camry-tn.jpg',
        28000.00,
        25000,
        'Gray',
        sedan_id
    ),
    (
        'Honda',
        'Accord',
        2020,
        'The Honda Accord is a series of automobiles manufactured by Honda since 1976, best known for its four-door sedan variant.',
        '/images/accord.jpg',
        '/images/accord-tn.jpg',
        30000.00,
        20000,
        'Black',
        sedan_id
    ) ON CONFLICT DO NOTHING;
END $$;
-- ==================================================
-- CRITICAL UPDATES FROM ASSIGNMENT 2 TASK 1
-- These queries must run AFTER initial data population
-- ==================================================
-- Query 4: Update GM Hummer description to replace 'small interiors' with 'a huge interior'
UPDATE inventory
SET inv_description = REPLACE(
        inv_description,
        'small interiors',
        'a huge interior'
    )
WHERE inv_make = 'GM'
    AND inv_model = 'Hummer';
-- Query 6: Update inv_image and inv_thumbnail paths to add '/vehicles'
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');