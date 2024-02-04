import express from 'express'
import route from './routes/puppeeter.route'

const app = express()
const PORT = 8080

app.use(express.json())
app.use(route)

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
