const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test public endpoints (no authentication required)
async function testPublicEndpoints() {
  console.log('🌐 Testing Public Management Team Endpoints\n');
  console.log('=' .repeat(50));
  
  try {
    // Test 1: Get all active members
    console.log('📋 Testing GET /management/active');
    const activeResponse = await axios.get(`${BASE_URL}/management/active`);
    
    if (activeResponse.data.success) {
      console.log(`✅ Active members: ${activeResponse.data.data.length} found`);
      activeResponse.data.data.forEach((member, index) => {
        console.log(`   ${index + 1}. ${member.name} (${member.position}) ${member.is_featured ? '⭐' : ''}`);
      });
    } else {
      console.log('❌ Failed to get active members:', activeResponse.data.message);
    }
    
  } catch (error) {
    console.log('❌ Error getting active members:', error.response?.data?.message || error.message);
  }
  
  try {
    // Test 2: Get featured members (limit 3)
    console.log('\n⭐ Testing GET /management/featured?limit=3');
    const featuredResponse = await axios.get(`${BASE_URL}/management/featured?limit=3`);
    
    if (featuredResponse.data.success) {
      console.log(`✅ Featured members: ${featuredResponse.data.data.length} found`);
      featuredResponse.data.data.forEach((member, index) => {
        console.log(`   ${index + 1}. ${member.name} (${member.position}) ⭐`);
      });
    } else {
      console.log('❌ Failed to get featured members:', featuredResponse.data.message);
    }
    
  } catch (error) {
    console.log('❌ Error getting featured members:', error.response?.data?.message || error.message);
  }
  
  try {
    // Test 3: Get all featured members (no limit)
    console.log('\n⭐ Testing GET /management/featured (no limit)');
    const allFeaturedResponse = await axios.get(`${BASE_URL}/management/featured`);
    
    if (allFeaturedResponse.data.success) {
      console.log(`✅ All featured members: ${allFeaturedResponse.data.data.length} found`);
      allFeaturedResponse.data.data.forEach((member, index) => {
        console.log(`   ${index + 1}. ${member.name} (${member.position}) ⭐`);
      });
    } else {
      console.log('❌ Failed to get all featured members:', allFeaturedResponse.data.message);
    }
    
  } catch (error) {
    console.log('❌ Error getting all featured members:', error.response?.data?.message || error.message);
  }
  
  console.log('\n' + '=' .repeat(50));
  console.log('✅ Public Endpoints Test Completed!');
  
  console.log('\n📝 Endpoints Tested:');
  console.log('- ✅ GET /api/management/active - All active members');
  console.log('- ✅ GET /api/management/featured?limit=3 - Limited featured members');
  console.log('- ✅ GET /api/management/featured - All featured members');
  
  console.log('\n🌐 These endpoints are used by:');
  console.log('1. Public Management Page: http://localhost:5174/management');
  console.log('2. Homepage (if you display featured members)');
  console.log('3. Any other public pages that need management team data');
  
  console.log('\n💡 Note: Public endpoints only return active members');
  console.log('   Inactive members are hidden from public view');
}

// Run the test
testPublicEndpoints().catch(console.error);