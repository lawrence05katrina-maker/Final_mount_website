const axios = require('axios');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5000/api';
let authToken = '';

// Create a simple mock image (1x1 pixel PNG in base64)
const createMockImage = (color = 'blue') => {
  // Different colored 1x1 pixel PNGs in base64
  const images = {
    blue: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9jU77zgAAAABJRU5ErkJggg==',
    red: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
    green: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
    yellow: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/x+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==',
    purple: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP4/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg=='
  };
  return images[color] || images.blue;
};

// Sample management team data with realistic information
const sampleMembers = [
  {
    name: 'Rev. Fr. Michael Rodriguez',
    position: 'Parish Priest',
    description: 'Rev. Fr. Michael Rodriguez has been serving as the Parish Priest for over 15 years. He holds a Master\'s degree in Theology and is known for his compassionate pastoral care and community outreach programs.',
    phone: '+91 98765 43210',
    email: 'fr.michael@devasahayamshrine.org',
    display_order: 1,
    is_active: true,
    image_color: 'blue'
  },
  {
    name: 'Rev. Fr. Thomas Xavier',
    position: 'Assistant Priest',
    description: 'Rev. Fr. Thomas Xavier assists in daily masses and special ceremonies. He specializes in youth ministry and has been instrumental in organizing various spiritual retreats and educational programs.',
    phone: '+91 98765 43211',
    email: 'fr.thomas@devasahayamshrine.org',
    display_order: 2,
    is_active: true,
    image_color: 'green'
  },
  {
    name: 'Mr. Joseph Antony',
    position: 'Parish Council President',
    description: 'Mr. Joseph Antony leads the parish council with dedication and wisdom. He has been actively involved in church administration for over 20 years and coordinates major parish events and fundraising activities.',
    phone: '+91 98765 43212',
    email: 'joseph.antony@devasahayamshrine.org',
    display_order: 3,
    is_active: true,
    image_color: 'red'
  },
  {
    name: 'Mrs. Mary Fernandez',
    position: 'Secretary',
    description: 'Mrs. Mary Fernandez manages all administrative tasks and communications for the parish. She maintains records, coordinates meetings, and ensures smooth day-to-day operations of the shrine.',
    phone: '+91 98765 43213',
    email: 'mary.fernandez@devasahayamshrine.org',
    display_order: 4,
    is_active: true,
    image_color: 'yellow'
  },
  {
    name: 'Mr. David Kumar',
    position: 'Treasurer',
    description: 'Mr. David Kumar oversees all financial matters of the parish including donations, expenses, and budget planning. He brings over 25 years of accounting experience to his role.',
    phone: '+91 98765 43214',
    email: 'david.kumar@devasahayamshrine.org',
    display_order: 5,
    is_active: true,
    image_color: 'purple'
  },
  {
    name: 'Mrs. Susan Paul',
    position: 'Youth Coordinator',
    description: 'Mrs. Susan Paul leads the youth ministry and organizes various programs for young parishioners. She coordinates Sunday school, youth camps, and community service projects.',
    phone: '+91 98765 43215',
    email: 'susan.paul@devasahayamshrine.org',
    display_order: 6,
    is_active: true,
    image_color: 'blue'
  },
  {
    name: 'Mr. Peter Williams',
    position: 'Maintenance Supervisor',
    description: 'Mr. Peter Williams ensures the shrine and its facilities are well-maintained. He coordinates repairs, landscaping, and general upkeep of the church premises.',
    phone: '+91 98765 43216',
    email: 'peter.williams@devasahayamshrine.org',
    display_order: 7,
    is_active: true,
    image_color: 'green'
  },
  {
    name: 'Mrs. Grace Thomas',
    position: 'Music Director',
    description: 'Mrs. Grace Thomas leads the church choir and coordinates all musical activities during masses and special celebrations. She has been serving in this role for over 10 years.',
    phone: '+91 98765 43217',
    email: 'grace.thomas@devasahayamshrine.org',
    display_order: 8,
    is_active: false, // Inactive member for testing
    image_color: 'red'
  },
  {
    name: 'Mr. John Baptist',
    position: 'Security Coordinator',
    description: 'Mr. John Baptist manages security arrangements for the shrine, especially during major festivals and events. He coordinates with local authorities and volunteer security teams.',
    phone: '+91 98765 43218',
    email: 'john.baptist@devasahayamshrine.org',
    display_order: 9,
    is_active: true,
    image_color: 'yellow'
  },
  {
    name: 'Mrs. Elizabeth George',
    position: 'Social Service Coordinator',
    description: 'Mrs. Elizabeth George leads various charitable activities and social service programs. She coordinates food distribution, medical camps, and educational support for underprivileged families.',
    phone: '+91 98765 43219',
    email: 'elizabeth.george@devasahayamshrine.org',
    display_order: 10,
    is_active: true,
    image_color: 'purple'
  }
];

// Login function
async function login() {
  try {
    console.log('🔐 Logging in as admin...');
    const response = await axios.post(`${BASE_URL}/admin/login`, {
      username: 'admin',
      password: 'shrine@admin123'
    });
    
    if (response.data.success) {
      authToken = response.data.data.token;
      console.log('✅ Login successful');
      return true;
    } else {
      console.log('❌ Login failed');
      return false;
    }
  } catch (error) {
    console.log('❌ Login error:', error.message);
    return false;
  }
}

// Create axios instance with auth
const createAuthenticatedAxios = () => {
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    }
  });
};

// Add member with image
async function addMemberWithImage(memberData) {
  try {
    const api = createAuthenticatedAxios();
    const imageData = createMockImage(memberData.image_color);
    
    const payload = {
      name: memberData.name,
      position: memberData.position,
      description: memberData.description,
      phone: memberData.phone,
      email: memberData.email,
      display_order: memberData.display_order,
      is_active: memberData.is_active,
      image_data: imageData
    };

    const startTime = Date.now();
    const response = await api.post('/management/admin', payload);
    const endTime = Date.now();
    
    if (response.data.success) {
      console.log(`✅ Added: ${memberData.name} (${endTime - startTime}ms)`);
      return { success: true, data: response.data.data, time: endTime - startTime };
    } else {
      console.log(`❌ Failed to add: ${memberData.name}`);
      return { success: false, time: endTime - startTime };
    }
  } catch (error) {
    console.log(`❌ Error adding ${memberData.name}:`, error.message);
    return { success: false, error: error.message };
  }
}

// Get all members and measure performance
async function getAllMembers() {
  try {
    const api = createAuthenticatedAxios();
    const startTime = Date.now();
    const response = await api.get('/management/admin/all');
    const endTime = Date.now();
    
    if (response.data.success) {
      console.log(`✅ Retrieved ${response.data.data.length} members (${endTime - startTime}ms)`);
      return { success: true, data: response.data.data, time: endTime - startTime };
    } else {
      console.log('❌ Failed to retrieve members');
      return { success: false, time: endTime - startTime };
    }
  } catch (error) {
    console.log('❌ Error retrieving members:', error.message);
    return { success: false, error: error.message };
  }
}

// Get active members (public endpoint)
async function getActiveMembers() {
  try {
    const startTime = Date.now();
    const response = await axios.get(`${BASE_URL}/management/active`);
    const endTime = Date.now();
    
    if (response.data.success) {
      console.log(`✅ Retrieved ${response.data.data.length} active members (${endTime - startTime}ms)`);
      return { success: true, data: response.data.data, time: endTime - startTime };
    } else {
      console.log('❌ Failed to retrieve active members');
      return { success: false, time: endTime - startTime };
    }
  } catch (error) {
    console.log('❌ Error retrieving active members:', error.message);
    return { success: false, error: error.message };
  }
}

// Update member performance test
async function updateMemberPerformance(memberId) {
  try {
    const api = createAuthenticatedAxios();
    const newImageData = createMockImage('green'); // Change to green image
    
    const payload = {
      name: 'Updated Test Member',
      position: 'Updated Position',
      description: 'This member has been updated with new information and a new image to test update performance.',
      phone: '+91 99999 99999',
      email: 'updated@test.com',
      display_order: 1,
      is_active: true,
      image_data: newImageData
    };

    const startTime = Date.now();
    const response = await api.put(`/management/admin/${memberId}`, payload);
    const endTime = Date.now();
    
    if (response.data.success) {
      console.log(`✅ Updated member ${memberId} (${endTime - startTime}ms)`);
      return { success: true, time: endTime - startTime };
    } else {
      console.log(`❌ Failed to update member ${memberId}`);
      return { success: false, time: endTime - startTime };
    }
  } catch (error) {
    console.log(`❌ Error updating member ${memberId}:`, error.message);
    return { success: false, error: error.message };
  }
}

// Main performance test
async function runPerformanceTest() {
  console.log('🚀 Starting Management System Performance Test with Images\n');
  console.log('=' .repeat(70));
  
  // Login
  const loginSuccess = await login();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without authentication');
    return;
  }
  
  console.log('\n📊 Performance Metrics:');
  console.log('-'.repeat(50));
  
  const metrics = {
    create: [],
    read: [],
    update: [],
    publicRead: []
  };
  
  // Test CREATE operations with images
  console.log('\n1️⃣ Testing CREATE operations with images...');
  for (let i = 0; i < sampleMembers.length; i++) {
    const member = sampleMembers[i];
    const result = await addMemberWithImage(member);
    if (result.success) {
      metrics.create.push(result.time);
    }
    // Small delay to avoid overwhelming the server
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  // Test READ operations
  console.log('\n2️⃣ Testing READ operations...');
  for (let i = 0; i < 5; i++) {
    const result = await getAllMembers();
    if (result.success) {
      metrics.read.push(result.time);
    }
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  // Test public READ operations
  console.log('\n3️⃣ Testing PUBLIC READ operations...');
  for (let i = 0; i < 5; i++) {
    const result = await getActiveMembers();
    if (result.success) {
      metrics.publicRead.push(result.time);
    }
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  // Test UPDATE operation
  console.log('\n4️⃣ Testing UPDATE operation with image...');
  const allMembers = await getAllMembers();
  if (allMembers.success && allMembers.data.length > 0) {
    const firstMember = allMembers.data[0];
    const updateResult = await updateMemberPerformance(firstMember.id);
    if (updateResult.success) {
      metrics.update.push(updateResult.time);
    }
  }
  
  // Calculate and display performance statistics
  console.log('\n📈 PERFORMANCE SUMMARY');
  console.log('=' .repeat(70));
  
  const calculateStats = (times) => {
    if (times.length === 0) return { avg: 0, min: 0, max: 0 };
    const avg = times.reduce((a, b) => a + b, 0) / times.length;
    const min = Math.min(...times);
    const max = Math.max(...times);
    return { avg: avg.toFixed(2), min, max };
  };
  
  const createStats = calculateStats(metrics.create);
  const readStats = calculateStats(metrics.read);
  const publicReadStats = calculateStats(metrics.publicRead);
  const updateStats = calculateStats(metrics.update);
  
  console.log(`\n🔹 CREATE Operations (${metrics.create.length} operations):`);
  console.log(`   Average: ${createStats.avg}ms | Min: ${createStats.min}ms | Max: ${createStats.max}ms`);
  
  console.log(`\n🔹 ADMIN READ Operations (${metrics.read.length} operations):`);
  console.log(`   Average: ${readStats.avg}ms | Min: ${readStats.min}ms | Max: ${readStats.max}ms`);
  
  console.log(`\n🔹 PUBLIC READ Operations (${metrics.publicRead.length} operations):`);
  console.log(`   Average: ${publicReadStats.avg}ms | Min: ${publicReadStats.min}ms | Max: ${publicReadStats.max}ms`);
  
  console.log(`\n🔹 UPDATE Operations (${metrics.update.length} operations):`);
  console.log(`   Average: ${updateStats.avg}ms | Min: ${updateStats.min}ms | Max: ${updateStats.max}ms`);
  
  // Final verification
  console.log('\n🔍 FINAL VERIFICATION');
  console.log('-'.repeat(50));
  
  const finalCheck = await getAllMembers();
  if (finalCheck.success) {
    const activeCount = finalCheck.data.filter(m => m.is_active).length;
    const inactiveCount = finalCheck.data.filter(m => !m.is_active).length;
    const withImages = finalCheck.data.filter(m => m.image_url).length;
    
    console.log(`✅ Total Members: ${finalCheck.data.length}`);
    console.log(`✅ Active Members: ${activeCount}`);
    console.log(`✅ Inactive Members: ${inactiveCount}`);
    console.log(`✅ Members with Images: ${withImages}`);
    
    console.log('\n📋 Sample Member Details:');
    const sampleMember = finalCheck.data[0];
    if (sampleMember) {
      console.log(`   Name: ${sampleMember.name}`);
      console.log(`   Position: ${sampleMember.position}`);
      console.log(`   Has Image: ${sampleMember.image_url ? 'Yes' : 'No'}`);
      console.log(`   Image URL: ${sampleMember.image_url || 'None'}`);
      console.log(`   Status: ${sampleMember.is_active ? 'Active' : 'Inactive'}`);
    }
  }
  
  console.log('\n🌐 FRONTEND ACCESS INFORMATION');
  console.log('=' .repeat(70));
  console.log('🔗 Admin Interface: http://localhost:5174/admin/management');
  console.log('🔗 Public Page: http://localhost:5174/management');
  console.log('🔑 Login: admin / shrine@admin123');
  
  console.log('\n✅ Performance test completed successfully!');
  console.log('💡 You can now visit the frontend to see the management system in action.');
}

// Run the test
runPerformanceTest().catch(console.error);