const playwright = require("playwright-core");
(async () => {
  const browser = await playwright.chromium.launch({
    headless: false,
    executablePath: `/Applications/Microsoft\ Edge\ Canary.app/Contents/MacOS/Microsoft\ Edge\ Canary`
  })
  const page = await browser.newPage()
  await page.setContent(`<input id="foo">`)
  await page.type("#foo", "keksstar")
  console.log(await page.content())
  await page.screenshot({ path: "screenshot.png" })
  console.log(await page.evaluate(() => window.navigator.userAgent))
  // -> 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.0 Safari/537.36 Edg/85.0.563.0'
  await browser.close()
})()