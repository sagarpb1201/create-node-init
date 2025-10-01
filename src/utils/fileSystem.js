const fs = require('fs');
const path = require('path');
const {execAsync}=require('./processUtils');

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
    let fileExtension=projectConfig.typescript?'ts':'js';
    const routeTemplatePath = path.join(__dirname, '..', '..', 'templates',`express.routes.${fileExtension}`);
    fs.copyFileSync(routeTemplatePath, path.join(projectPath, 'src', 'routes',`index.${fileExtension}`));
  }
  await createPackageJSON(projectPath, projectConfig);
  createGitignore(projectPath);
  createIndexFile(projectPath, projectConfig);
  if(projectConfig.initializeGit){
    await initializeGit(projectPath);
  }
  if(projectConfig.typescript){
    await createTSConfigJSON(projectPath);
  }
}

async function createTSConfigJSON(projectPath){
  const tsconfigTemplatePath=path.join(__dirname,'..','..','templates','tsconfig.json.template');
  fs.copyFileSync(tsconfigTemplatePath,path.join(projectPath,'tsconfig.json'));
  console.log('tsconfig file created');
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
  const devDependenciesToFetch = ['typescript', '@types/node'];
  if (projectConfig.expressRequired) {
    const {stdout:expressLatestVersion} = (await execAsync('npm show express version'));
    packageJsonContent.dependencies = { express: `^${expressLatestVersion.trim()}` };
    packageJsonContent.scripts.dev='nodemon src/index.js';
    devDependenciesToFetch.push('nodemon');
  }

  if (projectConfig.typescript) {
    packageJsonContent.devDependencies = packageJsonContent.devDependencies || {};
    packageJsonContent.main='dist/index.js';

    packageJsonContent.scripts.build = 'tsc';
    packageJsonContent.scripts.start = 'node dist/index.js';

    if(projectConfig.expressRequired){
      devDependenciesToFetch.push('@types/express');
      devDependenciesToFetch.push('ts-node');

      packageJsonContent.scripts.dev = 'nodemon --watch "src/**" --ext "ts,json" --exec "ts-node src/index.ts"';
    }

    const versionPromises = devDependenciesToFetch.map(dep => execAsync(`npm show ${dep} version`));

    const versions = await Promise.all(versionPromises);

    devDependenciesToFetch.forEach((dep, index) => {
      const version = versions[index].stdout.trim();
      packageJsonContent.devDependencies[dep] = `^${version}`;
    });
  }
  const jsonString = JSON.stringify(packageJsonContent, null, 2);
  fs.writeFileSync(path.join(projectPath, 'package.json'), jsonString);
  console.log('package.json file created');
}

function createGitignore(projectPath) {
  const gitignoreTemplatePath = path.join(__dirname, '..', '..', 'templates', 'common.gitignore');
  fs.copyFileSync(gitignoreTemplatePath, path.join(projectPath, '.gitignore'));
  console.log('.gitignore file created.');
}

function createIndexFile(projectPath, projectConfig) {
  const fileExtension=projectConfig.typescript?'ts':'js';
  const templateName=projectConfig.expressRequired?`express.index.${fileExtension}`:`basic.index.${fileExtension}`;
  const templatePath = path.join(__dirname, '..', '..', 'templates', templateName);
  const template = fs.readFileSync(templatePath, { encoding: 'utf-8' });
  fs.writeFileSync(path.join(projectPath, 'src', `index.${fileExtension}`), template);
  console.log(`index.${fileExtension} file created`);
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
