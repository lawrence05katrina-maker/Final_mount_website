-- Fathers Database Schema
-- This file contains the complete database schema for managing fathers/priests information

-- Create fathers table with all necessary fields
CREATE TABLE IF NOT EXISTS fathers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    period VARCHAR(255),
    category VARCHAR(50) NOT NULL CHECK (category IN ('parish_priest', 'assistant_priest', 'son_of_soil', 'deacon')),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_fathers_category ON fathers(category);
CREATE INDEX IF NOT EXISTS idx_fathers_active ON fathers(is_active);
CREATE INDEX IF NOT EXISTS idx_fathers_display_order ON fathers(display_order);
CREATE INDEX IF NOT EXISTS idx_fathers_created_at ON fathers(created_at);
CREATE INDEX IF NOT EXISTS idx_fathers_category_active_order ON fathers(category, is_active, display_order);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_fathers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_fathers_updated_at ON fathers;
CREATE TRIGGER update_fathers_updated_at
    BEFORE UPDATE ON fathers
    FOR EACH ROW
    EXECUTE FUNCTION update_fathers_updated_at();

-- Insert initial data for Parish Priests
INSERT INTO fathers (name, period, category, display_order) VALUES
('Rev.Fr.V.Mary George', '19.05.1961 – 06.12.1971', 'parish_priest', 1),
('Rev.Fr.A.P.Stephen', '06.12.1971 – 08.10.1975', 'parish_priest', 2),
('Rev.Fr.S.Servacius', '08.10.1975 – 03.01.1976', 'parish_priest', 3),
('Rev.Fr.A.Joseph Raj', '03.01.1976 – 25.05.1978', 'parish_priest', 4),
('Rev.Fr.S.Joseph', '25.05.1978 – 30.05.1982', 'parish_priest', 5),
('Rev.Fr.V.Maria James', '30.05.1982 – 13.05.1987', 'parish_priest', 6),
('Rev.Fr.R.Lawrence', '13.05.1987 – 20.05.1989', 'parish_priest', 7),
('Rev.Fr.S.M.Charles Borromeo', '20.05.1989 – 08.06.1992', 'parish_priest', 8),
('Rev.Fr.George Ponniah', '08.06.1992 – 12.06.1998', 'parish_priest', 9),
('Rev.Fr.J.R.Partic Xavier', '12.06.1998 – 25.06.2001', 'parish_priest', 10),
('Rev.Fr.M.David Michael', '25.06.2001 – 18.08.2001', 'parish_priest', 11),
('Rev.Fr.R.Lawrence', '18.08.2001 – 16.05.2002', 'parish_priest', 12),
('Rev.Fr.Antonyhas Stalin', '16.05.2002 – 12.03.2004', 'parish_priest', 13),
('Rev.Fr.Yesudasan Thomas', '12.03.2004 – 21.05.2004', 'parish_priest', 14),
('Rev.Fr.George Ponniah', '21.05.2004 – 26.06.2005', 'parish_priest', 15),
('Rev.Fr.M.Devasahayam', '26.06.2005 – 23.05.2010', 'parish_priest', 16),
('Rev.Fr.Perpetual Antony', '23.05.2010 – 24.06.2015', 'parish_priest', 17),
('Rev.Fr.A.Stephen', '24.06.2015 – 19.08.2020', 'parish_priest', 18),
('Rev.Fr.A.Michael George Bright', '19.08.2020 – 24.05.2025', 'parish_priest', 19),
('Rev.Fr.S.Leon Henson', '25.05.2025 – Now', 'parish_priest', 20);

-- Insert initial data for Assistant Priests
INSERT INTO fathers (name, period, category, display_order) VALUES
('Rev.Fr.Francis De Sales', '07.12.1989 – 09.03.1990', 'assistant_priest', 1),
('Rev.Fr.A.Gabriel', '11.05.1999 – 25.05.2001', 'assistant_priest', 2),
('Rev.Fr.Yesudasan Thomas', '17.08.2003 – 12.03.2004', 'assistant_priest', 3),
('Rev.Fr.Gnanaraj', 'June 2012 – May 2013', 'assistant_priest', 4),
('Rev.Fr.Antony Dhas', 'June 2013 – May 2014', 'assistant_priest', 5),
('Rev.Fr.Britto Raj', 'June 2014 – May 2015', 'assistant_priest', 6),
('Rev.Fr.Benhar', '04.10.2014 – 04.02.2015', 'assistant_priest', 7),
('Rev.Fr.Benjamin', '05.02.2015 – 10.06.2015', 'assistant_priest', 8),
('Rev.Fr.John Sibi', '10.06.2015 – 05.12.2015', 'assistant_priest', 9),
('Rev.Fr.Ravi Godson Kennady', '05.12.2015 – 10.10.2017', 'assistant_priest', 10),
('Rev.Fr.A.Michael George Bright', '12.10.2017 – 30.03.2018', 'assistant_priest', 11),
('Rev.Fr.Gnana Sekaran', '03.05.2018 – 18.05.2019', 'assistant_priest', 12),
('Rev.Fr.Maria Joseph Sibu', '09.05.2019 – 19.08.2020', 'assistant_priest', 13);

-- Insert initial data for Sons of Soil
INSERT INTO fathers (name, period, category, display_order) VALUES
('Rev.Fr.Kunju Micheal', NULL, 'son_of_soil', 1),
('Rev.Fr.Jesudhasan', NULL, 'son_of_soil', 2),
('Rev.Fr.Arul Nirmal', NULL, 'son_of_soil', 3),
('Rev.Fr.Sahaya Felix', NULL, 'son_of_soil', 4),
('Rev.Fr.S.Anbin Devasahayam', NULL, 'son_of_soil', 5);

-- Insert initial data for Deacons
INSERT INTO fathers (name, period, category, display_order) VALUES
('Dn.Saju', '10.09.2017 – 01.04.2018', 'deacon', 1),
('Dn.Sahaya Sunil', '09.09.2018 – 01.04.2019', 'deacon', 2),
('Dn.Jesu Pravin', '01.09.2024 – 01.04.2025', 'deacon', 3);