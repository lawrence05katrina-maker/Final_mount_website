-- Enhanced Mass Booking Database Schema
-- This file contains all the necessary tables and indexes for the enhanced mass booking system

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS mass_booking_payments CASCADE;
DROP TABLE IF EXISTS mass_bookings CASCADE;

-- Create mass_bookings table
CREATE TABLE mass_bookings (
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
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create mass_booking_payments table for payment tracking with screenshots
CREATE TABLE mass_booking_payments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    purpose VARCHAR(255) NOT NULL,
    utr_number VARCHAR(50) NOT NULL,
    screenshot_path VARCHAR(500) NOT NULL,
    screenshot_name VARCHAR(255) NOT NULL,
    mass_details JSONB, -- Stores mass booking details as JSON
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create payments table for general donations (if not exists)
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
    purpose VARCHAR(255) NOT NULL,
    utr_number VARCHAR(50) NOT NULL,
    screenshot_path VARCHAR(500) NOT NULL,
    screenshot_name VARCHAR(255) NOT NULL,
    mass_details JSONB,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_mass_bookings_status ON mass_bookings(status);
CREATE INDEX idx_mass_bookings_date ON mass_bookings(start_date);
CREATE INDEX idx_mass_bookings_created_at ON mass_bookings(created_at);
CREATE INDEX idx_mass_bookings_intention_type ON mass_bookings(intention_type);
CREATE INDEX idx_mass_bookings_email ON mass_bookings(email);

CREATE INDEX idx_mass_booking_payments_status ON mass_booking_payments(status);
CREATE INDEX idx_mass_booking_payments_created_at ON mass_booking_payments(created_at);
CREATE INDEX idx_mass_booking_payments_utr ON mass_booking_payments(utr_number);
CREATE INDEX idx_mass_booking_payments_purpose ON mass_booking_payments(purpose);
CREATE INDEX idx_mass_booking_payments_amount ON mass_booking_payments(amount);

CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_purpose ON payments(purpose);
CREATE INDEX idx_payments_created_at ON payments(created_at);
CREATE INDEX idx_payments_utr ON payments(utr_number);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables
CREATE TRIGGER update_mass_bookings_updated_at 
    BEFORE UPDATE ON mass_bookings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mass_booking_payments_updated_at 
    BEFORE UPDATE ON mass_booking_payments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at 
    BEFORE UPDATE ON payments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing (optional)
-- Uncomment the following lines if you want sample data

/*
-- Sample mass bookings
INSERT INTO mass_bookings (name, email, phone, start_date, preferred_time, intention_type, intention_description, number_of_days, total_amount) VALUES
('John Doe', 'john@example.com', '9876543210', '2026-01-15', '06:00', 'Thanksgiving', 'Thanksgiving for good health and prosperity', 1, 150.00),
('Mary Smith', 'mary@example.com', '9876543211', '2026-01-16', '18:00', 'Memorial', 'In memory of my beloved father who passed away last year', 7, 1050.00),
('Peter Johnson', 'peter@example.com', '9876543212', '2026-01-20', '09:00', 'Petition', 'For success in my upcoming job interview and career growth', 3, 450.00);

-- Sample payment submissions
INSERT INTO mass_booking_payments (name, email, phone, amount, purpose, utr_number, screenshot_path, screenshot_name, mass_details) VALUES
('John Doe', 'john@example.com', '9876543210', 150.00, 'Mass Booking', '123456789012', '/uploads/payments/sample1.jpg', 'sample1.jpg', '{"startDate": "2026-01-15", "preferredTime": "06:00", "intentionType": "Thanksgiving", "numberOfDays": 1}'),
('Mary Smith', 'mary@example.com', '9876543211', 1050.00, 'Mass Booking', '123456789013', '/uploads/payments/sample2.jpg', 'sample2.jpg', '{"startDate": "2026-01-16", "preferredTime": "18:00", "intentionType": "Memorial", "numberOfDays": 7}');
*/

-- Create views for admin dashboard
CREATE OR REPLACE VIEW mass_booking_summary AS
SELECT 
    COUNT(*) as total_bookings,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_bookings,
    COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_bookings,
    COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_bookings,
    SUM(total_amount) as total_amount,
    SUM(CASE WHEN status = 'approved' THEN total_amount ELSE 0 END) as approved_amount
FROM mass_bookings;

CREATE OR REPLACE VIEW payment_summary AS
SELECT 
    COUNT(*) as total_payments,
    COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_payments,
    COUNT(CASE WHEN status = 'verified' THEN 1 END) as verified_payments,
    COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_payments,
    SUM(amount) as total_amount,
    SUM(CASE WHEN status = 'verified' THEN amount ELSE 0 END) as verified_amount
FROM mass_booking_payments;

-- Grant permissions (adjust as needed for your setup)
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO your_app_user;

-- Comments for documentation
COMMENT ON TABLE mass_bookings IS 'Stores mass booking requests with enhanced intention types and multi-day support';
COMMENT ON TABLE mass_booking_payments IS 'Stores payment submissions with UTR numbers and screenshot proofs';
COMMENT ON COLUMN mass_bookings.intention_type IS 'Type of mass intention: Thanksgiving, Petition, or Memorial';
COMMENT ON COLUMN mass_bookings.number_of_days IS 'Number of consecutive days for the same mass intention';
COMMENT ON COLUMN mass_booking_payments.utr_number IS 'UPI transaction reference number for payment verification';
COMMENT ON COLUMN mass_booking_payments.screenshot_path IS 'File path to the payment screenshot';
COMMENT ON COLUMN mass_booking_payments.mass_details IS 'JSON object containing mass booking details';

-- Success message
SELECT 'Enhanced Mass Booking Database Schema created successfully!' as message;