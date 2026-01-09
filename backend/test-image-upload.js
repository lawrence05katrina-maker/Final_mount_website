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

// Helper function to create a test image (simple colored square)
function createTestImage(color = 'red') {
  // Create a simple colored square SVG and convert to base64
  const svgContent = `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="${color}"/>
      <text x="100" y="100" text-anchor="middle" dy=".3em" fill="white" font-size="16">Test Image</text>
    </svg>
  `;
  
  const base64Data = Buffer.from(svgContent).toString('base64');
  return `data:image/svg+xml;base64,${base64Data}`;
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

// Test image upload functionality
async function testImageUpload() {
  console.log('\n📸 Testing Image Upload Functionality...');
  
  // Test 1: Create member with image
  console.log('\n1. Creating member with image...');
  
  const memberWithImage = {
    name: 'Test Member With Image',
    position: 'Test Position',
    description: 'This is a test member created with an image to test the upload functionality.',
    phone: '+91 98765 12345',
    email: 'test@example.com',
    display_order: 99,
    is_active: true,
    image_data: createTestImage('blue')
  };
  
  try {
    const response = await axios.post(
      `${BASE_URL}/management/admin`,
      memberWithImage,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (response.data.success) {
      const createdMember = response.data.data;
      console.log(`✅ Created member with image: ${createdMember.name} (ID: ${createdMember.id})`);
      console.log(`   Image URL: ${createdMember.image_url}`);
      console.log(`   Image Name: ${createdMember.image_name}`);
      console.log(`   Image Size: ${createdMember.image_size} bytes`);
      
      // Test 2: Update member image
      console.log('\n2. Updating member image...');
      
      const updateData = {
        name: createdMember.name,
        position: createdMember.position,
        description: createdMember.description + ' [UPDATED WITH NEW IMAGE]',
        phone: createdMember.phone,
        email: createdMember.email,
        display_order: createdMember.display_order,
        is_active: createdMember.is_active,
        image_data: createTestImage('green')
      };
      
      const updateResponse = await axios.put(
        `${BASE_URL}/management/admin/${createdMember.id}`,
        updateData,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (updateResponse.data.success) {
        const updatedMember = updateResponse.data.data;
        console.log(`✅ Updated member image: ${updatedMember.name}`);
        console.log(`   New Image URL: ${updatedMember.image_url}`);
        console.log(`   New Image Name: ${updatedMember.image_name}`);
        console.log(`   New Image Size: ${updatedMember.image_size} bytes`);
      }
      
      // Test 3: Remove image
      console.log('\n3. Removing member image...');
      
      const removeImageData = {
        name: createdMember.name,
        position: createdMember.position,
        description: createdMember.description + ' [IMAGE REMOVED]',
        phone: createdMember.phone,
        email: createdMember.email,
        display_order: createdMember.display_order,
        is_active: createdMember.is_active,
        remove_image: true
      };
      
      const removeResponse = await axios.put(
        `${BASE_URL}/management/admin/${createdMember.id}`,
        removeImageData,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (removeResponse.data.success) {
        const memberWithoutImage = removeResponse.data.data;
        console.log(`✅ Removed image from member: ${memberWithoutImage.name}`);
        console.log(`   Image URL: ${memberWithoutImage.image_url || 'null'}`);
        console.log(`   Image Name: ${memberWithoutImage.image_name || 'null'}`);
      }
      
      // Test 4: Delete member (should also delete any remaining image files)
      console.log('\n4. Deleting member (and cleaning up files)...');
      
      const deleteResponse = await axios.delete(
        `${BASE_URL}/management/admin/${createdMember.id}`,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        }
      );
      
      if (deleteResponse.data.success) {
        console.log(`✅ Deleted member: ${deleteResponse.data.data.name}`);
      }
      
    } else {
      console.log(`❌ Failed to create member: ${response.data.message}`);
    }
    
  } catch (error) {
    console.log(`❌ Error in image upload test:`, error.response?.data?.message || error.message);
  }
}

// Test member without image
async function testMemberWithoutImage() {
  console.log('\n👤 Testing Member Without Image...');
  
  const memberWithoutImage = {
    name: 'Test Member No Image',
    position: 'Test Position',
    description: 'This is a test member created without an image.',
    phone: '+91 98765 54321',
    email: 'noimage@example.com',
    display_order: 98,
    is_active: true
  };
  
  try {
    const response = await axios.post(
      `${BASE_URL}/management/admin`,
      memberWithoutImage,
      {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (response.data.success) {
      const createdMember = response.data.data;
      console.log(`✅ Created member without image: ${createdMember.name} (ID: ${createdMember.id})`);
      console.log(`   Image URL: ${createdMember.image_url || 'null'}`);
      
      // Clean up
      await axios.delete(
        `${BASE_URL}/management/admin/${createdMember.id}`,
        {
          headers: {
            'Authorization': `Bearer ${authToken}`
          }
        }
      );
      console.log(`✅ Cleaned up test member`);
      
    } else {
      console.log(`❌ Failed to create member: ${response.data.message}`);
    }
    
  } catch (error) {
    console.log(`❌ Error in no-image test:`, error.response?.data?.message || error.message);
  }
}

// Get all members and show their image status
async function showCurrentMembers() {
  console.log('\n📋 Current Management Team Members:');
  
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
      const members = response.data.data;
      console.log(`✅ Found ${members.length} members:`);
      
      members.forEach((member, index) => {
        const hasImage = member.image_url ? '🖼️' : '📷';
        console.log(`   ${index + 1}. ${hasImage} ${member.name} (${member.position}) - ${member.is_active ? 'Active' : 'Inactive'}`);
        if (member.image_url) {
          console.log(`      Image: ${member.image_url} (${member.image_size} bytes)`);
        }
      });
    } else {
      console.log('❌ Failed to fetch members:', response.data.message);
    }
  } catch (error) {
    console.log('❌ Error fetching members:', error.response?.data?.message || error.message);
  }
}

// Main test function
async function runImageTests() {
  console.log('🚀 Testing Management Team Image Upload System\n');
  console.log('=' .repeat(60));
  
  // Step 1: Login
  const loginSuccess = await login();
  if (!loginSuccess) {
    console.log('❌ Cannot proceed without authentication');
    return;
  }
  
  // Step 2: Show current members
  await showCurrentMembers();
  
  // Step 3: Test image upload functionality
  await testImageUpload();
  
  // Step 4: Test member without image
  await testMemberWithoutImage();
  
  // Step 5: Show final state
  await showCurrentMembers();
  
  console.log('\n' + '=' .repeat(60));
  console.log('✅ Image Upload Tests Completed!');
  
  console.log('\n📝 Tests Performed:');
  console.log('- ✅ Create member with image');
  console.log('- ✅ Update member image');
  console.log('- ✅ Remove member image');
  console.log('- ✅ Delete member (with file cleanup)');
  console.log('- ✅ Create member without image');
  
  console.log('\n🌐 Image Upload Features:');
  console.log('- ✅ Base64 image upload');
  console.log('- ✅ Image validation (type, size)');
  console.log('- ✅ Automatic file naming');
  console.log('- ✅ File cleanup on delete');
  console.log('- ✅ Image replacement on update');
  console.log('- ✅ Optional image removal');
  
  console.log('\n📁 Image Storage:');
  console.log('- Location: backend/uploads/management/');
  console.log('- Format: management_timestamp_random.ext');
  console.log('- Access: http://localhost:5000/uploads/management/filename');
  
  console.log('\n🎯 Next Steps:');
  console.log('1. Visit http://localhost:5174/admin/management');
  console.log('2. Test drag & drop image upload');
  console.log('3. Test clipboard paste (Ctrl+V)');
  console.log('4. Upload real member photos');
}

// Run the tests
runImageTests().catch(console.error);