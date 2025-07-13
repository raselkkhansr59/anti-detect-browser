const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs-extra');
const path = require('path');

puppeteer.use(StealthPlugin());

async function launch(profileName) {
  const profilePath = path.join(__dirname, 'profiles', `${profileName}.json`);
  const profile = await fs.readJson(profilePath);

  const browser = await puppeteer.launch({
    headless: false,
    args: [`--proxy-server=${profile.proxy}`],
    defaultViewport: profile.viewport
  });

  const page = await browser.newPage();
  await page.setUserAgent(profile.userAgent);

  // Spoof timezone and canvas
  await page.evaluateOnNewDocument((tz) => {
    Object.defineProperty(Intl.DateTimeFormat.prototype, 'resolvedOptions', {
      value: () => ({ timeZone: tz })
    });
  }, profile.timezone);

  await page.evaluateOnNewDocument(() => {
    const toDataURL = HTMLCanvasElement.prototype.toDataURL;
    HTMLCanvasElement.prototype.toDataURL = function () {
      return toDataURL.apply(this, arguments).replace("AAAA", "ZZZZ");
    };
  });

  await page.goto('https://browserleaks.com/');
}

module.exports = launch;
