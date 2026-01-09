const FathersModel = require('./src/models/fathersModel');

async function testFathersAPI() {
  try {
    console.log('Testing Fathers API...\n');
    
    // Test 1: Get all active fathers by category
    console.log('1. Testing getAllActiveByCategory...');
    const activeByCategory = await FathersModel.getAllActiveByCategory();
    console.log('Parish Priests:', activeByCategory.parish_priest.length);
    console.log('Assistant Priests:', activeByCategory.assistant_priest.length);
    console.log('Sons of Soil:', activeByCategory.son_of_soil.length);
    console.log('Deacons:', activeByCategory.deacon.length);
    console.log('✓ getAllActiveByCategory works\n');
    
    // Test 2: Get all fathers (admin)
    console.log('2. Testing getAll...');
    const allFathers = await FathersModel.getAll();
    console.log('Total fathers:', allFathers.length);
    console.log('✓ getAll works\n');
    
    // Test 3: Get statistics
    console.log('3. Testing getStats...');
    const stats = await FathersModel.getStats();
    console.log('Statistics:', stats);
    console.log('✓ getStats works\n');
    
    // Test 4: Create a new father
    console.log('4. Testing create...');
    const newFather = await FathersModel.create({
      name: 'Test Father',
      period: '2024 - Now',
      category: 'parish_priest',
      display_order: 999,
      is_active: true
    });
    console.log('Created father:', newFather.name);
    console.log('✓ create works\n');
    
    // Test 5: Update the father
    console.log('5. Testing update...');
    const updatedFather = await FathersModel.update(newFather.id, {
      name: 'Updated Test Father',
      period: '2024 - 2025',
      category: 'parish_priest',
      display_order: 998,
      is_active: false
    });
    console.log('Updated father:', updatedFather.name);
    console.log('✓ update works\n');
    
    // Test 6: Toggle active status
    console.log('6. Testing toggleActive...');
    const toggledFather = await FathersModel.toggleActive(newFather.id);
    console.log('Toggled father active status:', toggledFather.is_active);
    console.log('✓ toggleActive works\n');
    
    // Test 7: Delete the test father
    console.log('7. Testing delete...');
    const deletedFather = await FathersModel.delete(newFather.id);
    console.log('Deleted father:', deletedFather.name);
    console.log('✓ delete works\n');
    
    console.log('All tests passed! ✅');
    process.exit(0);
  } catch (error) {
    console.error('Test failed:', error);
    process.exit(1);
  }
}

testFathersAPI();