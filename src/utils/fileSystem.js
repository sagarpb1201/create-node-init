const fs = require('fs');
const path = require('path');
const {execAsync}=require('./processUtils');
const {FALLBACK_VERSIONS}=require('./constants');

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

  const devDependenciesToFetch = [];
  const dependenciesToFetch=[];
  devDependenciesToFetch.push('nodemon');

  packageJsonContent.scripts.dev = 'nodemon src/index.js';

  if (projectConfig.expressRequired) {
    dependenciesToFetch.push('express');
    // try{
    //   const {stdout:expressLatestVersion} = (await execAsync('npm show express version'));
    //   packageJsonContent.dependencies = { express: `^${expressLatestVersion.trim()}` };
    // }catch(err){
    //   console.warn(`[!] Warning: Could not fetch the latest version for express'. Using fallback version '${FALLBACK_VERSIONS.express}'.`);
    //   packageJsonContent.dependencies={express:FALLBACK_VERSIONS.express}
    // }
  }

  if (projectConfig.typescript) {
    devDependenciesToFetch.push('typescript', '@types/node', 'ts-node');

    packageJsonContent.main='dist/index.js';
    packageJsonContent.scripts.build = 'tsc';
    packageJsonContent.scripts.start = 'node dist/index.js';
    packageJsonContent.scripts.dev = 'nodemon --watch "src/**" --ext "ts,json" --exec "ts-node src/index.ts"';

    if(projectConfig.expressRequired){
      devDependenciesToFetch.push('@types/express');
    }
  }

  packageJsonContent.devDependencies = {};
  packageJsonContent.dependencies={};
  const devDependenciesVersionPromises = devDependenciesToFetch.map(dep => execAsync(`npm show ${dep} version`));
  const dependenciesVersionPromises=dependenciesToFetch.map(dep=>execAsync(`npm show ${dep} version`));
  const devDependenciesResults = await Promise.allSettled(devDependenciesVersionPromises);
  const dependenciesResults=await Promise.allSettled(dependenciesVersionPromises);
  const failedPackages = [];

  devDependenciesResults.forEach(({ status, value }, index) => {
    const packageName=devDependenciesToFetch[index];
    if (status === 'fulfilled') {
      packageJsonContent.devDependencies[packageName] = `^${value.stdout.trim()}`;
    } else {
      failedPackages.push(devDependenciesToFetch[index]);
      packageJsonContent.devDependencies[packageName] = FALLBACK_VERSIONS[packageName];
    }
  })

  dependenciesResults.forEach(({status,value},index)=>{
    const packageName=dependenciesToFetch[index];
    if(status==='fulfilled'){
      packageJsonContent.dependencies[packageName]=`^${value.stdout.trim()}`;
    }else{
      failedPackages.push(dependenciesToFetch[index]);
      packageJsonContent.dependencies[packageName]=FALLBACK_VERSIONS[packageName];
    }
  })

  if (failedPackages.length > 0) {
    console.warn(`\n Could not fetch latest versions for: ${failedPackages.join(', ')}`);
    console.warn(`   Using fallback versions. Your project will still work!\n`);
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
