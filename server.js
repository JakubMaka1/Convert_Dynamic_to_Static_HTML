const express = require('express');
const puppeteer = require('puppeteer');
const path = require('path');

// Funkcja do robienia zrzutów ekranu
async function takeScreenshot(url, filePath) {
    let browser = null; // Przechowuje instancjê przegl¹darki
    try {
    browser = await puppeteer.launch({
      
headless: true, // Tryb niewidoczny
      
args: ['--start-maximized'],
      
defaultViewport: null,
    
  });
        
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle0' });
        await page.setViewport({ width: 1920, height: 1080 });
        await page.screenshot({ path: filePath });
        await new Promise((resolve) => setTimeout(resolve, 20000)); // Oczekiwanie
    } catch (error) {
        console.error(`B³¹d podczas zrzutu ekranu dla ${url}:`, error);
    } finally {
        if (browser) {
            try {
                await browser.close(); // Zamyka przegl¹darkê
            } catch (closeError) {
                console.error('B³¹d podczas zamykania przegl¹darki:', closeError);
            }
        }
    }
}

// Konfiguracja stron
const sites = [
  { port: 3000, url: 'https://uni001eu5.fusionsolar.huawei.com/pvmswebsite/nologin/assets/build/cloud.html#/kiosk?kk=9QCxQKa6Nsi5uvmBfPquvAj9v8E4ypfO', filePath: 'public/zukowo.png' },
  { port: 3001, url: 'https://uni001eu5.fusionsolar.huawei.com/pvmswebsite/nologin/assets/build/cloud.html#/kiosk?kk=Fwiwc2uL7ow3IvcaFMJyg5JMeCq03m9m', filePath: 'public/brzeg.png' },
  { port: 3002, url: 'https://uni001eu5.fusionsolar.huawei.com/pvmswebsite/nologin/assets/build/cloud.html#/kiosk?kk=9etCtruhaGHrccz9EAjEdLoIiKF6ujMG', filePath: 'public/szamotuly_odziez.png' },
  { port: 3003, url: 'https://uni001eu5.fusionsolar.huawei.com/pvmswebsite/nologin/assets/build/cloud.html#/kiosk?kk=a9cs6xGtpcdavigIar5uovxryNHDJros', filePath: 'public/tarnow.png' },
  { port: 3004, url: 'https://uni001eu5.fusionsolar.huawei.com/pvmswebsite/nologin/assets/build/cloud.html#/kiosk?kk=apiBs4IQkQNempblcuAbDH7BNv7Bdo4l', filePath: 'public/wiazowna.png' },
  { port: 3005, url: 'https://uni001eu5.fusionsolar.huawei.com/pvmswebsite/nologin/assets/build/cloud.html#/kiosk?kk=w1whM3KgIhapAkNg7JAvzO5zes29gfaq', filePath: 'public/szamotuly_maty.png' },
];

// Funkcja do wykonywania zadañ sekwencyjnie
async function processScreenshots() {
  while (true) {
    for (const site of sites) {
      console.log(`Przetwarzanie strony: ${site.url}`);
      try {
        await takeScreenshot(site.url, path.join(__dirname, site.filePath));
        console.log(`Zrzut ekranu zapisany w: ${site.filePath}`);
      } catch (err) {
        console.error(`B³¹d przy zrzucie ekranu dla ${site.url}:`, err);
      }
      console.log(`Oczekiwanie na kolejn¹ stronê...`);
      await new Promise((resolve) => setTimeout(resolve, 10000)); // Czekaj 10 sekund przed kolejn¹ stron¹
    }
    console.log('Rozpoczynanie nowego cyklu...');
    await new Promise((resolve) => setTimeout(resolve, 15 * 60 * 1000)); // Odczekaj 5 minut przed nowym cyklem
  }
}

// Startowanie serwera dla wyœwietlania obrazów
sites.forEach(({ port, filePath }) => {
  const app = express();

  // Obs³uga plików statycznych
  app.use(express.static('public'));

  // Strona g³ówna
  app.get('/', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="pl">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Strona na porcie ${port}</title>
        <style>
          body { text-align: center; }
          img { max-width: 100%; }
        </style>
      </head>
      <body>
        <img src="/${path.basename(filePath)}" alt="Zrzut ekranu strony">
      </body>
      </html>
    `);
  });

  // Uruchomienie serwera
  app.listen(port, () => {
    console.log(`Serwer dla ${filePath} dzia³a na http://localhost:${port}`);
  });
});

// Rozpoczêcie procesu robienia zrzutów
processScreenshots();
