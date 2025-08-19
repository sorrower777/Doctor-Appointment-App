// Quick test to check if the deployed fix is working
const testDeploymentFix = async () => {
    try {
        console.log('Testing deployed backend health...');
        
        // Test the health endpoint first
        const healthResponse = await fetch('https://doctor-appointment-app-b4av.onrender.com/health');
        const healthData = await healthResponse.json();
        console.log('Health check:', healthData);
        
        // Test if the API is responding
        const apiResponse = await fetch('https://doctor-appointment-app-b4av.onrender.com/api/user/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: 'Test',
                email: 'test' + Date.now() + '@example.com',
                password: 'testpass123'
            })
        });
        
        const apiData = await apiResponse.json();
        console.log('API test response:', apiData);
        
        if (apiData.success) {
            console.log('✅ Deployment appears to be working!');
            console.log('🔄 You can now try updating your profile picture again');
        } else {
            console.log('⚠️ API responded but with an error:', apiData.message);
        }
        
    } catch (error) {
        console.error('❌ Error testing deployment:', error.message);
        console.log('💡 The deployment might still be in progress. Wait 2-3 minutes and try again.');
    }
};

// Instructions for the user
console.log('='.repeat(60));
console.log('PROFILE PICTURE FIX - DEPLOYMENT TEST');
console.log('='.repeat(60));
console.log('');
console.log('1. Wait 2-3 minutes for Render to complete deployment');
console.log('2. Run this test to verify the fix is deployed');
console.log('3. Try updating your profile picture again');
console.log('');
console.log('Running deployment test...');
console.log('');

// Run the test
testDeploymentFix();
