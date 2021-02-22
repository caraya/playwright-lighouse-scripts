(async () => {
  const { chromium } = require('playwright');
  const browser = await chromium.launch({
    headless: false,
  });

  const page = await browser.newPage();
  await page.goto('https://publishing-project.rivendellweb.net/');
  const snapshot = await page.accessibility.snapshot();
  console.log(snapshot);
  await browser.close;
})();