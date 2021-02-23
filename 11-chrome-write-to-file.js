const playwright = require('playwright-core');
const { playAudit } = require('playwright-lighthouse');

(async () => {

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
      directory:  `${process.cwd()}/lighthouse-${new Date().getDate()}`, //defaults to `${process.cwd()}/lighthouse`
    },
  });

  let performanceTimingJson = await page.evaluate(() => JSON.stringify(window.performance.timing))
  let pt = JSON.parse(performanceTimingJson)

  let startToInteractive = pt.domInteractive - pt.navigationStart
  let domContentLoadedComplete = pt.domContentLoadedEventEnd - pt.navigationStart
  let startToComplete = pt.domComplete - pt.navigationStart

  let firstPaint = JSON.parse(
    await page.evaluate(() =>
      JSON.stringify(performance.getEntriesByName('first-paint'))
    )
  );

  let firstContentfulPaint = JSON.parse(
    await page.evaluate(() =>
      JSON.stringify(performance.getEntriesByName('first-contentful-paint'))
    )
  );
  

  // console.log(pt);

  // console.log(`Navigation start to DOM Interactive: ${startToInteractive}ms`)
  // console.log(`Navigation start to DOM ContentLoaded ${domContentLoadedComplete}ms`)
  // console.log(`Navigation start to DOM Complete:  ${startToComplete}ms`)

  // console.log(`First paint: ${firstPaint[0].startTime}`);
  // console.log(`First contentful paint: ${firstContentfulPaint[0].startTime}`);
  
  const data = [
    pt,
    "Navigation start to DOM Interactive: " + startToInteractive + "ms",
    "Navigation start to DOM ContentLoaded " + domContentLoadedComplete + "ms",
    "Navigation start to DOM Complete:  " + startToComplete + "ms",
    
    "First paint: " + firstPaint[0].startTime,
    "First contentful paint: " + firstContentfulPaint[0].startTime,
  ]

  dataToAppend = JSON.stringify(data);

  fs.appendFile('chrome-performance.txt', dataToAppend, function (err) {
    if (err) {
      throw err;
    } else {
      console.log('Saved!');
    }
  });


  await chrome.close();
})()
