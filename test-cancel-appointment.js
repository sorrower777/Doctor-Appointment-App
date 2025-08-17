import axios from 'axios';

// Test the cancel appointment endpoint
async function testCancelAppointment() {
    try {
        // First, let's test without authentication to see the error
        console.log('Testing cancel appointment endpoint...');
        
        const response = await axios.post('http://localhost:4000/api/user/cancel-appointment', {
            appointmentId: '68a179d2f634604d7c4da6bb'
        });
        
        console.log('Response:', response.data);
    } catch (error) {
        console.log('Error details:');
        console.log('Status:', error.response?.status);
        console.log('Status Text:', error.response?.statusText);
        console.log('Data:', error.response?.data);
        console.log('Headers:', error.response?.headers);
    }
}

testCancelAppointment();
