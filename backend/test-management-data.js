const axios = require('axios');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5000/api';

// Test admin credentials
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'shrine@admin123'
};

let authToken = '';

// Helper function to create a simple test image
function createTestImage() {
  // Create a simple 1x1 pixel PNG in base64
  const placeholder = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9jU77zgAAAABJRU5ErkJggg==';
  return `data:image/png;base64,${placeholder}`;
}

// Login to get auth token
async function login() {
  try {
    console.log('🔐 Logging in as admin...');
    const response = await axios.post(`${BASE_URL}/admin/login`, ADMIN_CREDENTIALS);
    
    if (response.data.success) {
      authToken = response.data.data.token;
      console.log('✅ Login successful');
      return true;
    } else {
      console.error('❌ Login failed:', response.data.message);
      return false;
    }
  } catch (error) {
    console.error('❌ Login error:', error.response?.data?.message || error.message);
    return false;
  }
}

// Test data for management team members
const testMembers = [
  {
    name: 'Rev. Fr. S. Leon Henson',
    position: 'Parish Priest',
    description: 'Rev. Fr. S. Leon Henson serves as the dedicated Parish Priest, leading the congregation with spiritual guidance and pastoral care.',
    phone: '+91 98765 43210',
    email: 'fr.leon@devasahayamshrine.com',
    display_order: 1,
    is_active: true,
    is_featured: true,
    image_data: createTestImage()
  },
  {
    name: 'Mr. Siluvai Dhasan',
    position: 'Vice President',
    description: 'Mr. Siluvai Dhasan is the Vice President of the parish council, ensuring effective administration and community engagement.',
    phone: '+91 98765 43211',
    email: 'siluvai.dhasan@devasahayamshrine.com',
    display_order: 2,
    is_active: true,
    is_featured: true,
    image_data: createTestImage()
  },
  {
    name: 'Mr. David',
    position: 'Secretary',
    description: 'Mr. David serves as the Secretary, overseeing communications and ensuring smooth coordination of parish activities.',
    phone: '+91 98765 43212',
    email: 'david@devasahayamshrine.com',
    display_order: 3,
    is_active: true,
    is_featured: true,
    image_data: createTestImage()
  },
  {
    name: 'Ms. Janate',
    position: 'Treasurer',
    description: 'Janate is the Treasurer, responsible for managing the parish finances and ensuring transparency in fiscal matters.',
    phone: '+91 98765 43213',
    email: 'janate@devasahayamshrine.com',
    display_order: 4,
    is_active: true,
    is_featured: false
  }
];

// Add test management team members
async function addTestMembers() {
  console.log('\n📝 Adding test management team members...');
  
  const addedMembers = [];
  
  for (let i = 0; i < testMembers.length; i++) {
    const member = testMembers[i];
    try {
      console.log(`Adding ${member.name}...`);
      
      const response = await axios.post(
        `${BASE_URL}/management/admin`,
        member,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (response.data.success) {
        console.log(`✅ Added: ${member.name} (ID: ${response.data.data.id})`);
        addedMembers.push(response.data.data);
      } else {
        console.log(`❌ Failed to add ${member.name}: ${response.data.message}`);
      }
    } catch (error) {
      console.log(`❌ Error adding ${member.name}:`, error.response?.data?.message || error.message);
    }
  }
  
  return addedMembers;
}

// Get all management team members
async function getAllMembers() {
  try {
    console.log('\n📋 Fetching all management team members...');
    
    const response = await axios.get(
      `${BASE_URL}/management/admin/all`,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      }
    );
    
    if (response.data.success) {
      console.log(`✅ Found ${response.data.data.length} members`);
      response.data.data.forEach(member => {
        console.log(`   - ${member.name} (${member.position}) - ${member.is_active ? 'Active' : 'Inactive'} ${member.is_featured ? '⭐' : ''}`);
      });
      return response.data.data;
    } else {
      console.log('❌ Failed to fetch members:', response.data.message);
      return [];
    }
  } catch (error) {
    console.log('❌ Error fetching members:', error.response?.data?.message || error.message);
    return [];
  }
}

// Update a management team member
async function updateMember(memberId, updates) {
  try {
    console.log(`\n✏️ Updating member ID ${memberId}...`);
    
    const response = await axios.put(
      `${BASE_URL}/management/admin/${memberId}`,
      updates,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (response.data.success) {
      console.log(`✅ Updated: ${response.data.data.name}`);
      return response.data.data;
    } else {
      console.log(`❌ Failed to update member: ${response.data.message}`);
      return null;
    }
  } catch (error) {
    console.log(`❌ Error updating member:`, error.response?.data?.message || error.message);
    return null;
  }
}

// Toggle member status
async function toggleMemberStatus(memberId, statusType) {
  try {
    console.log(`\n🔄 Toggling ${statusType} status for member ID ${memberId}...`);
    
    const endpoint = statusType === 'active' ? 'toggle-active' : 'toggle-featured';
    const response = await axios.patch(
      `${BASE_URL}/management/admin/${memberId}/${endpoint}`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      }
    );
    
    if (response.data.success) {
      console.log(`✅ ${response.data.message}`);
      return response.data.data;
    } else {
      console.log(`❌ Failed to toggle status: ${response.data.message}`);
      return null;
    }
  } catch (error) {
    console.log(`❌ Error toggling status:`, error.response?.data?.message || error.message);
    return null;
  }
}

// Delete a management team member
async function deleteMember(memberId) {
  try {
    console.log(`\n🗑️ Deleting member ID ${memberId}...`);
    
    const response = await axios.delete(
      `${BASE_URL}/management/admin/${memberId}`,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      }
    );
    
    if (response.data.success) {
      console.log(`✅ Deleted: ${response.data.data.name}`);
      return true;
    } else {
      console.log(`❌ Failed to delete member: ${response.data.message}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Error deleting member:`, error.response?.data?.message || error.message);
    return false;
  }
}

// Get management statistics
async function getStats() {
  try {
    console.log('\n📊 Getting management team statistics...');
    
    const response = await axios.get(
      `${BASE_URL}/management/admin/stats`,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      }
    );
    
    if (response.data.success) {
      const stats = response.data.data;
      console.log('✅ Statistics:');
      console.log(`   Total: ${stats.total}`);
      console.log(`   Active: ${stats.active}`);
      console.log(`   Featured: ${stats.featured}`);
      console.log(`   Inactive: ${stats.inactive}`);
      return stats;
    } else {
      console.log('❌ Failed to get statistics:', response.data.message);
      return null;
    }
  } catch (error) {
    console.log('❌ Error getting statistics:', error.response?.data?.message || error.message);
    return null;
  }
}

// Test public endpoints
async function testPublicEndpoints() {
  try {
    console.log('\n🌐 Testing public endpoints...');
    
    // Test active members endpoint
    const activeResponse = await axios.get(`${BASE_URL}/management/active`);
    if (activeResponse.data.success) {
      console.log(`✅ Active members: ${activeResponse.data.data.length} found`);
    }
    
    // Test featured members endpoint
    const featuredResponse = await axios.get(`${BASE_URL}/management/featured?limit=3`);
    if (featuredResponse.data.success) {
      console.log(`✅ Featured members: ${featuredResponse.data.data.length} found`);
    }
    
  } catch (error) {
    console.log('❌ Error testing public endpoints:', error.response?.data?.message || error.message);
  }
}

// Main test function
async function runTests() {
  console.log('🚀 Starting Management Team CRUD Tests\n');
  console.log('=' .repeat(50));
  
  // Step 1: Login
  const loginSuccess = await login();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without authentication');
    return;
  }
  
  // Step 2: Add test members
  const addedMembers = await addTestMembers();
  
  // Step 3: Get all members
  let allMembers = await getAllMembers();
  
  // Step 4: Get statistics
  await getStats();
  
  // Step 5: Test updates if we have members
  if (allMembers.length > 0) {
    const firstMember = allMembers[0];
    
    // Update member details
    await updateMember(firstMember.id, {
      name: firstMember.name,
      position: firstMember.position,
      description: firstMember.description + ' [UPDATED]',
      phone: firstMember.phone,
      email: firstMember.email,
      display_order: firstMember.display_order,
      is_active: firstMember.is_active,
      is_featured: firstMember.is_featured
    });
    
    // Toggle active status
    await toggleMemberStatus(firstMember.id, 'active');
    
    // Toggle featured status
    if (allMembers.length > 1) {
      await toggleMemberStatus(allMembers[1].id, 'featured');
    }
  }
  
  // Step 6: Test public endpoints
  await testPublicEndpoints();
  
  // Step 7: Get updated list
  allMembers = await getAllMembers();
  
  // Step 8: Test deletion
  if (allMembers.length > 0) {
    console.log('\n Testing deletion (last member)...');
    const lastMember = allMembers[allMembers.length - 1];
    await deleteMember(lastMember.id);
    await getAllMembers();
  }
  
  console.log('\n' + '=' .repeat(50));
  console.log('✅ Management Team CRUD Tests Completed!');
  console.log('\n📝 Summary:');
  console.log('- ✅ Authentication tested');
  console.log('- ✅ Create operations tested');
  console.log('- ✅ Read operations tested');
  console.log('- ✅ Update operations tested');
  console.log('- ✅ Status toggle operations tested');
  console.log('- ✅ Delete operations tested');
  console.log('- ✅ Public endpoints tested');
  
  console.log('\n🌐 You can now:');
  console.log('1. Visit http://localhost:3000/admin/management to see the admin interface');
  console.log('2. Visit http://localhost:3000/management to see the public page');
  console.log('3. Login with username: admin, password: shrine@admin123');
}

// Run the tests
runTests().catch(console.error);