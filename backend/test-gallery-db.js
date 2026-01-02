const db = require('./src/db/db');
const GalleryModel = require('./src/models/galleryModel');

async function testGalleryDatabase() {
  try {
    console.log('Testing gallery database...');
    
    // Test database connection
    console.log('1. Testing database connection...');
    const result = await db.query('SELECT NOW()');
    console.log('✓ Database connected:', result.rows[0].now);
    
    // Check if gallery table exists
    console.log('2. Checking if gallery table exists...');
    const tableCheck = await db.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'gallery'
      );
    `);
    
    if (tableCheck.rows[0].exists) {
      console.log('✓ Gallery table exists');
      
      // Check table structure
      console.log('3. Checking table structure...');
      const columns = await db.query(`
        SELECT column_name, data_type, is_nullable 
        FROM information_schema.columns 
        WHERE table_name = 'gallery'
        ORDER BY ordinal_position;
      `);
      
      console.log('Table columns:');
      columns.rows.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`);
      });
      
    } else {
      console.log('✗ Gallery table does not exist');
      console.log('4. Creating gallery table...');
      await GalleryModel.createTable();
      console.log('✓ Gallery table created');
    }
    
    // Test creating a simple gallery item
    console.log('5. Testing gallery item creation...');
    const testItem = {
      title: 'Test Image',
      description: 'Test description',
      image_url: 'https://via.placeholder.com/400x300',
      image_name: 'test.jpg',
      image_type: 'image/jpeg',
      file_type: 'image',
      category: 'general',
      is_featured: false,
      display_order: 0,
      uploaded_by: 'test'
    };
    
    const newItem = await GalleryModel.create(testItem);
    console.log('✓ Test gallery item created:', newItem.id);
    
    // Clean up test item
    await GalleryModel.delete(newItem.id);
    console.log('✓ Test item cleaned up');
    
    console.log('\n🎉 Gallery database test completed successfully!');
    
  } catch (error) {
    console.error('❌ Gallery database test failed:', error);
    console.error('Error details:', error.message);
    if (error.code) {
      console.error('Error code:', error.code);
    }
  } finally {
    process.exit(0);
  }
}

testGalleryDatabase();