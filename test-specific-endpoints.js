// Test specific API endpoints
const backendUrl = 'https://doctor-appointment-app-b4av.onrender.com';

async function testSpecificEndpoints() {
    console.log('🧪 Testing Specific API Endpoints...\n');
    
    // Test with POST request to see if routes are accessible
    try {
        console.log('Testing user registration endpoint...');
        const response = await fetch(`${backendUrl}/api/user/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({}) // Empty body to test endpoint
        });
        
        const text = await response.text();
        console.log(`Status: ${response.status}`);
        console.log(`Response: ${text.substring(0, 200)}${text.length > 200 ? '...' : ''}`);
        
        if (response.status === 400 || response.status === 422) {
            console.log('✅ User registration endpoint is accessible (validation error expected with empty data)');
        } else {
            console.log(`📊 Response status: ${response.status}`);
        }
        
    } catch (error) {
        console.log(`❌ Error: ${error.message}`);
    }
}

testSpecificEndpoints();
