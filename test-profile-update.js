const FormData = require('form-data');
const fs = require('fs');
const fetch = require('node-fetch');

// Test script to check profile update functionality
async function testProfileUpdate() {
    try {
        // Replace with your actual JWT token
        const token = 'YOUR_JWT_TOKEN_HERE';
        
        // Replace with your deployed backend URL
        const baseURL = 'https://doctor-appointment-app-b4av.onrender.com';
        
        // Create form data for testing
        const form = new FormData();
        form.append('name', 'Test User Updated');
        form.append('phone', '1234567890');
        form.append('address', JSON.stringify({
            line1: '123 Test Street',
            line2: 'Test Area'
        }));
        form.append('dob', '1990-01-01');
        form.append('gender', 'Male');
        
        // If you want to test image upload, uncomment the line below
        // and provide a path to a test image
        // form.append('image', fs.createReadStream('path/to/test/image.jpg'));
        
        const response = await fetch(`${baseURL}/api/user/update-profile`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                ...form.getHeaders()
            },
            body: form
        });
        
        const result = await response.json();
        console.log('Response:', result);
        
        if (result.success) {
            console.log('✅ Profile update test passed!');
        } else {
            console.log('❌ Profile update test failed:', result.message);
        }
        
    } catch (error) {
        console.error('Test error:', error);
    }
}

console.log('Profile Update Test Script');
console.log('========================');
console.log('Make sure to:');
console.log('1. Replace YOUR_JWT_TOKEN_HERE with a valid JWT token');
console.log('2. Update the baseURL if different');
console.log('3. Run: npm install form-data node-fetch');
console.log('');

// Uncomment the line below to run the test
// testProfileUpdate();
