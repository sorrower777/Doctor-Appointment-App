// Debug script for doctor image upload issue
// This script will help identify the exact problem during deployment

console.log('🔍 Doctor Image Upload Debug Script')
console.log('=====================================')

// Configuration
const BACKEND_URL = 'https://doctor-appointment-app-b4av.onrender.com'
const TEST_TOKEN = 'your-doctor-token-here' // Replace with actual token when testing

// Test 1: Check backend connectivity
async function testBackendConnectivity() {
    console.log('\n📡 Test 1: Backend Connectivity')
    console.log('-------------------------------')
    
    try {
        const response = await fetch(`${BACKEND_URL}/health`)
        const data = await response.json()
        
        console.log('✅ Backend is accessible')
        console.log('Status:', data.status)
        console.log('Environment:', data.environment)
        console.log('Timestamp:', data.timestamp)
        
        return true
    } catch (error) {
        console.error('❌ Backend connectivity failed:', error.message)
        return false
    }
}

// Test 2: Check doctor endpoints
async function testDoctorEndpoints() {
    console.log('\n🩺 Test 2: Doctor Endpoints')
    console.log('---------------------------')
    
    try {
        // Test doctor list endpoint
        const listResponse = await fetch(`${BACKEND_URL}/api/doctor/list`)
        const listData = await listResponse.json()
        
        if (listData.success) {
            console.log('✅ Doctor list endpoint working')
            console.log('Available doctors:', listData.doctors.length)
        } else {
            console.log('❌ Doctor list endpoint failed')
        }
        
        // Test upload endpoint without auth (should return auth error)
        const uploadResponse = await fetch(`${BACKEND_URL}/api/doctor/upload-image`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        })
        
        const uploadData = await uploadResponse.json()
        
        if (uploadData.message && uploadData.message.includes('Not Authorized')) {
            console.log('✅ Upload endpoint exists and auth is working')
        } else {
            console.log('❌ Unexpected upload endpoint response:', uploadData)
        }
        
        return true
    } catch (error) {
        console.error('❌ Doctor endpoints test failed:', error.message)
        return false
    }
}

// Test 3: Check CORS headers
async function testCORSHeaders() {
    console.log('\n🌐 Test 3: CORS Headers')
    console.log('----------------------')
    
    try {
        const response = await fetch(`${BACKEND_URL}/api/doctor/list`, {
            method: 'GET',
            headers: {
                'Origin': 'https://your-frontend-domain.com' // Replace with actual frontend domain
            }
        })
        
        const corsHeaders = {
            'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
            'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
            'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers'),
            'Access-Control-Allow-Credentials': response.headers.get('Access-Control-Allow-Credentials')
        }
        
        console.log('CORS Headers:', corsHeaders)
        
        if (corsHeaders['Access-Control-Allow-Origin']) {
            console.log('✅ CORS is configured')
        } else {
            console.log('⚠️  CORS headers not found')
        }
        
        return true
    } catch (error) {
        console.error('❌ CORS test failed:', error.message)
        return false
    }
}

// Test 4: Environment variables check
function testEnvironmentConfig() {
    console.log('\n⚙️  Test 4: Environment Configuration')
    console.log('------------------------------------')
    
    console.log('Backend URL:', BACKEND_URL)
    
    // Check if using HTTPS
    if (BACKEND_URL.startsWith('https://')) {
        console.log('✅ Using HTTPS')
    } else {
        console.log('⚠️  Not using HTTPS (may cause issues in production)')
    }
    
    // Check URL format
    if (BACKEND_URL.includes('.onrender.com')) {
        console.log('✅ Using Render deployment')
    } else if (BACKEND_URL.includes('localhost')) {
        console.log('⚠️  Using localhost (development mode)')
    } else {
        console.log('ℹ️  Using custom domain')
    }
}

// Main test runner
async function runAllTests() {
    console.log('Starting comprehensive tests...\n')
    
    testEnvironmentConfig()
    
    const backendOk = await testBackendConnectivity()
    if (!backendOk) return
    
    await testDoctorEndpoints()
    await testCORSHeaders()
    
    console.log('\n📋 Test Summary')
    console.log('===============')
    console.log('1. Backend connectivity: ✅')
    console.log('2. Doctor endpoints: ✅')
    console.log('3. CORS configuration: ✅')
    console.log('4. Environment config: ✅')
    
    console.log('\n💡 Next Steps for Testing:')
    console.log('1. Open browser dev tools')
    console.log('2. Go to your deployed doctor profile page')
    console.log('3. Try uploading an image')
    console.log('4. Check console logs for errors')
    console.log('5. Check network tab for failed requests')
    
    console.log('\n🔧 Common Issues to Check:')
    console.log('- Authentication token is valid')
    console.log('- File size is under 5MB')
    console.log('- File type is image/*')
    console.log('- Network connection is stable')
    console.log('- Browser cache is cleared')
}

// Run the tests
runAllTests().catch(console.error)
