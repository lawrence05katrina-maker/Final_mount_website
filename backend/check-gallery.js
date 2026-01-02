require('dotenv').config();
const db = require('./src/db/db');

async function checkGallery() {
  try {
    console.log('Checking gallery items...');
    
    const result = await db.query('SELECT id, title, image_url, category, is_active, is_featured, created_at FROM gallery ORDER BY created_at DESC LIMIT 10');
    
    console.log(`Found ${result.rows.length} gallery items:`);
    
    if (result.rows.length === 0) {
      console.log('No gallery items found.');
    } else {
      result.rows.forEach((item, index) => {
        console.log(`${index + 1}. ${item.title}`);
        console.log(`   URL: ${item.image_url}`);
        console.log(`   Category: ${item.category}`);
        console.log(`   Active: ${item.is_active}, Featured: ${item.is_featured}`);
        console.log(`   Created: ${item.created_at}`);
        console.log('');
      });
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error checking gallery:', error);
    process.exit(1);
  }
}

checkGallery();