import express from 'express'
import path from 'path'
import sessionRoute from './api/session'

const app = express()

app.use(express.json())

const port = process.env.PORT || 3000

// Static files
app.use('/static', express.static(path.join('/public')))

// API routes
app.use('/api', sessionRoute)

// Web app route
app.get('/', (req, res) => {
  res.sendFile(path.join('/public', 'index.html'))
})

app.listen(port)
console.log(`Server running on port ${port}`)


