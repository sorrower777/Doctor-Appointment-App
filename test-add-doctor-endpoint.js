// Test the specific add-doctor endpoint
const backendUrl = 'https://doctor-appointment-app-b4av.onrender.com';

async function testAddDoctorEndpoint() {
    console.log('🧪 Testing Add Doctor Endpoint...\n');
    
    try {
        console.log('Testing add-doctor endpoint with POST request...');
        const response = await fetch(`${backendUrl}/api/admin/add-doctor`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'atoken': 'test-token' // This will fail auth but test if endpoint exists
            },
            body: JSON.stringify({}) // Empty body to test endpoint
        });
        
        const text = await response.text();
        console.log(`Status: ${response.status}`);
        console.log(`Response: ${text.substring(0, 200)}${text.length > 200 ? '...' : ''}`);
        
        if (response.status === 401 || response.status === 403) {
            console.log('✅ Add-doctor endpoint is accessible (authentication error expected with invalid token)');
        } else if (response.status === 400) {
            console.log('✅ Add-doctor endpoint is accessible (validation error expected with empty data)');
        } else if (response.status === 404) {
            console.log('❌ Add-doctor endpoint not found - there might be a routing issue');
        } else {
            console.log(`📊 Response status: ${response.status}`);
        }
        
    } catch (error) {
        console.log(`❌ Error: ${error.message}`);
    }
}

testAddDoctorEndpoint();
