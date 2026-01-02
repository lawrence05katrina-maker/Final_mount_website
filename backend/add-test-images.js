require('dotenv').config();
const GalleryModel = require('./src/models/galleryModel');

async function addTestImages() {
  try {
    console.log('Adding test images...');
    
    // Add a few test images with different sources
    const testImages = [
      {
        title: 'Test Image 1 - Unsplash',
        description: 'Test image from Unsplash',
        image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
        image_name: 'test_unsplash_1.jpg',
        image_type: 'image/jpeg',
        file_type: 'image',
        category: 'general',
        is_featured: false,
        display_order: 0,
        uploaded_by: 'test'
      },
      {
        title: 'Test Image 2 - Lorem Picsum',
        description: 'Test image from Lorem Picsum',
        image_url: 'https://picsum.photos/400/400?random=1',
        image_name: 'test_picsum_1.jpg',
        image_type: 'image/jpeg',
        file_type: 'image',
        category: 'general',
        is_featured: false,
        display_order: 0,
        uploaded_by: 'test'
      },
      {
        title: 'Test Image 3 - Different Picsum',
        description: 'Another test image from Lorem Picsum',
        image_url: 'https://picsum.photos/400/400?random=2',
        image_name: 'test_picsum_2.jpg',
        image_type: 'image/jpeg',
        file_type: 'image',
        category: 'general',
        is_featured: true,
        display_order: 0,
        uploaded_by: 'test'
      }
    ];
    
    for (const imageData of testImages) {
      const result = await GalleryModel.create(imageData);
      console.log(`✅ Created: ${result.title} (ID: ${result.id})`);
    }
    
    console.log('\n🎉 Test images added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error adding test images:', error);
    process.exit(1);
  }
}

addTestImages();