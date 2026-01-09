const axios = require('axios');

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

// Delete all existing members
async function deleteAllMembers() {
  console.log('\n🧹 Cleaning up existing members...');
  
  const members = await getAllMembers();
  
  for (const member of members) {
    try {
      const response = await axios.delete(
        `${BASE_URL}/management/admin/${member.id}`,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        }
      );
      
      if (response.data.success) {
        console.log(`✅ Deleted: ${member.name}`);
      }
    } catch (error) {
      console.log(`❌ Error deleting ${member.name}:`, error.response?.data?.message || error.message);
    }
  }
}

// Fresh test data
const freshMembers = [
  {
    name: 'Rev. Fr. S. Leon Henson',
    position: 'Parish Priest',
    description: 'Rev. Fr. S. Leon Henson serves as the dedicated Parish Priest, leading the congregation with spiritual guidance and pastoral care. He has been serving our community for over 15 years with unwavering dedication to the faith and the people.',
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
    description: 'Mr. Siluvai Dhasan is the Vice President of the parish council, ensuring effective administration and community engagement. His leadership has been instrumental in various parish development projects and community outreach programs.',
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
    description: 'Mr. David serves as the Secretary, overseeing communications and ensuring smooth coordination of parish activities. He manages all administrative tasks with great efficiency and maintains excellent records.',
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
    description: 'Janate is the Treasurer, responsible for managing the parish finances and ensuring transparency in fiscal matters. She brings years of financial expertise to our community and maintains accurate financial records.',
    phone: '+91 98765 43213',
    email: 'janate@devasahayamshrine.com',
    display_order: 4,
    is_active: true,
    is_featured: false
  },
  {
    name: 'Mr. John Paul',
    position: 'Youth Coordinator',
    description: 'Mr. John Paul leads our youth ministry programs and coordinates activities for young parishioners. He is passionate about engaging the next generation in faith-based activities and community service.',
    phone: '+91 98765 43214',
    email: 'johnpaul@devasahayamshrine.com',
    display_order: 5,
    is_active: true,
    is_featured: false
  },
  {
    name: 'Mrs. Mary Joseph',
    position: 'Women\'s Fellowship Leader',
    description: 'Mrs. Mary Joseph coordinates women\'s fellowship activities and community outreach programs. She has been a pillar of strength in organizing charitable activities and supporting families in need.',
    phone: '+91 98765 43215',
    email: 'mary.joseph@devasahayamshrine.com',
    display_order: 6,
    is_active: true,
    is_featured: false
  }
];

// Add fresh members
async function addFreshMembers() {
  console.log('\n📝 Adding fresh management team members...');
  
  for (const member of freshMembers) {
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
      } else {
        console.log(`❌ Failed to add ${member.name}: ${response.data.message}`);
      }
    } catch (error) {
      console.log(`❌ Error adding ${member.name}:`, error.response?.data?.message || error.message);
    }
  }
}

// Show final results
async function showResults() {
  console.log('\n📋 Final management team members:');
  
  const members = await getAllMembers();
  
  console.log(`✅ Total members: ${members.length}`);
  members.forEach((member, index) => {
    console.log(`   ${index + 1}. ${member.name} (${member.position}) - ${member.is_active ? 'Active' : 'Inactive'} ${member.is_featured ? '⭐' : ''}`);
  });
  
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
      console.log('\n📊 Statistics:');
      console.log(`   Total: ${stats.total}`);
      console.log(`   Active: ${stats.active}`);
      console.log(`   Featured: ${stats.featured}`);
      console.log(`   Inactive: ${stats.inactive}`);
    }
  } catch (error) {
    console.log('❌ Error getting statistics:', error.response?.data?.message || error.message);
  }
}

// Main function
async function cleanAndAddData() {
  console.log('🚀 Clean and Add Management Team Data\n');
  console.log('=' .repeat(50));
  
  // Step 1: Login
  const loginSuccess = await login();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without authentication');
    return;
  }
  
  // Step 2: Clean existing data
  await deleteAllMembers();
  
  // Step 3: Add fresh data
  await addFreshMembers();
  
  // Step 4: Show results
  await showResults();
  
  console.log('\n' + '=' .repeat(50));
  console.log('✅ Clean and Add Operation Completed!');
  
  console.log('\n🌐 You can now visit:');
  console.log('1. Admin Interface: http://localhost:5174/admin/management');
  console.log('2. Public Page: http://localhost:5174/management');
  console.log('3. Login with: admin / shrine@admin123');
}

// Run the script
cleanAndAddData().catch(console.error);