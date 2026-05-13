import { chromium } from 'playwright';

const URL = 'http://localhost:3000';

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('1. Loading page...');
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500); // let boot animation finish

  // Screenshot: initial state (header visible)
  await page.screenshot({ path: 'test-01-hero.png', fullPage: false });
  console.log('   Screenshot: test-01-hero.png');

  // Check header exists and brand text is visible
  const header = page.locator('header[aria-label="AutoMage 主导航"]');
  const headerBox = await header.boundingBox();
  console.log(`   Header box: x=${headerBox?.x}, y=${headerBox?.y}, w=${headerBox?.width}, h=${headerBox?.height}`);

  // Check AutoMage brand text
  const brandText = page.locator('header a span:has-text("AutoMage")').first();
  const brandVisible = await brandText.isVisible();
  console.log(`   AutoMage brand visible: ${brandVisible}`);

  console.log('\n2. Scrolling to InfoLoop section...');
  await page.evaluate(() => {
    document.getElementById('section-loop')?.scrollIntoView({ behavior: 'instant' });
  });
  await page.waitForTimeout(1000);

  // Screenshot: loop section before pinning
  await page.screenshot({ path: 'test-02-loop-enter.png', fullPage: false });
  console.log('   Screenshot: test-02-loop-enter.png');

  console.log('\n3. Scrolling slowly through loop section to trigger pin + particle...');
  // Scroll in steps to trigger scrub
  for (let i = 0; i < 20; i++) {
    await page.mouse.wheel(0, 150);
    await page.waitForTimeout(100);
  }
  await page.waitForTimeout(500);

  // Screenshot: mid-animation (particle should be moving)
  await page.screenshot({ path: 'test-03-loop-mid.png', fullPage: false });
  console.log('   Screenshot: test-03-loop-mid.png');

  // Check particle position — should be within the SVG's circular path area
  const particleInfo = await page.evaluate(() => {
    const svg = document.querySelector('#section-loop svg');
    if (!svg) return { error: 'no SVG found' };
    const particle = svg.querySelector('circle[fill*="particle"]') ||
                     // fallback: the first circle with no stroke
                     Array.from(svg.querySelectorAll('circle')).find(c => {
                       const fill = c.getAttribute('fill') || '';
                       return fill.includes('particle') || fill.includes('38BDF8');
                     });
    if (!particle) return { error: 'no particle circle found' };

    const cx = parseFloat(particle.getAttribute('cx') || '0');
    const cy = parseFloat(particle.getAttribute('cy') || '0');
    const opacity = parseFloat(particle.getAttribute('opacity') || '0');

    // Check if position is within reasonable range of the circular path
    // CENTER=220, RADIUS=180, so cx should be ~40-400, cy ~40-400
    const inBounds = cx >= 20 && cx <= 420 && cy >= 20 && cy <= 420;

    return { cx, cy, opacity, inBounds };
  });
  console.log(`   Particle state:`, JSON.stringify(particleInfo));

  // Scroll more
  for (let i = 0; i < 20; i++) {
    await page.mouse.wheel(0, 150);
    await page.waitForTimeout(100);
  }
  await page.waitForTimeout(500);

  // Check particle moved
  const particleInfo2 = await page.evaluate(() => {
    const svg = document.querySelector('#section-loop svg');
    if (!svg) return { error: 'no SVG found' };
    const particle = Array.from(svg.querySelectorAll('circle')).find(c => {
      const fill = c.getAttribute('fill') || '';
      return fill.includes('particle') || fill.includes('38BDF8');
    });
    if (!particle) return { error: 'no particle circle found' };
    const cx = parseFloat(particle.getAttribute('cx') || '0');
    const cy = parseFloat(particle.getAttribute('cy') || '0');
    return { cx, cy };
  });
  console.log(`   Particle after more scroll:`, JSON.stringify(particleInfo2));

  if (!particleInfo.error && !particleInfo2.error) {
    const moved = particleInfo.cx !== particleInfo2.cx || particleInfo.cy !== particleInfo2.cy;
    console.log(`   Particle moved: ${moved}`);
  }

  // Screenshot: later in animation
  await page.screenshot({ path: 'test-04-loop-later.png', fullPage: false });
  console.log('   Screenshot: test-04-loop-later.png');

  console.log('\n4. Checking header dark mode transition...');
  // Scroll to footer
  await page.evaluate(() => {
    window.scrollTo(0, document.documentElement.scrollHeight - window.innerHeight);
  });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'test-05-footer.png', fullPage: false });
  console.log('   Screenshot: test-05-footer.png');

  await browser.close();
  console.log('\nDone.');
}

main().catch(console.error);
