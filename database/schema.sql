-- =============================================================
-- Real Estate India - MySQL Database Schema
-- =============================================================

CREATE DATABASE IF NOT EXISTS real_estate_india
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE real_estate_india;

-- -------------------------------------------------------------
-- Users
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(100)  NOT NULL,
  email        VARCHAR(150)  NOT NULL UNIQUE,
  password     VARCHAR(255)  NOT NULL,
  phone        VARCHAR(15),
  role         ENUM('buyer','seller','admin') NOT NULL DEFAULT 'buyer',
  avatar       VARCHAR(500)  DEFAULT NULL,
  is_active    TINYINT(1)    NOT NULL DEFAULT 1,
  created_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- -------------------------------------------------------------
-- Properties
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS properties (
  id             INT AUTO_INCREMENT PRIMARY KEY,
  title          VARCHAR(200)  NOT NULL,
  description    TEXT,
  price          BIGINT        NOT NULL,
  price_type     ENUM('sale','rent') NOT NULL DEFAULT 'sale',
  property_type  ENUM('flat','villa','plot','commercial','house') NOT NULL,
  bhk            TINYINT       DEFAULT NULL,   -- NULL for plots/commercial
  area_sqft      DECIMAL(10,2) DEFAULT NULL,
  location_city  VARCHAR(100)  NOT NULL,
  location_area  VARCHAR(100)  DEFAULT NULL,
  location_address TEXT        DEFAULT NULL,
  latitude       DECIMAL(10,7) DEFAULT NULL,
  longitude      DECIMAL(10,7) DEFAULT NULL,
  amenities      JSON          DEFAULT NULL,
  status         ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
  owner_id       INT           NOT NULL,
  views          INT           NOT NULL DEFAULT 0,
  created_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_prop_owner FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- -------------------------------------------------------------
-- Property Images
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS property_images (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT          NOT NULL,
  image_url   VARCHAR(500) NOT NULL,
  is_primary  TINYINT(1)   NOT NULL DEFAULT 0,
  CONSTRAINT fk_img_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- -------------------------------------------------------------
-- Favorites / Wishlist
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS favorites (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  property_id INT NOT NULL,
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_fav (user_id, property_id),
  CONSTRAINT fk_fav_user     FOREIGN KEY (user_id)     REFERENCES users(id)      ON DELETE CASCADE,
  CONSTRAINT fk_fav_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- -------------------------------------------------------------
-- Contact / Enquiry Requests
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS contact_requests (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT          DEFAULT NULL,
  property_id INT          DEFAULT NULL,
  name        VARCHAR(100) NOT NULL,
  email       VARCHAR(150) NOT NULL,
  phone       VARCHAR(15)  DEFAULT NULL,
  message     TEXT,
  status      ENUM('pending','responded') NOT NULL DEFAULT 'pending',
  created_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_contact_user     FOREIGN KEY (user_id)     REFERENCES users(id)      ON DELETE SET NULL,
  CONSTRAINT fk_contact_property FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- =============================================================
-- SEED DATA
-- =============================================================

-- Admin user  (password: Admin@123)
INSERT INTO users (name, email, password, phone, role) VALUES
('Admin User', 'admin@realestateindia.com',
 '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '9999999999', 'admin');

-- Seller user  (password: Test@1234)
INSERT INTO users (name, email, password, phone, role) VALUES
('Rajesh Kumar', 'rajesh@example.com',
 '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', '9876543210', 'seller');

-- Properties (owner_id = 2 = Rajesh the seller)
INSERT INTO properties
  (title, description, price, price_type, property_type, bhk, area_sqft,
   location_city, location_area, location_address, latitude, longitude,
   amenities, status, owner_id)
VALUES
('Luxurious 3 BHK Flat in Bandra',
 'Spacious sea-facing apartment with premium fittings, modular kitchen, and 24/7 security.',
 25000000, 'sale', 'flat', 3, 1450.00,
 'Mumbai', 'Bandra West', 'Turner Road, Bandra West, Mumbai - 400050',
 19.0596, 72.8295,
 '["Swimming Pool","Gym","Parking","CCTV","24x7 Security","Power Backup"]',
 'approved', 2),

('2 BHK Apartment in Whitefield',
 'Modern apartment in IT hub, close to offices and malls.',
 8500000, 'sale', 'flat', 2, 1100.00,
 'Bangalore', 'Whitefield', 'ITPL Main Road, Whitefield, Bengaluru - 560066',
 12.9698, 77.7499,
 '["Gym","Children Play Area","Parking","Elevator","Power Backup"]',
 'approved', 2),

('Premium Villa in Gurgaon',
 'Independent villa with private garden, modular kitchen and smart home features.',
 55000000, 'sale', 'villa', 4, 3500.00,
 'Delhi', 'DLF Phase 5, Gurgaon', 'Golf Course Road, Gurgaon - 122001',
 28.4089, 77.0524,
 '["Private Garden","Swimming Pool","Home Theatre","Gym","3 Car Parking","CCTV"]',
 'approved', 2),

('Commercial Office Space in Pune',
 'Grade-A office space in the heart of Pune''s IT corridor.',
 35000000, 'sale', 'commercial', NULL, 2200.00,
 'Pune', 'Hinjewadi', 'Hinjewadi Phase 1, Pune - 411057',
 18.5912, 73.7389,
 '["24x7 Power","High-speed Internet","Cafeteria","Parking","Conference Rooms"]',
 'approved', 2),

('Residential Plot in Hyderabad',
 'Prime 1500 sq ft plot in gated community with all amenities.',
 7500000, 'sale', 'plot', NULL, 1500.00,
 'Hyderabad', 'Narsingi', 'Narsingi, Hyderabad - 500075',
 17.3850, 78.3867,
 '["Gated Community","24x7 Security","Water Supply","Electricity","Park"]',
 'approved', 2),

('3 BHK Flat for Rent in Andheri',
 'Fully furnished apartment near metro, ideal for working professionals.',
 65000, 'rent', 'flat', 3, 1200.00,
 'Mumbai', 'Andheri West', 'DN Nagar, Andheri West, Mumbai - 400053',
 19.1297, 72.8378,
 '["Fully Furnished","AC","Washing Machine","WiFi","Parking","Security"]',
 'approved', 2),

('2 BHK House in Koramangala',
 'Independent house in prime Bangalore location with terrace access.',
 42000, 'rent', 'house', 2, 950.00,
 'Bangalore', 'Koramangala', '5th Block, Koramangala, Bengaluru - 560034',
 12.9279, 77.6271,
 '["Terrace","Parking","Bore Well","Security"]',
 'approved', 2),

('4 BHK Luxury Flat in South Delhi',
 'Ultra luxury apartment with panoramic city views and world-class amenities.',
 95000000, 'sale', 'flat', 4, 4200.00,
 'Delhi', 'Vasant Vihar', 'Vasant Vihar, New Delhi - 110057',
 28.5642, 77.1652,
 '["Swimming Pool","Gym","Concierge","Spa","3 Parking","CCTV","Club House"]',
 'approved', 2);

-- Property images (using Unsplash for demo)
INSERT INTO property_images (property_id, image_url, is_primary) VALUES
(1, 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800', 1),
(1, 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800', 0),
(2, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800', 1),
(2, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', 0),
(3, 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800', 1),
(3, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', 0),
(4, 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800', 1),
(5, 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800', 1),
(6, 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800', 1),
(7, 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800', 1),
(8, 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800', 1);
