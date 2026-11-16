import sharp from 'sharp';

async function run() {
  const f1 = await sharp('public/assets/hero/set_b_barber-at-work.webp').metadata();
  console.log('Consultation (Understand):', f1.width, f1.height, f1.format);
  const f2 = await sharp('public/assets/process/set_a_precision-fade.webp').metadata();
  console.log('Execution (Execute):', f2.width, f2.height, f2.format);
  const f3 = await sharp('public/assets/process/set_a_hot-towel.webp').metadata();
  console.log('Refine (Refine):', f3.width, f3.height, f3.format);
}
run();
