// Simple test to verify cancel appointment API
import axios from 'axios';

const backendUrl = 'http://localhost:4000';

// Test function with sample data
async function testCancelAppointment() {
    try {
        // Test without token first
        console.log('Testing cancel appointment without token...');
        const response1 = await axios.post(backendUrl + '/api/user/cancel-appointment', {
            appointmentId: '68a179d2f634604d7c4da6bb'
        });
        console.log('Response without token:', response1.data);
    } catch (error) {
        console.log('Error without token:');
        console.log('Status:', error.response?.status);
        console.log('Data:', error.response?.data);
    }

    try {
        // Test with empty headers (should show proper auth error)
        console.log('\nTesting cancel appointment with empty headers...');
        const response2 = await axios.post(backendUrl + '/api/user/cancel-appointment', {
            appointmentId: '68a179d2f634604d7c4da6bb'
        }, {
            headers: {}
        });
        console.log('Response with empty headers:', response2.data);
    } catch (error) {
        console.log('Error with empty headers:');
        console.log('Status:', error.response?.status);
        console.log('Data:', error.response?.data);
    }

    try {
        // Test with fake token
        console.log('\nTesting cancel appointment with fake token...');
        const response3 = await axios.post(backendUrl + '/api/user/cancel-appointment', {
            appointmentId: '68a179d2f634604d7c4da6bb'
        }, {
            headers: { token: 'fake.token.here' }
        });
        console.log('Response with fake token:', response3.data);
    } catch (error) {
        console.log('Error with fake token:');
        console.log('Status:', error.response?.status);
        console.log('Data:', error.response?.data);
    }
}

testCancelAppointment();
