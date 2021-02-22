const playwright = require("playwright-core");
const fs = require('fs');


/*
  The current idea is to run Brave, Edge, Chrome, Firefox and WebKit 
  against identical tests and functionality to evaluate if there is a 
  significant (3x) performance gap as Brave claims on their website.

  I believe there is a difference but not a significant one.

  This is still in the early stages of design and will certainly need
  a lot of love before I'm comfortable releasing it to the world.
*/
(async () => {

  // TESTING WITH BRAVE NIGHTLY

  // Set the executable to Brave nightly
  // This is not guaranteed to work but it appears to be
  const brave = await playwright.chromium.launch({
    headless: false,
    executablePath: `/Applications/Brave\ Browser\ Nightly.app/Contents/MacOS/Brave\ Browser\ Nightly`
  })
  // create new brave instance
  var page = await brave.newPage()
  // go to page
  await page.goto('https://danube-webshop.herokuapp.com')

  var performanceTimingJson = await page.evaluate(() => JSON.stringify(window.performance.timing))
  var pt = JSON.parse(performanceTimingJson)

  console.log(pt)

  var startToInteractive = pt.domInteractive - pt.navigationStart
  var domContentLoadedComplete = pt.domContentLoadedEventEnd - pt.navigationStart
  var startToComplete = pt.domComplete - pt.navigationStart

  console.log(`Navigation start to DOM Interactive: ${startToInteractive}ms`)
  console.log(`Navigation start to DOM ContentLoaded ${domContentLoadedComplete}ms`)
  console.log(`Navigation start to DOM Complete:  ${startToComplete}ms`)

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

  console.log(`First paint: ${firstPaint[0].startTime}`);
  console.log(`First paint: ${firstContentfulPaint[0].startTime}`);

  var localData = [
    pt,
    `Navigation start to DOM interactive: ${startToInteractive}ms`,
  ]

  var data = JSON.stringify(localData)

  // append data to file
  fs.appendFile('sample.txt',data, 'utf8',
    // callback function
    function(err) {     
      if (err) {
        throw err;
      } else {
      // if no error
      console.log("Data is appended to file successfully.")
      }
    }
  );
  await brave.close()

  // TESTING WITH EDGE CANARY
  const edge = await playwright.chromium.launch({
    headless: false,
    executablePath: `/Applications/Microsoft\ Edge\ Canary.app/Contents/MacOS/Microsoft\ Edge\ Canary`
  })

  // create new edge instance
  var page = await edge.newPage()
  // go to page
  await page.goto('https://danube-webshop.herokuapp.com')


  var performanceTimingJson = await page.evaluate(() => JSON.stringify(window.performance.timing))
  var pt = JSON.parse(performanceTimingJson)

  console.log(pt)

  var startToInteractive = pt.domInteractive - pt.navigationStart
  console.log(`Navigation start to DOM interactive: ${startToInteractive}ms`)

  await edge.close()

  // TESTING WITH CHROME CANARY

  // Set the executable to Chrome canary
  const chrome = await playwright.chromium.launch({
    headless: false,
    executablePath: `/Applications/Google\ Chrome\ Canary.app/Contents/MacOS/Google\ Chrome\ Canary`
  })
  // create new chrome instance
  var page = await chrome.newPage()
  // go to page
  await page.goto('https://danube-webshop.herokuapp.com')


  var performanceTimingJson = await page.evaluate(() => JSON.stringify(window.performance.timing))
  var pt = JSON.parse(performanceTimingJson)

  console.log(pt)

  var startToInteractive = pt.domInteractive - pt.navigationStart
  var domContentLoadedComplete = pt.domContentLoadedEventEnd - pt.navigationStart
  var startToComplete = pt.domComplete - pt.navigationStart

  console.log(`Navigation start to DOM Interactive: ${startToInteractive}ms`)
  console.log(`Navigation start to DOM ContentLoaded ${domContentLoadedComplete}ms`)
  console.log(`Navigation start to DOM Complete:  ${startToComplete}ms`)

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

  console.log(`First paint: ${firstPaint[0].startTime}`);
  console.log(`First contentful paint: ${firstContentfulPaint[0].startTime}`);


  await chrome.close();

  // TESTING WITH FIREFOX NIGHTLY
  const firefox = await playwright.firefox.launch({
    headless: false,
  })
  // create new firefox instance
  var page = await firefox.newPage()
  // go to page
  await page.goto('https://danube-webshop.herokuapp.com')
  
  
  var performanceTimingJson = await page.evaluate(() => JSON.stringify(window.performance.timing))
  var pt = JSON.parse(performanceTimingJson)
  
  console.log(pt)
  
  var startToInteractive = pt.domInteractive - pt.navigationStart
  console.log(`Navigation start to DOM interactive: ${startToInteractive}ms`)
  
  await firefox.close()

  // TESTING WITH WEBKIT
  const webkit = await playwright.webkit.launch({
    headless: false,
  })
  // create new webkit instance
  var page = await webkit.newPage()
  // go to page
  await page.goto('https://danube-webshop.herokuapp.com')
  
  
  var performanceTimingJson = await page.evaluate(() => JSON.stringify(window.performance.timing))
  var pt = JSON.parse(performanceTimingJson)
  
  console.log(pt)
  
  var startToInteractive = pt.domInteractive - pt.navigationStart
  console.log(`Navigation start to DOM interactive: ${startToInteractive}ms`)
  
  await webkit.close()
})()

