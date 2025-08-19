// Test script to verify doctor image upload functionality
const testImageUpload = async () => {
    const backendUrl = 'https://doctor-appointment-app-b4av.onrender.com'
    
    console.log('Testing doctor image upload endpoint...')
    console.log('Backend URL:', backendUrl)
    
    // Test if the endpoint exists
    try {
        const response = await fetch(`${backendUrl}/api/doctor/upload-image`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        })
        
        const data = await response.json()
        console.log('Response status:', response.status)
        console.log('Response data:', data)
        
        if (response.status === 200 && data.message && data.message.includes('Not Authorized')) {
            console.log('✅ Endpoint exists and authentication is working')
        } else {
            console.log('❌ Unexpected response')
        }
    } catch (error) {
        console.error('❌ Error testing endpoint:', error)
    }
}

// Test backend connectivity
const testBackendConnectivity = async () => {
    const backendUrl = 'https://doctor-appointment-app-b4av.onrender.com'
    
    console.log('\nTesting backend connectivity...')
    try {
        const response = await fetch(`${backendUrl}/api/doctor/list`)
        const data = await response.json()
        
        if (data.success) {
            console.log('✅ Backend is accessible')
            console.log('Doctors count:', data.doctors?.length || 0)
        } else {
            console.log('❌ Backend error:', data.message)
        }
    } catch (error) {
        console.error('❌ Backend connectivity error:', error)
    }
}

// Run tests
testBackendConnectivity()
testImageUpload()
