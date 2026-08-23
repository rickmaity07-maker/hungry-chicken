const fs = require('fs');
const https = require('https');
const path = require('path');

// Ensure the public directory exists
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir);
}

// The exact images we used for the layouts
const imagesToDownload = {
  // Sweets Home Page
  'sweets-1.jpg': 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?q=80&w=800&auto=format&fit=crop',
  'sweets-2.jpg': 'https://images.unsplash.com/photo-1546173159-315724a31696?q=80&w=800&auto=format&fit=crop',
  'sweets-3.jpg': 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?q=80&w=800&auto=format&fit=crop',
  
  // Grill Home Page
  'grill-1.jpg': 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=800&auto=format&fit=crop',
  'grill-2.jpg': 'https://images.unsplash.com/photo-1569691899455-88464f6d3ab1?q=80&w=800&auto=format&fit=crop',
  'grill-3.jpg': 'https://images.unsplash.com/photo-1598514982205-f36b96d1e8d4?q=80&w=800&auto=format&fit=crop',

  // Gallery Page
  'gallery-1.jpg': 'https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=800&auto=format&fit=crop',
  'gallery-2.jpg': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=800&auto=format&fit=crop',
  'gallery-3.jpg': 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=800&auto=format&fit=crop',
  'gallery-4.jpg': 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?q=80&w=800&auto=format&fit=crop',
  'gallery-5.jpg': 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?q=80&w=800&auto=format&fit=crop',
  'gallery-6.jpg': 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?q=80&w=800&auto=format&fit=crop'
};

// Helper function to download an image
const downloadImage = (filename, url) => {
  const filePath = path.join(publicDir, filename);
  const file = fs.createWriteStream(filePath);

  https.get(url, (response) => {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log(`✅ Successfully downloaded: ${filename}`);
    });
  }).on('error', (err) => {
    fs.unlink(filePath, () => {}); // Delete the file if there's an error
    console.error(`❌ Error downloading ${filename}: ${err.message}`);
  });
};

// Execute the downloads
console.log('Starting image downloads...');
for (const [filename, url] of Object.entries(imagesToDownload)) {
  downloadImage(filename, url);
}