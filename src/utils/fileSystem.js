const fs = require('fs');
const path = require('path');
const {execAsync}=require('./processUtils');
const basicTemplates = require('../templates/basicTemplates');
const expressTemplates = require('../templates/expressTemplates');
const {gitignoreTemplate}=require('../templates/gitIgnoreTemplate');

function createProjectFolder(projectName) {
  const currentWorkingDirectory = process.cwd();
  const projectPath = path.join(currentWorkingDirectory, projectName);
  fs.mkdirSync(projectPath, { recursive: true });
  return projectPath;
}

async function createProjectStructure(projectPath, projectConfig) {
  fs.mkdirSync(path.join(projectPath, 'src'), { recursive: true });
  if(projectConfig.expressRequired){
    fs.mkdirSync(path.join(projectPath,'src','middleware'),{recursive:true});

    fs.mkdirSync(path.join(projectPath,'src','routes'),{recursive:true})
    fs.writeFileSync(path.join(projectPath,'src','routes','index.js'),expressTemplates.routeTemplate);
  }
  await createPackageJSON(projectPath, projectConfig);
  createGitignore(projectPath);
  createIndexJS(projectPath, projectConfig);
  if(projectConfig.initializeGit){
    await initializeGit(projectPath);
  }
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
    const {stdout:expressLatestVersion} = (await execAsync('npm show express version'));
    packageJsonContent.dependencies = { express: `^${expressLatestVersion.trim()}` };
    packageJsonContent.scripts.dev='nodemon src/index.js';
    packageJsonContent.devDependencies={nodemon:"^3.1.10"};
  }
  const jsonString = JSON.stringify(packageJsonContent, null, 2);
  fs.writeFileSync(path.join(projectPath, 'package.json'), jsonString);
  console.log('package.json file created');
}

function createGitignore(projectPath) {
  fs.writeFileSync(path.join(projectPath, '.gitignore'), gitignoreTemplate);
  console.log('.gitignore file created.');
}

function createIndexJS(projectPath, projectConfig) {
    const template = projectConfig.expressRequired 
        ? expressTemplates.indexJs 
        : basicTemplates.indexJs;

  fs.writeFileSync(path.join(projectPath, 'src', 'index.js'), template);
  console.log('index.js file created');
}

async function initializeGit(projectPath){
    try{
        await execAsync('git init',{cwd:projectPath});
        console.log('Git repository initialized');
    }catch(error){
        console.warn('Failed initialize Git repository:',error.message);
    }
}

module.exports = { createProjectFolder, createProjectStructure, createPackageJSON };
