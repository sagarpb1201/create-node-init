#!/usr/bin/env node
const { createProjectFolder, createProjectStructure } = require('./utils/fileSystem');
const { getProjectconfig } = require('./utils/prompts');
const path=require('node:path')

async function main(){
    const projectConfig=await getProjectconfig();
    const projectName=projectConfig.projectName;
    console.log('Project config',projectConfig,projectName);
    let projectPath;
    let finalProjectName;
    
    if(projectConfig.useCurrentDirectory){
        console.log("Initializing project in current directory");
        projectPath=process.cwd();
        finalProjectName = path.basename(projectPath);
    }else{
        finalProjectName = projectConfig.projectName;
        console.log(`Creating Project: ${finalProjectName}`)
        projectPath = createProjectFolder(finalProjectName);
    }
    projectConfig.projectName=finalProjectName;

    await createProjectStructure(projectPath,projectConfig);
    console.log(`Project ready at: ${projectPath}`);
}

main();