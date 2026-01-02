const pool = require('./src/db/db');

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    const client = await pool.connect();
    console.log('✅ Database connected successfully');
    
    // Test if gallery table exists
    const galleryCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'gallery'
      );
    `);
    
    console.log('Gallery table exists:', galleryCheck.rows[0].exists);
    
    // Test if contact_info table exists
    const contactCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'contact_info'
      );
    `);
    
    console.log('Contact_info table exists:', contactCheck.rows[0].exists);
    
    // Test if livestreams table exists
    const livestreamCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'livestreams'
      );
    `);
    
    console.log('Livestreams table exists:', livestreamCheck.rows[0].exists);
    
    client.release();
    
    // If tables don't exist, create them
    if (!galleryCheck.rows[0].exists) {
      console.log('❌ Gallery table missing - please run GALLERY_DATABASE_SETUP.sql');
    }
    
    if (!contactCheck.rows[0].exists) {
      console.log('❌ Contact_info table missing - please run CONTACT_DATABASE_SETUP.sql');
    }
    
    if (!livestreamCheck.rows[0].exists) {
      console.log('❌ Livestreams table missing - please run GALLERY_DATABASE_SETUP.sql');
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    console.error('Please check your database configuration in .env file');
  } finally {
    await pool.end();
  }
}

testConnection();