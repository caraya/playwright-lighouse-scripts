const {
  chromium,
  firefox,
  webkit,
} = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://whatsmyuseragent.org/');
  await page.screenshot({ path: `example-chromium.png` });
  await browser.close();

  const browser2 = await firefox.launch();
  const page2 = await browser2.newPage();
  await page2.goto('http://whatsmyuseragent.org/');
  await page2.screenshot({ path: `example-firefox.png` });
  await browser2.close();

  const browser3= await webkit.launch();
  const page3 = await browser3.newPage();
  await page3.goto('http://whatsmyuseragent.org/');
  await page3.screenshot({ path: `example-webkit.png` });
  await browser3.close();
})();