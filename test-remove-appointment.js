const axios = require('axios');

// Test the remove appointment endpoint
async function testRemoveAppointment() {
    const backendUrl = 'http://localhost:4000';
    
    // You'll need to replace these with actual values from your app
    const testToken = 'your_jwt_token_here'; // Get this from localStorage in your browser
    const testAppointmentId = 'your_appointment_id_here'; // Get this from your appointments list
    
    console.log('Testing remove appointment endpoint...');
    console.log('Token:', testToken);
    console.log('Appointment ID:', testAppointmentId);
    
    try {
        const response = await axios.post(backendUrl + '/api/user/remove-appointment', {
            appointmentId: testAppointmentId
        }, {
            headers: { 
                token: testToken,
                'Content-Type': 'application/json'
            }
        });
        
        console.log('Success response:', response.data);
    } catch (error) {
        console.error('Error response:', error.response?.data || error.message);
        console.error('Status:', error.response?.status);
    }
}

// Run the test
testRemoveAppointment();
