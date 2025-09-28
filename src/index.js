#!/usr/bin/env node
const { createProjectFolder, createProjectStructure } = require('./utils/fileSystem');
const { getProjectconfig } = require('./utils/prompts');

async function main(){
    const projectConfig=await getProjectconfig();
    const projectName=projectConfig.projectName;
    console.log('Project config',projectConfig,projectName);
    let projectPath;
    let finalProjectName;
    
    if(projectConfig.useCurrentDirectory){
        console.log("Initializing project in current directory");
        projectPath=process.cwd();
        finalProjectName = require('path').basename(projectPath);
    }else{
        finalProjectName = projectConfig.projectName;
        console.log(`Creating Project: ${finalProjectName}`)
        projectPath = createProjectFolder(finalProjectName);
    }

    createProjectStructure(projectPath,projectName);
    console.log(`Project ready at: ${projectPath}`);
}

main();