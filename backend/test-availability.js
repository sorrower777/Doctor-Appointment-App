import axios from 'axios';

const testChangeAvailability = async () => {
    try {
        // First, get all doctors to get a doctor ID
        const doctorsResponse = await axios.post('http://localhost:4000/api/admin/all-doctors', {}, {
            headers: { 
                aToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGRvY2Jvb2suY29tIiwiaWF0IjoxNzM4NDY3MDMyfQ.xfqzPeBMCQO0wPfKVrEbk0DGEhh5xNKhYYdWh2h1Jy8'
            }
        });
        
        if (doctorsResponse.data.success) {
            console.log('Doctors found:', doctorsResponse.data.doctors.length);
            
            if (doctorsResponse.data.doctors.length > 0) {
                const doctorId = doctorsResponse.data.doctors[0]._id;
                console.log('Testing with doctor ID:', doctorId);
                console.log('Current availability:', doctorsResponse.data.doctors[0].available);
                
                // Test changing availability
                const changeResponse = await axios.post('http://localhost:4000/api/admin/change-availability', 
                    { doctorId }, 
                    {
                        headers: { 
                            aToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFkbWluQGRvY2Jvb2suY29tIiwiaWF0IjoxNzM4NDY3MDMyfQ.xfqzPeBMCQO0wPfKVrEbk0DGEhh5xNKhYYdWh2h1Jy8'
                        }
                    }
                );
                
                console.log('Change availability response:', changeResponse.data);
            }
        }
    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
    }
}

testChangeAvailability();
