import puppeteer from 'puppeteer'
import fs from 'fs'
import { generateSHA1, uploadToVercel } from '../saveToBlob'

export class PuppeteerService {
  async generatePdfAndScreenshot(url: string) {
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()

    try {
      await page.goto(url)

      // await page.setViewport({ width: 1280, height: 3000 });
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
          return { width: 0, height: 0 }
        }
      })

      console.log(dimensions)

      const pdfBuffer = await page.pdf({
        height: `${dimensions.height}px`,
        width: `${dimensions.width}px`,
        printBackground: true
      })

      // fs.writeFileSync('./resume.pdf', pdf)

      const pdfBase64 = pdfBuffer.toString('base64')

      const screenshotBuffer: Buffer = await page.screenshot({
        clip: {
          x: 0,
          y: 0,
          width: dimensions.width,
          height: dimensions.height
        }
      })

      // fs.writeFileSync('./resume.png', screenshotBuffer)
      const screenshotBase64 = screenshotBuffer.toString('base64')

      await browser.close()

      return { pdfBase64, screenshotBase64 }
    } catch (error) {
      console.error('An error occurred:', error)
    } finally {
      await browser.close()
    }
  }
}
