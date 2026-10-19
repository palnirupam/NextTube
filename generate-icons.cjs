const fs = require('fs');
const path = require('path');
const zlib = require('zlib');

// Minimal pure Node.js PNG encoder
function createPNG(width, height, getPixel) {
  const rowSize = width * 4 + 1;
  const rawData = Buffer.alloc(rowSize * height);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowSize;
    rawData[rowOffset] = 0; // Filter type 0 (None)

    for (let x = 0; x < width; x++) {
      const [r, g, b, a] = getPixel(x, y, width, height);
      const pxOffset = rowOffset + 1 + x * 4;
      rawData[pxOffset] = r;
      rawData[pxOffset + 1] = g;
      rawData[pxOffset + 2] = b;
      rawData[pxOffset + 3] = a;
    }
  }

  const deflated = zlib.deflateSync(rawData);

  // PNG Signature
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // color type RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // IDAT
  const idatChunk = makeChunk('IDAT', deflated);

  // IEND
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);

  const typeBuf = Buffer.from(type, 'ascii');
  const crc = crc32(Buffer.concat([typeBuf, data]));
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc, 0);

  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

// CRC32 table
const crcTable = new Uint32Array(256);
for (let n = 0; n < 256; n++) {
  let c = n;
  for (let k = 0; k < 8; k++) {
    c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
  }
  crcTable[n] = c;
}

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

// Generate PlayTube App Icon (Red rounded badge with white play triangle)
function drawPlayTubeIcon(x, y, w, h, isRound = false) {
  const nx = (x / w) * 2 - 1; // -1 to 1
  const ny = (y / h) * 2 - 1; // -1 to 1
  const dist = Math.sqrt(nx * nx + ny * ny);

  // Circular clip if round
  if (isRound && dist > 0.98) {
    return [0, 0, 0, 0];
  }

  // Rounded rectangle for card (corners radius ~ 0.28)
  const absX = Math.abs(nx);
  const absY = Math.abs(ny);
  const cardW = 0.88;
  const cardH = 0.65;
  const rad = 0.24;

  const dx = Math.max(0, absX - (cardW - rad));
  const dy = Math.max(0, absY - (cardH - rad));
  const cardDist = Math.sqrt(dx * dx + dy * dy);

  const insideCard = (absX <= cardW && absY <= cardH) && (cardDist <= rad);

  if (insideCard) {
    // Check if inside Play Triangle
    // Triangle points: (-0.18, -0.25), (-0.18, 0.25), (0.24, 0)
    const tx = nx + 0.05;
    const ty = ny;
    const inTriangle = (tx >= -0.18 && tx <= 0.22) &&
                       (Math.abs(ty) <= (0.22 - tx) * 0.62);

    if (inTriangle) {
      return [255, 255, 255, 255]; // Crisp pure white play button
    }

    // PlayTube Red Gradient with subtle glossy top
    const grad = (1 - ny) * 0.5; // 0 to 1
    const r = Math.min(255, Math.floor(229 + grad * 26)); // #E50914 to brighter red
    const g = Math.floor(10 + grad * 15);
    const b = Math.floor(20 + grad * 10);
    return [r, g, b, 255];
  }

  // Dark modern background for square icon
  if (!isRound) {
    if (dist < 0.98) {
      return [18, 18, 18, 255]; // #121212
    }
  }

  return [0, 0, 0, 0];
}

const targets = [
  { path: 'android/app/src/main/res/mipmap-mdpi/ic_launcher.png', size: 48, round: false },
  { path: 'android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png', size: 48, round: true },
  { path: 'android/app/src/main/res/mipmap-mdpi/ic_launcher_foreground.png', size: 48, round: false },

  { path: 'android/app/src/main/res/mipmap-hdpi/ic_launcher.png', size: 72, round: false },
  { path: 'android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png', size: 72, round: true },
  { path: 'android/app/src/main/res/mipmap-hdpi/ic_launcher_foreground.png', size: 72, round: false },

  { path: 'android/app/src/main/res/mipmap-xhdpi/ic_launcher.png', size: 96, round: false },
  { path: 'android/app/src/main/res/mipmap-xhdpi/ic_launcher_round.png', size: 96, round: true },
  { path: 'android/app/src/main/res/mipmap-xhdpi/ic_launcher_foreground.png', size: 96, round: false },

  { path: 'android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png', size: 144, round: false },
  { path: 'android/app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png', size: 144, round: true },
  { path: 'android/app/src/main/res/mipmap-xxhdpi/ic_launcher_foreground.png', size: 144, round: false },

  { path: 'android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png', size: 192, round: false },
  { path: 'android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png', size: 192, round: true },
  { path: 'android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_foreground.png', size: 192, round: false },

  { path: 'public/logo.png', size: 192, round: false },
  { path: 'public/favicon.png', size: 64, round: false }
];

console.log('Generating PlayTube App Icons...');
for (const t of targets) {
  const fullPath = path.resolve(__dirname, t.path);
  const dir = path.dirname(fullPath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  const buf = createPNG(t.size, t.size, (x, y, w, h) => drawPlayTubeIcon(x, y, w, h, t.round));
  fs.writeFileSync(fullPath, buf);
  console.log('Created:', t.path, `(${t.size}x${t.size})`);
}
console.log('✅ All Android launcher icons generated successfully!');
