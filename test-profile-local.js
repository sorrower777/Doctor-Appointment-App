// Test script for profile update
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');

async function testProfileUpdate() {
    try {
        // First, let's test login to get a valid token
        console.log('Testing login...');
        const loginResponse = await axios.post('http://localhost:4000/api/user/login', {
            email: 'test@example.com',  // Replace with a valid test email
            password: 'testpassword'   // Replace with a valid test password
        });
        
        if (!loginResponse.data.success) {
            console.log('Login failed:', loginResponse.data.message);
            return;
        }
        
        const token = loginResponse.data.token;
        console.log('Login successful, token received');
        
        // Now test profile update
        console.log('Testing profile update...');
        const formData = new FormData();
        formData.append('name', 'Test User Updated');
        formData.append('phone', '1234567890');
        formData.append('address', JSON.stringify({
            line1: '123 Test Street',
            line2: 'Test Area'
        }));
        formData.append('dob', '1990-01-01');
        formData.append('gender', 'Male');
        
        // If you have a test image, uncomment the line below
        // formData.append('image', fs.createReadStream('path/to/test/image.jpg'));
        
        const updateResponse = await axios.post('http://localhost:4000/api/user/update-profile', formData, {
            headers: {
                'token': token,
                ...formData.getHeaders()
            }
        });
        
        console.log('Update response:', updateResponse.data);
        
    } catch (error) {
        console.error('Test error:', error.response?.data || error.message);
        if (error.response?.data) {
            console.error('Full error response:', error.response.data);
        }
    }
}

// Run the test
testProfileUpdate();
