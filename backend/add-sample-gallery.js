const GalleryModel = require('./src/models/galleryModel');

async function addSampleGalleryItems() {
  try {
    console.log('Adding sample gallery items...');
    
    // Sample gallery items with working image URLs
    const sampleItems = [
      {
        title: 'Devasahayam Mount Shrine - Main View',
        description: 'Beautiful view of the main shrine building',
        image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop',
        image_name: 'shrine_main_view.jpg',
        image_type: 'image/jpeg',
        file_type: 'image',
        category: 'architecture',
        is_featured: true,
        display_order: 1,
        uploaded_by: 'admin'
      },
      {
        title: 'Sunday Mass Celebration',
        description: 'Devotees gathering for Sunday mass',
        image_url: 'https://images.unsplash.com/photo-1438032005730-c779502df39b?w=800&h=600&fit=crop',
        image_name: 'sunday_mass.jpg',
        image_type: 'image/jpeg',
        file_type: 'image',
        category: 'ceremonies',
        is_featured: true,
        display_order: 2,
        uploaded_by: 'admin'
      },
      {
        title: 'Feast Day Celebration',
        description: 'Annual feast day celebration with devotees',
        image_url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&h=600&fit=crop',
        image_name: 'feast_day.jpg',
        image_type: 'image/jpeg',
        file_type: 'image',
        category: 'festivals',
        is_featured: true,
        display_order: 3,
        uploaded_by: 'admin'
      },
      {
        title: 'Prayer Service',
        description: 'Evening prayer service at the shrine',
        image_url: 'https://images.unsplash.com/photo-1507692049790-de58290a4334?w=800&h=600&fit=crop',
        image_name: 'prayer_service.jpg',
        image_type: 'image/jpeg',
        file_type: 'image',
        category: 'ceremonies',
        is_featured: false,
        display_order: 4,
        uploaded_by: 'admin'
      },
      {
        title: 'Devotees Gathering',
        description: 'Devotees coming together for worship',
        image_url: 'https://images.unsplash.com/photo-1544928147-79a2dbc1f389?w=800&h=600&fit=crop',
        image_name: 'devotees_gathering.jpg',
        image_type: 'image/jpeg',
        file_type: 'image',
        category: 'devotees',
        is_featured: false,
        display_order: 5,
        uploaded_by: 'admin'
      },
      {
        title: 'Shrine Interior',
        description: 'Beautiful interior of the shrine',
        image_url: 'https://images.unsplash.com/photo-1520637836862-4d197d17c93a?w=800&h=600&fit=crop',
        image_name: 'shrine_interior.jpg',
        image_type: 'image/jpeg',
        file_type: 'image',
        category: 'architecture',
        is_featured: false,
        display_order: 6,
        uploaded_by: 'admin'
      }
    ];

    // Create gallery table first
    await GalleryModel.createTable();
    console.log('Gallery table ready');

    // Add sample items
    for (const item of sampleItems) {
      try {
        const result = await GalleryModel.create(item);
        console.log(`✓ Added: ${item.title}`);
      } catch (error) {
        console.log(`✗ Failed to add ${item.title}:`, error.message);
      }
    }

    console.log('Sample gallery items added successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error adding sample gallery items:', error);
    process.exit(1);
  }
}

addSampleGalleryItems();