const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.json({ 
        message: 'Hello from your new Express.js API!',
        timestamp: new Date().toISOString()
    });
});

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});