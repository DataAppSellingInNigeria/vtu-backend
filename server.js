// Import the Express framework to create the server
const express = require('express')

// Import CORS middleware to handle Cross-Origin Resource Sharing
const cors = require('cors')

// Import Morgan middleware to log HTTP requests in the console
const morgan = require('morgan')

// Load environment variables from a .env file into process.env
require('dotenv').config()

// Create an instance of an Express application
const app = express()

// Enable CORS for all incoming requests
app.use(cors())

// Parse incoming JSON requests and make the data available in req.body
app.use(express.json())

// Use Morgan to log HTTP requests in 'dev' format (method, URL, status, response time)
app.use(morgan('dev'))

// Mount the API routes under the '/api' path, loading route definitions from the routes/index.js file
app.use('/api', require('./routes/index'))

// Define the port number from the environment or default to 5000
const PORT = process.env.PORT || 5000

// Start the server and listen on the specified port
app.listen(PORT, () => console.log(`Server running on port ${PORT}, API is Live!!!`))
