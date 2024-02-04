import puppeteer, { Browser, Page } from 'puppeteer'

export class PuppeteerService {
  async setupBrowserPage() {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true
    })
    const page = await browser.newPage()

    return { browser, page }
  }

  async createPdfAndScreenshot(
    url: string,
    page: Page,
    dimensions: {
      width: number
      height: number
    },
    browser: Browser
  ) {
    try {
      await page.goto(url)

      const pdfBuffer = await page.pdf({
        height: `${dimensions.height}px`,
        width: `${dimensions.width}px`,
        printBackground: true
      })

      const pdfBase64 = pdfBuffer.toString('base64')

      const screenshotBuffer = await page.screenshot({
        clip: {
          x: 0,
          y: 0,
          width: dimensions.width,
          height: dimensions.height
        }
      })

      const screenshotBase64 = screenshotBuffer.toString('base64')

      return { pdfBase64, screenshotBase64 }
    } finally {
      await browser.close()
    }
  }

  // We are targeting the main tag with the container class, so different methods are required for health-check and resume screenshot.
  async generatePdfAndScreenshot(url: string) {
    const { browser, page } = await this.setupBrowserPage()

    await page.goto(url)

    try {
      await page.setViewport({ width: 1024, height: 3000 })

      await page.evaluate(() => {
        const mainElement = document.querySelector('main.container')
        if (mainElement) {
          mainElement.classList.add('max-w-full')
        }
      })

      await page.waitForFunction(() => {
        const mainElement = document.querySelector('main.container')
        return mainElement && mainElement.classList.contains('max-w-full')
      })

      const dimensions = await page.evaluate(() => {
        const mainElement = document.querySelector('main.container') as HTMLElement
        if (mainElement) {
          return {
            width: Number(mainElement.offsetWidth),
            height: Number(mainElement.offsetHeight)
          }
        } else {
          return { width: 1024, height: 3000 }
        }
      })

      return await this.createPdfAndScreenshot(url, page, dimensions, browser)
    } catch (error) {
      console.error('An error occurred:', error)
    } finally {
      await browser.close()
    }
  }

  async healthCheck(url: string) {
    const { browser, page } = await this.setupBrowserPage()

    try {
      const dimensions = { width: 1024, height: 3000 }

      return await this.createPdfAndScreenshot(url, page, dimensions, browser)
    } catch (error) {
      console.error('An error occurred during health check:', error)
    } finally {
      await browser.close()
    }
  }
}
