(async () => {
  const { chromium, devices } = require('playwright');
  const browser = await chromium.launch();
  
  const pixel2 = devices['Pixel 2'];
  const context = await browser.newContext({
    ...pixel2,
  });
  
  const page = await context.newPage();
  await page.goto('http://whatsmyuseragent.org/');
  await page.screenshot({ path: `example-device-emu.png` });
  await browser.close();
})()