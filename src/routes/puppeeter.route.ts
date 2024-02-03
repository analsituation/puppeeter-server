import express from 'express'
import { PuppeteerController } from '../controllers/puppeeter.controller'

const route = express.Router()
const puppeteerController = new PuppeteerController()

route.post('/api/pup', puppeteerController.generatePdfAndScreenshot.bind(puppeteerController))

export default route
