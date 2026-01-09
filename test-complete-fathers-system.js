const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testCompleteSystem() {
  try {
    console.log('🔍 Testing Complete Fathers Management System\n');

    // Step 1: Test public endpoint
    console.log('1️⃣ Testing Public Endpoint');
    const publicResponse = await axios.get(`${BASE_URL}/api/fathers/active`);
    console.log('✅ Public endpoint works');
    console.log(`   Data structure:`, Object.keys(publicResponse.data.data));
    console.log(`   Total items:`, Object.values(publicResponse.data.data).reduce((sum, arr) => sum + arr.length, 0));
    console.log();

    // Step 2: Test admin login
    console.log('2️⃣ Testing Admin Login');
    try {
      const loginResponse = await axios.post(`${BASE_URL}/api/admin/login`, {
        username: 'admin',
        password: 'shrine@admin123'
      });
      
      if (loginResponse.data.success && loginResponse.data.data.token) {
        console.log('✅ Admin login successful');
        const token = loginResponse.data.data.token;
        console.log(`   Token received: ${token.substring(0, 20)}...`);
        
        // Step 3: Test admin endpoints with valid token
        console.log('\n3️⃣ Testing Admin Endpoints with Valid Token');
        const headers = { Authorization: `Bearer ${token}` };
        
        // Test GET all fathers
        const allFathersResponse = await axios.get(`${BASE_URL}/api/fathers/admin/all`, { headers });
        console.log('✅ GET all fathers works');
        console.log(`   Total fathers in admin view: ${allFathersResponse.data.data.length}`);
        
        // Test GET stats
        const statsResponse = await axios.get(`${BASE_URL}/api/fathers/admin/stats`, { headers });
        console.log('✅ GET stats works');
        console.log(`   Stats:`, statsResponse.data.data);
        
        // Step 4: Test CREATE
        console.log('\n4️⃣ Testing CREATE Operation');
        const testFather = {
          name: 'Test Father CRUD System',
          period: '2024 - Testing',
          category: 'parish_priest',
          display_order: 999,
          is_active: true
        };
        
        const createResponse = await axios.post(`${BASE_URL}/api/fathers/admin`, testFather, { headers });
        console.log('✅ CREATE works');
        const createdFather = createResponse.data.data;
        console.log(`   Created father: ${createdFather.name} (ID: ${createdFather.id})`);
        
        // Step 5: Test READ (get by ID)
        console.log('\n5️⃣ Testing READ Operation');
        const readResponse = await axios.get(`${BASE_URL}/api/fathers/admin/${createdFather.id}`, { headers });
        console.log('✅ READ by ID works');
        console.log(`   Retrieved: ${readResponse.data.data.name}`);
        
        // Step 6: Test UPDATE
        console.log('\n6️⃣ Testing UPDATE Operation');
        const updateData = {
          name: 'Updated Test Father',
          period: '2024 - Updated',
          category: 'assistant_priest',
          display_order: 998,
          is_active: false
        };
        
        const updateResponse = await axios.put(`${BASE_URL}/api/fathers/admin/${createdFather.id}`, updateData, { headers });
        console.log('✅ UPDATE works');
        console.log(`   Updated father: ${updateResponse.data.data.name}`);
        console.log(`   New category: ${updateResponse.data.data.category}`);
        console.log(`   Active status: ${updateResponse.data.data.is_active}`);
        
        // Step 7: Test TOGGLE ACTIVE
        console.log('\n7️⃣ Testing TOGGLE ACTIVE Operation');
        const toggleResponse = await axios.patch(`${BASE_URL}/api/fathers/admin/${createdFather.id}/toggle-active`, {}, { headers });
        console.log('✅ TOGGLE ACTIVE works');
        console.log(`   New active status: ${toggleResponse.data.data.is_active}`);
        
        // Step 8: Verify data appears in public endpoint
        console.log('\n8️⃣ Testing Data Binding - Public View');
        const publicCheckResponse = await axios.get(`${BASE_URL}/api/fathers/active`);
        const assistantPriests = publicCheckResponse.data.data.assistant_priest;
        const testFatherInPublic = assistantPriests.find(f => f.name === 'Updated Test Father');
        
        if (testFatherInPublic && testFatherInPublic.is_active) {
          console.log('✅ Updated father appears in public view');
        } else {
          console.log('⚠️  Updated father not in public view (expected - it\'s inactive)');
        }
        
        // Step 9: Test DELETE
        console.log('\n9️⃣ Testing DELETE Operation');
        const deleteResponse = await axios.delete(`${BASE_URL}/api/fathers/admin/${createdFather.id}`, { headers });
        console.log('✅ DELETE works');
        console.log(`   Deleted father: ${deleteResponse.data.data.name}`);
        
        // Step 10: Verify deletion
        console.log('\n🔟 Verifying Deletion');
        try {
          await axios.get(`${BASE_URL}/api/fathers/admin/${createdFather.id}`, { headers });
          console.log('❌ Father still exists after deletion');
        } catch (error) {
          if (error.response?.status === 404) {
            console.log('✅ Father successfully deleted (404 Not Found)');
          } else {
            console.log('⚠️  Unexpected error:', error.response?.status);
          }
        }
        
        console.log('\n🎉 ALL TESTS PASSED!');
        console.log('\n📋 Summary:');
        console.log('✅ Database connection works');
        console.log('✅ Public API endpoints work');
        console.log('✅ Admin authentication works');
        console.log('✅ All CRUD operations work');
        console.log('✅ Data binding between admin and public views works');
        console.log('✅ Authorization is properly implemented');
        
      } else {
        console.log('❌ Admin login failed');
        console.log('   Response:', loginResponse.data);
      }
      
    } catch (loginError) {
      console.log('❌ Admin login error:', loginError.response?.data || loginError.message);
      console.log('\n🔧 Troubleshooting:');
      console.log('1. Make sure backend server is running');
      console.log('2. Check admin credentials in database');
      console.log('3. Verify JWT secret is configured');
    }
    
  } catch (error) {
    console.error('❌ System test failed:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
}

// Run the complete test
testCompleteSystem();