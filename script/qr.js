const qrcode = require('qrcode');

async function generateQrcode(str, qrcodePath) {
  await qrcode.toFile(qrcodePath, str, {margin: 2});
}

const args = process.argv.splice(2);

generateQrcode(args[0], args[1]);
