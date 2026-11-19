import assert from 'node:assert/strict';
import { mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { chromium } from 'playwright';

const url = process.env.MODA_URL ?? 'http://127.0.0.1:5173/';
const evidence = process.env.MODA_QA_DIR;
if (evidence) await mkdir(evidence, { recursive: true });

const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
});

function pins(page) {
  return page.evaluate(() => window.ScrollTrigger.getAll()
    .filter(trigger => trigger.pin)
    .map(({ pin, start, end }) => ({ id: pin.id, start, end })));
}

function seek(page, y) {
  return page.evaluate(top => window.scrollTo({ top, behavior: 'instant' }), Math.round(y));
}

function waitForFrame(page, expected) {
  return page.waitForFunction(frame => Number(document.querySelector('#hero canvas').dataset.frame) === frame, expected);
}

function headerState(page, visible) {
  return page.waitForFunction(visible => {
    const header = document.querySelector('header');
    const style = getComputedStyle(header);
    return visible ? !header.inert && Number(style.opacity) === 1 : header.inert && Number(style.opacity) === 0;
  }, visible);
}

async function capture(page, name) {
  if (evidence) await page.screenshot({ path: join(evidence, name + '.png') });
}

try {
  for (const [width, height] of [[1920, 1080], [1366, 768], [768, 1024], [390, 844], [375, 667]]) {
    const label = `${width}x${height}`;
    const page = await browser.newPage({ viewport: { width, height }, isMobile: width < 768, hasTouch: width < 768 });
    const errors = [];
    const failures = [];
    const frameSets = new Set();
    page.on('pageerror', error => errors.push(error.message));
    page.on('response', response => {
      if (response.status() >= 400 && new URL(response.url()).origin === new URL(url).origin) failures.push(response.url());
      const variant = response.url().match(/frames_(desktop|mobile)\/frame_.*\.webp$/);
      if (variant) frameSets.add(variant[1]);
    });

    await page.goto(url);
    await waitForFrame(page, 1);
    assert.deepEqual([...frameSets], ['desktop']);
    const [hero, craft] = await pins(page);
    assert.equal(hero.id, 'hero');
    assert.equal(craft?.id, width >= 1024 ? 'craft' : undefined);
    await headerState(page, false);
    const title = page.locator('#hero h1');
    assert.equal(await title.isVisible(), false);
    await capture(page, label + '-top');

    if (width >= 1024) {
      await page.mouse.move(width / 2, height / 2);
      await page.mouse.wheel(0, 420);
      await page.waitForFunction(() => Number(document.querySelector('#hero canvas').dataset.frame) > 5);
    } else if (width < 768) {
      const session = await page.context().newCDPSession(page);
      const x = Math.round(width / 2);
      await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y: height - 110 }] });
      for (const offset of [40, 100, 180, 260]) {
        await session.send('Input.dispatchTouchEvent', {
          type: 'touchMove', touchPoints: [{ x, y: height - 110 - offset }],
        });
        await page.waitForTimeout(65);
      }
      await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
      await page.waitForFunction(() => Number(document.querySelector('#hero canvas').dataset.frame) > 5);
      await page.evaluate(() => new Promise(resolve => {
        let previousY = window.scrollY;
        let lastMotion = performance.now();
        const check = now => {
          if (window.scrollY !== previousY) {
            previousY = window.scrollY;
            lastMotion = now;
          }
          if (now - lastMotion >= 120) resolve();
          else requestAnimationFrame(check);
        };
        requestAnimationFrame(check);
      }));
    }

    for (const [progress, expected] of [[0.25, 43], [0.75, 128], [0.92, 133], [0.25, 43]]) {
      await seek(page, hero.end * progress);
      await waitForFrame(page, expected);
      assert.ok(Math.abs((await page.locator('#hero').boundingBox()).y) <= 1);
      await headerState(page, false);
      assert.equal(await title.isVisible(), progress === 0.92);
      if (progress === 0.92) {
        const opacity = await page.locator('#hero h1').evaluate(el => Number(getComputedStyle(el.parentElement).opacity));
        assert.equal(opacity, 1);
      }
      await capture(page, label + '-hero-' + progress);
    }

    await seek(page, hero.end + 12);
    await headerState(page, true);
    assert.equal(await title.isVisible(), false);
    assert.ok(Math.abs((await page.locator('#hero-sentinel').boundingBox()).y - height + 12) <= 2);
    await capture(page, label + '-transition');

    if (craft) {
      for (const index of [0, 1, 2, 1, 0]) {
        const progress = [0.1, 0.5, 0.9][index];
        await seek(page, craft.start + progress * (craft.end - craft.start));
        const chapter = page.locator('[data-chapter]').nth(index);
        await page.waitForFunction(i => document.querySelectorAll('.methodology-controls button')[i].getAttribute('aria-current') === 'step', index);
        assert.ok(await chapter.evaluate(el => {
          const box = el.getBoundingClientRect();
          const viewport = el.parentElement.parentElement.getBoundingClientRect();
          return Math.abs(box.left - viewport.left) <= 2 && box.bottom <= innerHeight && el.querySelector('img').naturalWidth > 0;
        }));
        await capture(page, label + '-chapter-' + (index + 1));
      }
      await page.locator('.methodology-controls button').nth(2).click();
      await page.waitForFunction(() => document.querySelectorAll('.methodology-controls button')[2].getAttribute('aria-current') === 'step');
    } else {
      const chapters = await page.locator('[data-chapter]').evaluateAll(items => items.map(el => el.getBoundingClientRect().top));
      assert.equal(chapters.length, 3);
      assert.ok(chapters[0] < chapters[1] && chapters[1] < chapters[2]);
    }

    const sections = await page.locator('main > section[id]:not(#hero, #craft)').evaluateAll(items => items.map(el => el.id));
    for (const id of sections) {
      const heading = page.locator(`section[id="${id}"]`).getByRole('heading', { level: 2 }).first();
      await page.locator(`section[id="${id}"]`).evaluate(el => window.scrollTo(0, window.scrollY + el.getBoundingClientRect().top - 90));
      await heading.waitFor({ state: 'visible' });
      await page.waitForFunction(id => {
        const element = document.getElementById(id);
        const title = element.querySelector('h2');
        return title && title.getBoundingClientRect().top < innerHeight &&
          [...(function* () { for (let el = title; el && el !== element; el = el.parentElement) yield el; })()]
            .every(el => Number(getComputedStyle(el).opacity) > 0.5);
      }, id);
    }
    await seek(page, await page.evaluate(() => document.documentElement.scrollHeight));
    const footer = page.locator('footer');
    assert.ok(await footer.evaluate(el => el.getBoundingClientRect().top < innerHeight && el.getBoundingClientRect().bottom > 0));
    assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth));
    await capture(page, label + '-footer');

    if (width === 1366) {
      await page.locator('footer a[href="#top"]').click();
    } else {
      await seek(page, 0);
    }
    await waitForFrame(page, 1);
    await headerState(page, false);
    if (width === 1366) {
      await seek(page, hero.end * 0.25);
      await waitForFrame(page, 43);
      await page.reload();
      await waitForFrame(page, 43);
      await page.setViewportSize({ width: 390, height: 844 });
      await page.waitForFunction(() => window.ScrollTrigger.getAll().filter(trigger => trigger.pin).length === 1);
      await waitForFrame(page, 43);
      await page.setViewportSize({ width: 844, height: 390 });
      await page.waitForFunction(() => window.ScrollTrigger.getAll().filter(trigger => trigger.pin).length === 1);
      assert.equal((await pins(page))[0].id, 'hero');
      await waitForFrame(page, 43);
      await seek(page, 0);
      await waitForFrame(page, 1);
    }

    assert.deepEqual(errors, []);
    assert.deepEqual(failures, []);
    console.log(`${label}: hero, header, methodology, sections and footer passed`);
    await page.close();
  }

  const reduced = await browser.newPage({ viewport: { width: 1366, height: 768 }, reducedMotion: 'reduce' });
  await reduced.goto(url);
  await waitForFrame(reduced, 1);
  assert.deepEqual(await pins(reduced), []);
  await headerState(reduced, false);
  await seek(reduced, 800);
  await headerState(reduced, true);
  await capture(reduced, 'reduced-motion');
  await reduced.close();

  const fallback = await browser.newPage();
  await fallback.route('**/frames_desktop/*.webp', route => route.abort());
  await fallback.goto(url);
  assert.ok(await fallback.locator('#hero img').evaluate(img => img.complete && img.naturalWidth > 0));
  assert.equal(await fallback.locator('#hero canvas').isVisible(), false);
  const [hero] = await pins(fallback);
  await seek(fallback, hero.end + 12);
  await headerState(fallback, true);
  await fallback.close();
  console.log('Reduced motion and unavailable WebP frames passed');
} finally {
  await browser.close();
}
