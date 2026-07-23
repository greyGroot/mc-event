const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

function createSolidPng(width, height, r, g, b, a, filename) {
  const png = new PNG({ width, height });
  for (let y = 0; y < png.height; y++) {
    for (let x = 0; x < png.width; x++) {
      const idx = (png.width * y + x) << 2;
      png.data[idx] = r;
      png.data[idx + 1] = g;
      png.data[idx + 2] = b;
      png.data[idx + 3] = a;
    }
  }
  const buffer = PNG.sync.write(png);
  fs.writeFileSync(path.join(__dirname, '..', 'public', filename), buffer);
  console.log(`Created ${filename}`);
}

createSolidPng(100, 100, 255, 95, 0, 255, 'icon.png');
createSolidPng(200, 50, 255, 95, 0, 255, 'logo.png');
