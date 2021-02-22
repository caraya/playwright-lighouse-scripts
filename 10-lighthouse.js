const playwright = require('playwright-core');
const { playAudit } = require('playwright-lighthouse');

(async () => {
  /* 
    This requires you to start chrome from the command line
    with the remote-debugging-port flag set before you run the script
    The flag looks something like this:
    /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --remote-debugging-port=9222
  */

  // Set the executable to Chrome stable
  const chrome = await playwright.chromium.launch({
    headless: true,
    args: ['--remote-debugging-port=9222'],
    // executablePath: '/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome',
  })
  // create new chrome instance
  const page = await chrome.newPage()
  // start tracing
  await chrome.startTracing(page, {path: `chrome-trace-${new Date().getTime()}.json`});
  // go to page
  await page.goto('https://publishing-project.rivendellweb.net')
  await chrome.stopTracing();

  await playAudit({
    page: page,
    port: 9222,
    thresholds: {
      performance: 50,
      accessibility: 50,
      'best-practices': 50,
      seo: 50,
      pwa: 50,
    },
    reports: {
      formats: {
        json: false, //defaults to false
        html: true, //defaults to false
        csv: false, //defaults to false
      },
      name: `lighthouse-${new Date().getTime()}`, //defaults to `lighthouse-${new Date().getTime()}`
      directory:  `${process.cwd()}/lighthouse-${new Date()}`, //defaults to `${process.cwd()}/lighthouse`
    },
  });

  await chrome.close();
})()
