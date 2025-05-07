import Express from "express";
import "dotenv/config"
import { Pool } from 'pg'

// Defines variables for later use
const app = Express();
const PORT = process.env.PORT || 5000;

// Set up database connection
const pool = new Pool({
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: Number(process.env.PGPORT),
    database: process.env.PGDATABASE,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
})

// Endpoint for submitting a ticket
app.post('/tickets', (req, res) => {
    // Retrieve post data
    var title = req.body.title
    var description = req.body.description
    var category = req.body.category
})

app.get('/tickets/:id', (req, res) => {
    const ticket_id = req.params.id
})

// If route was not found
app.all(/(.*)/, (req, res) => {
    res.json({"status": "404"})
})

// Run server on port const
app.listen(5000, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})