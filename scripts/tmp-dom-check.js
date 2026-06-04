const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/beginner/articles/declarer/drawing-trumps-simple-habit-saves', { waitUntil: 'networkidle2', timeout: 60000 });
  const result = await page.evaluate(() => {
    const root = document.querySelector('.DisplayArticle-content');
    const red = Array.from(document.querySelectorAll('.DisplayArticle-content span.red-suit'));
    const sample = red.slice(0,10).map(el => ({text: el.textContent, style: el.getAttribute('style'), color:getComputedStyle(el).color, outer:el.outerHTML}));
    return {
      hasRoot: !!root,
      redCount: red.length,
      contentStart: root ? root.innerText.slice(0,500) : null,
      htmlStart: root ? root.innerHTML.slice(0,1200) : null,
      sample,
    };
  });
  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})();
