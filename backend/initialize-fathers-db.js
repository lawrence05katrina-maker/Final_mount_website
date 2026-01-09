const FathersModel = require('./src/models/fathersModel');

async function initializeFathersDatabase() {
  try {
    console.log('Initializing fathers database...');
    
    // Create table
    await FathersModel.createTable();
    console.log('✓ Fathers table created successfully');
    
    // Initialize default data
    await FathersModel.initializeDefaultData();
    console.log('✓ Default fathers data initialized successfully');
    
    console.log('Fathers database initialization completed!');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing fathers database:', error);
    process.exit(1);
  }
}

initializeFathersDatabase();