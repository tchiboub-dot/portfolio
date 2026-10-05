const base = 'https://portfolio-flame-two-94.vercel.app';

async function run() {
  const htmlRes = await fetch(base + '/');
  const html = await htmlRes.text();
  const regex = /href=\"([^\"]+)\"/g;
  const hrefs = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    hrefs.push(match[1]);
  }

  const internalSet = new Set();
  for (const h of hrefs) {
    if (h.startsWith('/') && !h.startsWith('//') && !h.startsWith('/_next') && !h.startsWith('/api/')) {
      internalSet.add(h);
    }
  }

  const targets = ['/', '/about', '/projects', '/contact'];
  for (const p of internalSet) {
    if (!targets.includes(p)) targets.push(p);
  }

  for (const p of targets) {
    try {
      const r = await fetch(base + p, { redirect: 'follow' });
      console.log(p + ' => ' + r.status);
    } catch (e) {
      console.log(p + ' => ERROR ' + e.message);
    }
  }
}

run().catch((e) => {
  console.error('crawl failed:', e.message);
  process.exit(1);
});
