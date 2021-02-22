(async () => {
  const { firefox } = require('playwright');
  const browser = await firefox.launch({
    headless: false,
    slowMo: 2000,
  });
  
  const page = await browser.newPage();
  await page.goto('https://publishing-project.rivendellweb.net');
  await page.click('article header h2 a');
  await page.screenshot({ path: `example-nav.png` });
  await browser.close();
})();
