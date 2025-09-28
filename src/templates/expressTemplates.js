module.exports = {
    indexJs: `const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.json({ 
        message: 'Hello from your new Express.js API! 🚀',
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(port, () => {
    console.log(\`Server running on port \${port}\`);
});`,

    routeTemplate: `const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'healthy' });
});

module.exports = router;`,

    packageJsonConfig: {
        scripts: {
            dev: 'nodemon src/index.js'
        },
        devDependencies: {
            nodemon: "^3.1.10"
        }
    }
};