import { Request, Response } from 'express'
import { PuppeteerService } from '../services/puppeeter'

export class PuppeteerController {
  private readonly puppeteerService: PuppeteerService

  constructor() {
    this.puppeteerService = new PuppeteerService()
  }

  async generatePdfAndScreenshot(req: Request, res: Response): Promise<void> {
    const url: string = req.body.url

    try {
      const resumes = await this.puppeteerService.generatePdfAndScreenshot(url)
      res.status(201).json({ status: true, pdfBase64: resumes?.pdfBase64, pngBase64: resumes?.screenshotBase64 })
    } catch (error) {
      console.error('An error occurred:', error)
      res.status(500).json({ error: 'An error occurred while generating PDF and screenshot' })
    }
  }

  async healthCheck(req: Request, res: Response): Promise<void> {
    const url = 'https://github.com/analsituation'
    try {
      const resumes = await this.puppeteerService.healthCheck(url)
      if (resumes) {
        res.status(200).send({ health: 'ok' })
      } else {
        throw new Error()
      }
    } catch (error) {
      res.status(500).send({ health: 'off' })
    }
  }
}
