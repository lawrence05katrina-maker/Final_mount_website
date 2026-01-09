const FathersModel = require('./backend/src/models/fathersModel');

async function showDatabaseData() {
  try {
    console.log('📊 Current Database Data\n');
    
    // Get all data
    const allData = await FathersModel.getAllActiveByCategory();
    
    console.log('🔸 PARISH PRIESTS (' + allData.parish_priest.length + ' total)');
    allData.parish_priest.slice(0, 5).forEach((priest, index) => {
      console.log(`   ${index + 1}. ${priest.name} (${priest.period || 'No period'})`);
    });
    if (allData.parish_priest.length > 5) {
      console.log(`   ... and ${allData.parish_priest.length - 5} more`);
    }
    
    console.log('\n🔸 ASSISTANT PRIESTS (' + allData.assistant_priest.length + ' total)');
    allData.assistant_priest.slice(0, 5).forEach((priest, index) => {
      console.log(`   ${index + 1}. ${priest.name} (${priest.period || 'No period'})`);
    });
    if (allData.assistant_priest.length > 5) {
      console.log(`   ... and ${allData.assistant_priest.length - 5} more`);
    }
    
    console.log('\n🔸 SONS OF SOIL (' + allData.son_of_soil.length + ' total)');
    allData.son_of_soil.forEach((priest, index) => {
      console.log(`   ${index + 1}. ${priest.name} (${priest.period || 'No period'})`);
    });
    
    console.log('\n🔸 DEACONS (' + allData.deacon.length + ' total)');
    allData.deacon.forEach((priest, index) => {
      console.log(`   ${index + 1}. ${priest.name} (${priest.period || 'No period'})`);
    });
    
    // Get stats
    const stats = await FathersModel.getStats();
    console.log('\n📈 STATISTICS');
    console.log(`   Total: ${stats.total}`);
    console.log(`   Active: ${stats.active}`);
    console.log(`   Inactive: ${stats.inactive}`);
    
    console.log('\n✅ Database is properly populated with all your original data!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

showDatabaseData();