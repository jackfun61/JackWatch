const express = require('express');
const fs = require('fs');
const multer = require('multer');
const app = express();

// Serve uploaded videos
app.use('/uploads', express.static('uploads'));

// Multer setup to save videos in uploads/
const upload = multer({ dest: 'uploads/' });

// Ensure videos.json exists
if (!fs.existsSync('videos.json')) fs.writeFileSync('videos.json', '[]');

// Load video list
function loadVideos() {
  return JSON.parse(fs.readFileSync('videos.json', 'utf8'));
}

// Save video list
function saveVideos(list) {
  fs.writeFileSync('videos.json', JSON.stringify(list, null, 2));
}

// Upload endpoint
app.post('/upload', upload.single('video'), (req, res) => {
  const videos = loadVideos();

  const videoInfo = {
    title: req.body.title,
    filename: req.file.filename,
    uploader: "anonymous"
  };

  videos.push(videoInfo);
  saveVideos(videos);

  res.send('Video uploaded successfully!');
});

// Get video list
app.get('/videos', (req, res) => {
  res.json(loadVideos());
});

// Start server
app.listen(3000, () => console.log('Server running on http://localhost:3000'));
