const fs = require('fs');
const path = require('path');
const https = require('https');

const modelsDir = path.join(__dirname, 'public', 'models');

if (!fs.existsSync(modelsDir)) {
  fs.mkdirSync(modelsDir, { recursive: true });
}

// Manually parse .env to avoid needing the dotenv package
const envConfig = fs.readFileSync(path.resolve(__dirname, '.env'), 'utf8')
  .split('\n')
  .reduce((acc, line) => {
    const [key, ...val] = line.split('=');
    if (key && val) acc[key.trim()] = val.join('=').trim();
    return acc;
  }, {});

const baseUrl = envConfig.NEXT_PUBLIC_FACE_API_MODEL_URL;

const files = [
  'tiny_face_detector_model-weights_manifest.json',
  'tiny_face_detector_model-shard1',
  'face_landmark_68_model-weights_manifest.json',
  'face_landmark_68_model-shard1',
  'face_recognition_model-weights_manifest.json',
  'face_recognition_model-shard1',
  'face_recognition_model-shard2'
];

const downloadFile = (fileName) => {
  return new Promise((resolve, reject) => {
    const dest = path.join(modelsDir, fileName);
    const file = fs.createWriteStream(dest);
    https.get(baseUrl + fileName, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
};

Promise.all(files.map(downloadFile))
  .then(() => console.log('Models downloaded successfully'))
  .catch(console.error);
