const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3001/proposta.html?d=eyJwcm9qZWN0VGl0bGUiOiAiVGVzdGUgZGUgUHJvcG9zdGEiLCAiY29tcGFueSI6ICJDbGllbnRlIFRlc3RlIiwgInByaWNlIjogIjEwMDAwIiwgInNjb3BlIjogIldlYnNpdGUifQ==', { waitUntil: 'networkidle2' });
  await page.setViewport({ width: 1280, height: 1024 });
  await page.screenshot({ path: 'screenshot.png', fullPage: true });
  await browser.close();
})();
