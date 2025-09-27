#!/usr/bin/env node
const {isValidProjectName, sanitizeProjectName}=require('./utils/projectValidator');

function main(){
    let projectName=process.argv[2];

    if(!projectName){
        projectName='my-app'
    }else if(projectName==='.'){
        console.log("Initializing project in current directory");
        return;
    }
    
    const result=isValidProjectName(projectName);
    if(result.isValid){
        console.log(`Creating Project: ${result.cleanedName}`)
    }else{
        console.log(`Error: ${result.reason}`);
        process.exit(1);
    }
}

main();