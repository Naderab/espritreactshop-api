const imagemin = require('imagemin');
const imageminPngquant = require('imagemin-pngquant');
const imageminmozjpeg = require('imagemin-mozjpeg');
const imageminwebp = require('imagemin-webp');

export async function optimizeImage(imagePath, smallFile = false) {
  let qualityPng = [0.2, 0.3];
  let qualityJpg = 20;
  if (smallFile) {
    qualityPng = [0.6, 0.7];
    qualityJpg = 70;
  }
  const images = await imagemin([imagePath], {
    destination: 'uploads',
    plugins: [
      imageminPngquant({
        quality: qualityPng
      }),
      imageminmozjpeg({
        quality: qualityJpg
      })
    ]
  });
  await imagemin([imagePath], {
    destination: 'uploads',
    plugins: [
      imageminwebp({
        quality: 100,
        sns: 100
      })
    ]
  });
  return images;
}
