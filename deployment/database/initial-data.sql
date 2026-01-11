-- Initial Data for Devasahayam Mount Shrine
-- Run this after schema.sql

-- =============================================
-- ADMIN USER SETUP
-- =============================================

-- Insert default admin user
-- Username: admin
-- Password: admin123 (CHANGE THIS IMMEDIATELY!)
-- Password hash generated with bcrypt rounds=10
INSERT INTO admins (username, password, email, role, is_active) VALUES
('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin@devasahayammountshrine.com', 'admin', true)
ON CONFLICT (username) DO NOTHING;

-- =============================================
-- SAMPLE MANAGEMENT DATA
-- =============================================

-- Insert sample management/staff
INSERT INTO management (name, position, description, display_order, is_active) VALUES
('Rev. Fr. Parish Priest', 'Parish Priest', 'Leading the spiritual guidance of our shrine community', 1, true),
('Church Secretary', 'Secretary', 'Managing administrative affairs and communications', 2, true),
('Shrine Coordinator', 'Coordinator', 'Coordinating shrine activities and events', 3, true)
ON CONFLICT DO NOTHING;

-- =============================================
-- SAMPLE ANNOUNCEMENTS
-- =============================================

-- Insert sample announcements
INSERT INTO announcements (title, content, type, priority, is_active, start_date, end_date) VALUES
('Welcome to Devasahayam Mount Shrine', 'Welcome to our digital home. Stay connected with our community through this website.', 'general', 1, true, CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days'),
('Mass Timings', 'Daily Mass: 6:00 AM and 6:00 PM. Sunday Mass: 6:00 AM, 8:00 AM, and 6:00 PM', 'schedule', 2, true, CURRENT_DATE, CURRENT_DATE + INTERVAL '365 days'),
('Online Donations Available', 'You can now make donations online through our secure payment system.', 'announcement', 1, true, CURRENT_DATE, CURRENT_DATE + INTERVAL '60 days')
ON CONFLICT DO NOTHING;

-- =============================================
-- SAMPLE TESTIMONIES
-- =============================================

-- Insert sample testimonies (pre-approved)
INSERT INTO testimonies (name, location, testimony, category, is_approved, is_featured, display_order) VALUES
('Maria Joseph', 'Chennai', 'The peace and serenity I find at Devasahayam Mount Shrine is unmatched. It truly is a place of divine grace.', 'spiritual', true, true, 1),
('John Peter', 'Kanyakumari', 'My family has been blessed through the intercession of St. Devasahayam. We are forever grateful.', 'miracle', true, true, 2),
('Sarah Thomas', 'Nagercoil', 'The community here is so welcoming. Every visit strengthens my faith and brings me closer to God.', 'community', true, false, 3)
ON CONFLICT DO NOTHING;

-- =============================================
-- LIVESTREAM SETTINGS
-- =============================================

-- Update livestream settings with placeholder
UPDATE livestream_settings 
SET 
    platform = 'YouTube',
    stream_url = 'https://www.youtube.com/embed/PLACEHOLDER_VIDEO_ID',
    embed_code = '<iframe width="560" height="315" src="https://www.youtube.com/embed/PLACEHOLDER_VIDEO_ID" frameborder="0" allowfullscreen></iframe>',
    is_active = false,
    schedule_info = 'Live streaming available during special events and Sunday Mass'
WHERE id = 1;

-- =============================================
-- COMPLETION MESSAGE
-- =============================================

-- Display completion message
DO $
BEGIN
    RAISE NOTICE 'Initial data inserted successfully!';
    RAISE NOTICE 'Default admin user created: username=admin, password=admin123';
    RAISE NOTICE 'IMPORTANT: Change the admin password immediately after first login!';
    RAISE NOTICE 'Sample data added for management, announcements, and testimonies';
END $;