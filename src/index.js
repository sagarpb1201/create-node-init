#!/usr/bin/env node
const { createProjectFolder, createProjectStructure } = require('./utils/fileSystem');
const {isValidProjectName}=require('./utils/projectValidator');

function main(){
    let projectName=process.argv[2];
    let projectPath;

    if(!projectName){
        projectName='my-app'
    }
    
    if(projectName==='.'){
        console.log("Initializing project in current directory");
        projectPath=process.cwd();
    }else{   
        const result=isValidProjectName(projectName);
        if(!result.isValid){
            console.log(`Error: ${result.reason}`);
            process.exit(1);
        }
        console.log(`Creating Project: ${result.cleanedName}`)
        projectPath=createProjectFolder(result.cleanedName);
    }

    createProjectStructure(projectPath,projectName);
    console.log(`Project ready at: ${projectPath}`);
}

main();