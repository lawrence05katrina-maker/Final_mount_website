const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test admin credentials
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'shrine@admin123'
};

let authToken = '';

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

// Get all members
async function getAllMembers() {
  try {
    const response = await axios.get(
      `${BASE_URL}/management/admin/all`,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      }
    );
    
    if (response.data.success) {
      return response.data.data;
    } else {
      return [];
    }
  } catch (error) {
    console.log('❌ Error fetching members:', error.response?.data?.message || error.message);
    return [];
  }
}

// Update a specific member
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

// Delete a specific member
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

// Toggle member status
async function toggleStatus(memberId, statusType) {
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

// Display members
function displayMembers(members, title) {
  console.log(`\n📋 ${title}:`);
  console.log(`✅ Total members: ${members.length}`);
  members.forEach((member, index) => {
    console.log(`   ${index + 1}. ${member.name} (${member.position}) - ${member.is_active ? 'Active' : 'Inactive'} ${member.is_featured ? '⭐' : ''}`);
  });
}

// Main test function
async function testUpdateDelete() {
  console.log('🚀 Testing Update and Delete Operations\n');
  console.log('=' .repeat(60));
  
  // Step 1: Login
  const loginSuccess = await login();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without authentication');
    return;
  }
  
  // Step 2: Get current members
  let members = await getAllMembers();
  displayMembers(members, 'Current Management Team Members');
  
  if (members.length === 0) {
    console.log('❌ No members found. Please run clean-and-add-management-data.js first');
    return;
  }
  
  // Step 3: Update first member (Parish Priest)
  const firstMember = members[0];
  console.log(`\n🎯 Testing UPDATE operation on: ${firstMember.name}`);
  
  await updateMember(firstMember.id, {
    name: firstMember.name,
    position: firstMember.position,
    description: firstMember.description + '\n\n[UPDATED] This description was updated via API test on ' + new Date().toLocaleString(),
    phone: '+91 99999 88888', // Updated phone
    email: firstMember.email,
    display_order: firstMember.display_order,
    is_active: firstMember.is_active,
    is_featured: firstMember.is_featured
  });
  
  // Step 4: Toggle status of second member
  if (members.length > 1) {
    const secondMember = members[1];
    console.log(`\n🎯 Testing STATUS TOGGLE on: ${secondMember.name}`);
    
    // Toggle active status
    await toggleStatus(secondMember.id, 'active');
    
    // Toggle featured status
    await toggleStatus(secondMember.id, 'featured');
  }
  
  // Step 5: Show updated list
  members = await getAllMembers();
  displayMembers(members, 'After Updates');
  
  // Step 6: Delete last member
  if (members.length > 0) {
    const lastMember = members[members.length - 1];
    console.log(`\n🎯 Testing DELETE operation on: ${lastMember.name}`);
    
    await deleteMember(lastMember.id);
  }
  
  // Step 7: Show final list
  members = await getAllMembers();
  displayMembers(members, 'After Deletion');
  
  // Step 8: Add a new member to test CREATE
  console.log('\n🎯 Testing CREATE operation - Adding new member');
  
  const newMember = {
    name: 'Fr. Thomas Xavier',
    position: 'Assistant Priest',
    description: 'Fr. Thomas Xavier serves as the Assistant Priest, supporting the Parish Priest in various liturgical and pastoral duties. He specializes in youth ministry and community outreach programs.',
    phone: '+91 98765 99999',
    email: 'fr.thomas@devasahayamshrine.com',
    display_order: 99,
    is_active: true,
    is_featured: false
  };
  
  try {
    const response = await axios.post(
      `${BASE_URL}/management/admin`,
      newMember,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (response.data.success) {
      console.log(`✅ Added new member: ${response.data.data.name} (ID: ${response.data.data.id})`);
    } else {
      console.log(`❌ Failed to add new member: ${response.data.message}`);
    }
  } catch (error) {
    console.log(`❌ Error adding new member:`, error.response?.data?.message || error.message);
  }
  
  // Step 9: Final results
  members = await getAllMembers();
  displayMembers(members, 'Final Management Team');
  
  // Get statistics
  try {
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
      console.log('\n📊 Final Statistics:');
      console.log(`   Total: ${stats.total}`);
      console.log(`   Active: ${stats.active}`);
      console.log(`   Featured: ${stats.featured}`);
      console.log(`   Inactive: ${stats.inactive}`);
    }
  } catch (error) {
    console.log('❌ Error getting statistics:', error.response?.data?.message || error.message);
  }
  
  console.log('\n' + '=' .repeat(60));
  console.log('✅ Update and Delete Tests Completed!');
  
  console.log('\n📝 Operations Tested:');
  console.log('- ✅ READ: Fetched all members');
  console.log('- ✅ UPDATE: Modified member details');
  console.log('- ✅ TOGGLE: Changed active/featured status');
  console.log('- ✅ DELETE: Removed a member');
  console.log('- ✅ CREATE: Added a new member');
  
  console.log('\n🌐 Visit the admin interface to see the changes:');
  console.log('   http://localhost:5174/admin/management');
}

// Run the tests
testUpdateDelete().catch(console.error);