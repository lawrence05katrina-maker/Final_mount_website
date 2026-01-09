-- Management Team Table for Devasahayam Mount Shrine
-- Add this to your shrine_db database

CREATE TABLE IF NOT EXISTS management_team (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(500),
    image_name VARCHAR(255),
    image_size INTEGER,
    image_type VARCHAR(50),
    phone VARCHAR(20),
    email VARCHAR(100),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_management_active ON management_team(is_active);
CREATE INDEX IF NOT EXISTS idx_management_display_order ON management_team(display_order);
CREATE INDEX IF NOT EXISTS idx_management_created_at ON management_team(created_at);
CREATE INDEX IF NOT EXISTS idx_management_active_order ON management_team(is_active, display_order);

-- Insert sample data (based on the image you showed)
INSERT INTO management_team (name, position, description, display_order, is_active) VALUES
('Rev. Fr. S. Leon Henson', 'Parish Priest', 'Rev. Fr. S. Leon Henson serves as the dedicated Parish Priest, leading the congregation with spiritual guidance and pastoral care.', 1, true),
('Mr. Siluvai Dhasan', 'Vice President', 'Mr. Siluvai Dhasan is the Vice President of the parish council, ensuring effective administration and community engagement.', 2, true),
('Mr. David', 'Secretary', 'Mr. David serves as the Secretary, overseeing communications and ensuring smooth coordination of parish activities.', 3, true),
('Janate', 'Treasurer', 'Janate is the Treasurer, responsible for managing the parish''s finances and ensuring transparency in fiscal matters.', 4, true);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_management_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_management_updated_at
    BEFORE UPDATE ON management_team
    FOR EACH ROW
    EXECUTE FUNCTION update_management_updated_at();