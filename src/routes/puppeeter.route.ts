import express from 'express'
import { PuppeteerController } from '../controllers/puppeeter.controller'

const route = express.Router()
const puppeteerController = new PuppeteerController()

route.get('/health-basic', puppeteerController.healthCheck.bind(puppeteerController))

route.post('/api/pup', puppeteerController.generatePdfAndScreenshot.bind(puppeteerController))

export default route
