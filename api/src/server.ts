import Express from "express";
import "dotenv/config"

// Defines variables for later use
const app = Express();
const PORT = process.env.PORT || 5000;

app.get('/', (req, res) => {
    res.json({"message": "heisann"})
})

// Run server on port const
app.listen(5000, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})