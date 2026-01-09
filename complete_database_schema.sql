-- Complete Database Schema for Devasahayam Mount Shrine Website
-- This file contains all necessary tables for Mass Booking and Donation functionality
-- Execute this in PostgreSQL (pgAdmin or command line)

-- =====================================================
-- DROP EXISTING TABLES (if you want to start fresh)
-- =====================================================
-- Uncomment the following lines if you want to recreate tables
/*
DROP TABLE IF EXISTS donation_payments CASCADE;
DROP TABLE IF EXISTS donations CASCADE;
DROP TABLE IF EXISTS mass_booking_payments CASCADE;
DROP TABLE IF EXISTS mass_bookings CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS donation_purposes CASCADE;
*/

-- =====================================================
-- DONATION PURPOSES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS donation_purposes (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default donation purposes
INSERT INTO donation_purposes (name, description) VALUES
('General Donation', 'General support for shrine maintenance and activities'),
('Feast Day Celebration', 'Support for special feast day celebrations and events'),
('Shrine Renovation', 'Contributions for shrine building maintenance and renovation'),
('Charity Work', 'Support for charitable activities and community service'),
('Education Fund', 'Support for educational programs and scholarships'),
('Poor Relief', 'Direct assistance to needy families and individuals')
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- DONATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS donations (
    id SERIAL PRIMARY KEY,
    donor_name VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    purpose VARCHAR(255) NOT NULL,
    purpose_id INTEGER REFERENCES donation_purposes(id),
    donation_type VARCHAR(50) DEFAULT 'online' CHECK (donation_type IN ('online', 'offline', 'cash')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
    payment_method VARCHAR(50) DEFAULT 'upi' CHECK (payment_method IN ('upi', 'cash', 'cheque', 'bank_transfer')),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- MASS BOOKINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS mass_bookings (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    start_date DATE NOT NULL,
    preferred_time VARCHAR(10) NOT NULL,
    intention_type VARCHAR(50) NOT NULL CHECK (intention_type IN ('Thanksgiving', 'Petition', 'Memorial')),
    intention_description TEXT NOT NULL,
    number_of_days INTEGER NOT NULL DEFAULT 1 CHECK (number_of_days > 0),
    total_amount DECIMAL(10, 2) NOT NULL CHECK (total_amount > 0),
    price_per_mass DECIMAL(10, 2) DEFAULT 150.00,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed')),
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- UNIFIED PAYMENTS TABLE (for both donations and mass bookings)
-- =====================================================
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    purpose VARCHAR(255) NOT NULL,
    payment_type VARCHAR(50) NOT NULL CHECK (payment_type IN ('donation', 'mass_booking')),
    utr_number VARCHAR(50) NOT NULL,
    screenshot_path VARCHAR(500) NOT NULL,
    screenshot_name VARCHAR(255) NOT NULL,
    
    -- For mass booking payments
    mass_details JSONB,
    mass_booking_id INTEGER REFERENCES mass_bookings(id),
    
    -- For donation payments
    donation_id INTEGER REFERENCES donations(id),
    donation_purpose VARCHAR(255),
    
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
    admin_notes TEXT,
    verified_by VARCHAR(100),
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- PRAYER REQUESTS TABLE (if not exists)
-- =====================================================
CREATE TABLE IF NOT EXISTS prayer_requests (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    prayer_request TEXT NOT NULL,
    is_urgent BOOLEAN DEFAULT false,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'answered', 'archived')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TESTIMONIES TABLE (if not exists)
-- =====================================================
CREATE TABLE IF NOT EXISTS testimonies (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    testimony TEXT NOT NULL,
    location VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    featured BOOLEAN DEFAULT false,
    admin_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- CONTACT MESSAGES TABLE (if not exists)
-- =====================================================
CREATE TABLE IF NOT EXISTS contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied', 'archived')),
    admin_reply TEXT,
    replied_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Donation indexes
CREATE INDEX IF NOT EXISTS idx_donations_status ON donations(status);
CREATE INDEX IF NOT EXISTS idx_donations_purpose ON donations(purpose);
CREATE INDEX IF NOT EXISTS idx_donations_created_at ON donations(created_at);
CREATE INDEX IF NOT EXISTS idx_donations_amount ON donations(amount);
CREATE INDEX IF NOT EXISTS idx_donations_donor_name ON donations(donor_name);
CREATE INDEX IF NOT EXISTS idx_donations_email ON donations(email);

-- Mass booking indexes
CREATE INDEX IF NOT EXISTS idx_mass_bookings_status ON mass_bookings(status);
CREATE INDEX IF NOT EXISTS idx_mass_bookings_date ON mass_bookings(start_date);
CREATE INDEX IF NOT EXISTS idx_mass_bookings_created_at ON mass_bookings(created_at);
CREATE INDEX IF NOT EXISTS idx_mass_bookings_intention_type ON mass_bookings(intention_type);
CREATE INDEX IF NOT EXISTS idx_mass_bookings_email ON mass_bookings(email);
CREATE INDEX IF NOT EXISTS idx_mass_bookings_name ON mass_bookings(name);

-- Payment indexes
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_purpose ON payments(purpose);
CREATE INDEX IF NOT EXISTS idx_payments_payment_type ON payments(payment_type);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at);
CREATE INDEX IF NOT EXISTS idx_payments_utr ON payments(utr_number);
CREATE INDEX IF NOT EXISTS idx_payments_amount ON payments(amount);
CREATE INDEX IF NOT EXISTS idx_payments_mass_booking_id ON payments(mass_booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_donation_id ON payments(donation_id);

-- Other table indexes
CREATE INDEX IF NOT EXISTS idx_prayer_requests_status ON prayer_requests(status);
CREATE INDEX IF NOT EXISTS idx_prayer_requests_created_at ON prayer_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_testimonies_status ON testimonies(status);
CREATE INDEX IF NOT EXISTS idx_testimonies_featured ON testimonies(featured);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at);

-- =====================================================
-- TRIGGERS FOR AUTOMATIC TIMESTAMP UPDATES
-- =====================================================

-- Create or replace the trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to all tables
CREATE TRIGGER update_donations_updated_at 
    BEFORE UPDATE ON donations 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mass_bookings_updated_at 
    BEFORE UPDATE ON mass_bookings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at 
    BEFORE UPDATE ON payments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_prayer_requests_updated_at 
    BEFORE UPDATE ON prayer_requests 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_testimonies_updated_at 
    BEFORE UPDATE ON testimonies 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contact_messages_updated_at 
    BEFORE UPDATE ON contact_messages 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_donation_purposes_updated_at 
    BEFORE UPDATE ON donation_purposes 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- VIEWS FOR ADMIN DASHBOARD
-- =====================================================

-- Mass booking summary view
CREATE OR REPLACE VIEW mass_booking_summary AS
SELECT 
    COUNT(*) as total_bookings,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_bookings,
    COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_bookings,
    COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_bookings,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_bookings,
    SUM(total_amount) as total_amount,
    SUM(CASE WHEN status = 'approved' THEN total_amount ELSE 0 END) as approved_amount,
    AVG(total_amount) as average_amount,
    AVG(number_of_days) as average_days
FROM mass_bookings;

-- Donation summary view
CREATE OR REPLACE VIEW donation_summary AS
SELECT 
    COUNT(*) as total_donations,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_donations,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_donations,
    COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_donations,
    SUM(amount) as total_amount,
    SUM(CASE WHEN status = 'completed' THEN amount ELSE 0 END) as completed_amount,
    AVG(amount) as average_amount
FROM donations;

-- Payment summary view
CREATE OR REPLACE VIEW payment_summary AS
SELECT 
    COUNT(*) as total_payments,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_payments,
    COUNT(CASE WHEN status = 'verified' THEN 1 END) as verified_payments,
    COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_payments,
    SUM(amount) as total_amount,
    SUM(CASE WHEN status = 'verified' THEN amount ELSE 0 END) as verified_amount,
    COUNT(CASE WHEN payment_type = 'donation' THEN 1 END) as donation_payments,
    COUNT(CASE WHEN payment_type = 'mass_booking' THEN 1 END) as mass_booking_payments
FROM payments;

-- Monthly statistics view
CREATE OR REPLACE VIEW monthly_statistics AS
SELECT 
    DATE_TRUNC('month', created_at) as month,
    'donations' as type,
    COUNT(*) as count,
    SUM(amount) as total_amount
FROM donations
GROUP BY DATE_TRUNC('month', created_at)
UNION ALL
SELECT 
    DATE_TRUNC('month', created_at) as month,
    'mass_bookings' as type,
    COUNT(*) as count,
    SUM(total_amount) as total_amount
FROM mass_bookings
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC, type;

-- =====================================================
-- SAMPLE DATA (OPTIONAL - UNCOMMENT TO INSERT)
-- =====================================================

/*
-- Sample mass bookings
INSERT INTO mass_bookings (name, email, phone, start_date, preferred_time, intention_type, intention_description, number_of_days, total_amount) VALUES
('John Doe', 'john@example.com', '9876543210', '2026-01-15', '06:00', 'Thanksgiving', 'Thanksgiving for good health and prosperity of my family', 1, 150.00),
('Mary Smith', 'mary@example.com', '9876543211', '2026-01-16', '18:00', 'Memorial', 'In loving memory of my beloved father who passed away last year. May his soul rest in peace.', 7, 1050.00),
('Peter Johnson', 'peter@example.com', '9876543212', '2026-01-20', '09:00', 'Petition', 'For success in my upcoming job interview and career growth. Please pray for Gods guidance.', 3, 450.00),
('Sarah Wilson', 'sarah@example.com', '9876543213', '2026-01-25', '06:00', 'Thanksgiving', 'Thanksgiving for the safe delivery of my baby and good health of mother and child', 1, 150.00),
('David Brown', 'david@example.com', '9876543214', '2026-02-01', '18:00', 'Memorial', 'In memory of my grandmother who was very devoted to Saint Devasahayam', 30, 4500.00);

-- Sample donations
INSERT INTO donations (donor_name, email, phone, amount, purpose, donation_type, status) VALUES
('Alice Johnson', 'alice@example.com', '9876543215', 1000.00, 'General Donation', 'online', 'completed'),
('Bob Smith', 'bob@example.com', '9876543216', 500.00, 'Feast Day Celebration', 'online', 'pending'),
('Carol Davis', 'carol@example.com', '9876543217', 2000.00, 'Shrine Renovation', 'online', 'completed'),
('Daniel Wilson', 'daniel@example.com', '9876543218', 750.00, 'Charity Work', 'online', 'completed'),
('Eva Martinez', 'eva@example.com', '9876543219', 300.00, 'Education Fund', 'online', 'pending');

-- Sample payment submissions
INSERT INTO payments (name, email, phone, amount, purpose, payment_type, utr_number, screenshot_path, screenshot_name, mass_details, donation_purpose) VALUES
('John Doe', 'john@example.com', '9876543210', 150.00, 'Mass Booking', 'mass_booking', '123456789012', '/uploads/payments/sample1.jpg', 'sample1.jpg', '{"startDate": "2026-01-15", "preferredTime": "06:00", "intentionType": "Thanksgiving", "numberOfDays": 1}', NULL),
('Alice Johnson', 'alice@example.com', '9876543215', 1000.00, 'General Donation', 'donation', '123456789013', '/uploads/payments/sample2.jpg', 'sample2.jpg', NULL, 'General Donation'),
('Mary Smith', 'mary@example.com', '9876543211', 1050.00, 'Mass Booking', 'mass_booking', '123456789014', '/uploads/payments/sample3.jpg', 'sample3.jpg', '{"startDate": "2026-01-16", "preferredTime": "18:00", "intentionType": "Memorial", "numberOfDays": 7}', NULL);
*/

-- =====================================================
-- CONSTRAINTS AND ADDITIONAL VALIDATIONS
-- =====================================================

-- Add constraint to ensure mass booking dates are not in the past
ALTER TABLE mass_bookings ADD CONSTRAINT check_future_date 
CHECK (start_date >= CURRENT_DATE);

-- Add constraint to ensure reasonable number of days (max 365)
ALTER TABLE mass_bookings ADD CONSTRAINT check_reasonable_days 
CHECK (number_of_days <= 365);

-- Add constraint to ensure UTR numbers are reasonable length
ALTER TABLE payments ADD CONSTRAINT check_utr_length 
CHECK (LENGTH(utr_number) >= 10);

-- =====================================================
-- PERMISSIONS (ADJUST AS NEEDED)
-- =====================================================
-- Uncomment and modify these lines based on your database user setup
/*
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_app_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_app_user;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO your_app_user;
*/

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================
COMMENT ON TABLE donations IS 'Stores donation records from the website';
COMMENT ON TABLE mass_bookings IS 'Stores mass booking requests with enhanced intention types and multi-day support';
COMMENT ON TABLE payments IS 'Unified table for storing payment submissions with UTR numbers and screenshot proofs for both donations and mass bookings';
COMMENT ON TABLE donation_purposes IS 'Predefined donation categories and purposes';

COMMENT ON COLUMN mass_bookings.intention_type IS 'Type of mass intention: Thanksgiving, Petition, or Memorial';
COMMENT ON COLUMN mass_bookings.number_of_days IS 'Number of consecutive days for the same mass intention';
COMMENT ON COLUMN mass_bookings.price_per_mass IS 'Price per individual mass (default ₹150)';

COMMENT ON COLUMN payments.utr_number IS 'UPI transaction reference number for payment verification';
COMMENT ON COLUMN payments.screenshot_path IS 'File path to the payment screenshot';
COMMENT ON COLUMN payments.mass_details IS 'JSON object containing mass booking details';
COMMENT ON COLUMN payments.payment_type IS 'Type of payment: donation or mass_booking';

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
SELECT 'Complete Database Schema for Devasahayam Mount Shrine Website created successfully!' as message,
       'Tables created: donations, mass_bookings, payments, donation_purposes, prayer_requests, testimonies, contact_messages' as tables_info,
       'Views created: mass_booking_summary, donation_summary, payment_summary, monthly_statistics' as views_info,
       'All indexes, triggers, and constraints have been applied' as additional_info;