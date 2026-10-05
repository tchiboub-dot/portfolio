const { chromium } = require('playwright');

const base = 'https://portfolio-flame-two-94.vercel.app';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const out = [];
  const push = (area, name, ok, detail) => out.push({ area, name, ok, detail });

  const desktop = await browser.newContext({ viewport: { width: 1366, height: 900 } });
  const d = await desktop.newPage();
  await d.goto(base, { waitUntil: 'domcontentloaded' });

  push('desktop', 'Page title', /portfolio|taha|chiboub/i.test(await d.title()), await d.title());

  const projectsBtn = d.getByRole('link', { name: /View My Projects/i });
  push('desktop', 'Hero projects button visible', await projectsBtn.isVisible().catch(() => false), 'View My Projects');
  await projectsBtn.click();
  await d.waitForTimeout(700);
  const inProjects = await d.evaluate(() => {
    const el = document.getElementById('projects');
    if (!el) return false;
    const r = el.getBoundingClientRect();
    return r.top < window.innerHeight;
  });
  push('desktop', 'Hero projects button navigates', inProjects, 'Projects section reached');

  const liveDemoLink = d.getByRole('link', { name: /View Live Demo/i }).first();
  const hrefBefore = await liveDemoLink.getAttribute('href');
  await d.getByRole('button', { name: /Next project/i }).click();
  await d.waitForTimeout(700);
  const hrefAfter = await liveDemoLink.getAttribute('href');
  push('desktop', 'Project next button changes selected project', hrefBefore !== hrefAfter, `${hrefBefore} -> ${hrefAfter}`);

  const contactLink = d.locator('aside a[aria-label="Contact"]').first();
  await contactLink.click();
  await d.waitForTimeout(700);
  const hash = await d.evaluate(() => window.location.hash || '');
  push('desktop', 'Sidebar contact button updates anchor', hash === '#contact', `hash: ${hash}`);

  await d.fill('#name', 'Buyer QA');
  await d.fill('#email', 'buyer.qa@example.com');
  await d.fill('#message', 'I would like to discuss an internship opportunity and project collaboration.');
  await d.getByRole('button', { name: /Send Message/i }).click();
  await d.waitForTimeout(1200);
  const alertText = await d.locator('[role="alert"]').first().textContent().catch(() => '');
  const success = /sent successfully|thank you/i.test(alertText || '');
  push('desktop', 'Contact form submit feedback', success, (alertText || '').trim().slice(0, 180));

  const launcher = d.locator('button.tac-assistant-launcher');
  const launcherVisible = await launcher.isVisible().catch(() => false);
  push('desktop', 'Assistant launcher visible', launcherVisible, 'floating button');
  if (launcherVisible) {
    await launcher.click();
    await d.waitForTimeout(900);
    const panelState = await d.evaluate(() => {
      const panel = document.getElementById('tac-assistant-panel');
      if (!panel) return 'not-found';
      const style = window.getComputedStyle(panel);
      const rect = panel.getBoundingClientRect();
      const displayed = style.display !== 'none' && style.visibility !== 'hidden';
      return `${displayed ? 'shown' : 'hidden'}|w:${Math.round(rect.width)}|h:${Math.round(rect.height)}`;
    });
    push('desktop', 'Assistant opens panel', panelState.startsWith('shown'), panelState);
  }

  await desktop.close();

  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const m = await mobile.newPage();
  await m.goto(base, { waitUntil: 'domcontentloaded' });

  const overflow = await m.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  push('mobile', 'No horizontal overflow', overflow <= 1, `overflow:${overflow}`);

  const heroVisible = await m.getByRole('link', { name: /View My Projects/i }).isVisible().catch(() => false);
  push('mobile', 'Hero CTA visible on mobile', heroVisible, 'View My Projects');

  const mobileNavTrigger = await m.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    return buttons.some((btn) => {
      const label = (btn.getAttribute('aria-label') || btn.title || btn.textContent || '').toLowerCase();
      return /menu|navigation|open menu|hamburger/.test(label);
    });
  });
  push('mobile', 'Mobile menu trigger exists', mobileNavTrigger, mobileNavTrigger ? 'found' : 'missing');

  await m.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await m.waitForTimeout(700);
  const backTopClickable = await m.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find((b) => /back to top/i.test((b.getAttribute('aria-label') || '').toLowerCase()));
    if (!btn) return false;
    const style = window.getComputedStyle(btn);
    return style.pointerEvents !== 'none';
  });
  push('mobile', 'Back-to-top actionable after scroll', backTopClickable, backTopClickable ? 'clickable' : 'not clickable');

  await mobile.close();
  await browser.close();

  const passed = out.filter((x) => x.ok).length;
  const failed = out.filter((x) => !x.ok).length;
  console.log('BUYER_QA_SUMMARY', JSON.stringify({ passed, failed, total: out.length }));
  for (const row of out) {
    console.log('BUYER_QA_RESULT', JSON.stringify(row));
  }
  process.exit(failed > 0 ? 2 : 0);
}

run().catch((e) => {
  console.error('BUYER_QA_FATAL', e.message);
  process.exit(3);
});
