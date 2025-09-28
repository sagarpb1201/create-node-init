const fs = require('fs');
const path = require('path');
const { exec } = require('node:child_process');

function createProjectFolder(projectName) {
  const currentWorkingDirectory = process.cwd();
  console.log('Current working directory', currentWorkingDirectory);
  const projectPath = path.join(currentWorkingDirectory, projectName);
  console.log('Project path would be', projectPath);
  fs.mkdirSync(projectPath, { recursive: true });
  return projectPath;
}

async function createProjectStructure(projectPath, projectConfig) {
  fs.mkdirSync(path.join(projectPath, 'src'), { recursive: true });
  if(projectConfig.expressRequired){
    fs.mkdirSync(path.join(projectPath,'src','middleware'),{recursive:true});
     const routeContent = `const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => {
    res.json({ status: 'OK', service: 'healthy' });
});

module.exports = router;`;
    fs.mkdirSync(path.join(projectPath,'src','routes'),{recursive:true})
    fs.writeFileSync(path.join(projectPath,'src','routes','index.js'),routeContent);
  }
  await createPackageJSON(projectPath, projectConfig);
  createGitignore(projectPath);
  createIndexJS(projectPath, projectConfig);
}

async function createPackageJSON(projectPath, projectConfig) {
  const packageJsonContent = {
    name: projectConfig.projectName,
    version: '1.0.0',
    description: '',
    main: 'src/index.js',
    scripts: {
      start: 'node src/index.js',
      test: 'echo "Error: no test specified" && exit 1',
    },
    author: '',
    license: 'ISC',
  };
  if (projectConfig.expressRequired) {
    const expressLatestVersion = await new Promise((resolve, reject) => {
      exec('npm show express version', (error, stdout, stderr) => {
        if (error) {
          console.error(`Error:${error.message}`);
          reject(error.message);
        }
        if (stderr) {
          console.error(`stderr:${stderr}`);
          reject(stderr);
        }
        resolve(stdout.trim());
      });
    });
    packageJsonContent.dependencies = { express: `^${expressLatestVersion}` };
    packageJsonContent.scripts.dev='nodemon src/index.js';
    packageJsonContent.devDependencies={nodemon:"^3.1.10"};
  }
  const jsonString = JSON.stringify(packageJsonContent, null, 2);
  fs.writeFileSync(path.join(projectPath, 'package.json'), jsonString);
  console.log('package.json file created');
}

function createGitignore(projectPath) {
  const gitignoreContent = `node_modules/
.env
.env.local
*.log
dist/
build/`;

  fs.writeFileSync(path.join(projectPath, '.gitignore'), gitignoreContent);
  console.log('.gitignore file created.');
}

function createIndexJS(projectPath, projectConfig) {
  let indexContent;

  if (projectConfig.expressRequired) {
    indexContent = `const express = require('express');
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
});`;
  } else {
    indexContent = `console.log('Hello from your new Node.js project!');`;
  }

  fs.writeFileSync(path.join(projectPath, 'src', 'index.js'), indexContent);
  console.log('index.js file created');
}

module.exports = { createProjectFolder, createProjectStructure, createPackageJSON };
