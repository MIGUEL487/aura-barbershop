import sharp from 'sharp';

async function run() {
  const meta = await sharp('public/moda_barbershop_hero/frames_desktop/frame_0001.webp').metadata();
  console.log('Desktop meta:', meta.width, meta.height);
  const { data, info } = await sharp('public/moda_barbershop_hero/frames_desktop/frame_0001.webp').raw().toBuffer({ resolveWithObject: true });
  console.log('Channels:', info.channels);
  console.log('Top-left RGB:', data[0], data[1], data[2]);
  const tr = (10 * info.width + (info.width - 10)) * info.channels;
  console.log('Top-right RGB:', data[tr], data[tr+1], data[tr+2]);
  const bl = ((info.height - 10) * info.width + 10) * info.channels;
  console.log('Bottom-left RGB:', data[bl], data[bl+1], data[bl+2]);
  const hex = '#' + [data[0], data[1], data[2]].map(x => x.toString(16).padStart(2, '0')).join('');
  console.log('Hex:', hex);
}
run().catch(console.error);
