// Test script to verify backend API connection
const backendUrl = 'https://doctor-appointment-app-b4av.onrender.com';

async function testBackendEndpoints() {
    console.log('🧪 Testing Backend API Connection...\n');
    
    const endpoints = [
        { name: 'Health Check', url: `${backendUrl}/health` },
        { name: 'Root Endpoint', url: `${backendUrl}/` },
        { name: 'User Routes', url: `${backendUrl}/api/user` },
        { name: 'Admin Routes', url: `${backendUrl}/api/admin` },
        { name: 'Doctor Routes', url: `${backendUrl}/api/doctor` }
    ];
    
    for (const endpoint of endpoints) {
        try {
            console.log(`Testing ${endpoint.name}...`);
            const response = await fetch(endpoint.url);
            
            if (response.ok) {
                const text = await response.text();
                console.log(`✅ ${endpoint.name}: ${response.status} - ${text.substring(0, 100)}${text.length > 100 ? '...' : ''}`);
            } else {
                console.log(`⚠️  ${endpoint.name}: ${response.status} - ${response.statusText}`);
            }
        } catch (error) {
            console.log(`❌ ${endpoint.name}: Error - ${error.message}`);
        }
        console.log('');
    }
    
    console.log('🎯 Test completed!');
}

testBackendEndpoints();
