const axios = require('axios');
(async () => {
  try {
    const login = await axios.post('http://localhost:3000/api/user/loginuser', {
      email: 'admin@local.test',
      password: 'Admin123!'
    });
    console.log('login', login.data);
    const token = login.data.token;
    const job = await axios.post('http://localhost:3000/api/jobs', {
      title: 'Test Job',
      description: 'Desc',
      location: 'Nowhere',
      jobType: 'full-time'
    }, { headers: { Authorization: `Bearer ${token}` } });
    console.log('created', job.data);
  } catch (e) {
    if (e.response) console.error('resp', e.response.status, e.response.data);
    else console.error(e.message);
  }
})();
