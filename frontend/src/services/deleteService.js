// deleteService.js

const axios = require('axios');
const backendURL = 'https://conference-management.onrender.com';



async function deleteTest() {
  try {
    const response = await axios.post(backendURL + '/test/delete');
    console.log('Objects deleted successfully:', response.data);
  } catch (error) {
    console.error('Error deleting objects:', error);
  }
}
deleteTest();