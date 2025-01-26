const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = process.env.PORT || 3000;

// Enable CORS for all routes
app.use(cors());

// Route to fetch blog content
app.get('/fetch-blog', async (req, res) => {
  try {
    const blogUrl = 'https://confessionsofanoriginal.blogspot.com/feeds/posts/default';
    const response = await axios.get(blogUrl);
    res.type('application/xml');
    res.send(response.data);
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ error: 'Failed to fetch blog content' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});