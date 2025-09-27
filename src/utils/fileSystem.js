const fs=require('fs');
const path=require('path');

function createProjectFolder(projectName){
    const currentWorkingDirectory=process.cwd();
    console.log('Current working directory',currentWorkingDirectory);
    const projectPath=path.join(currentWorkingDirectory,projectName);
    console.log('Project path would be',projectPath);
    fs.mkdirSync(projectPath,{recursive:true});
    return projectPath;
}

function createProjectStructure(projectpath,projectName){
    fs.mkdirSync(path.join(projectpath,'src'),{recursive:true});
    createPackageJSON(projectpath,projectName);
    createGitignore(projectpath);
    createIndexJS(projectpath);
}

function createPackageJSON(projectPath, projectName){
    const packageJsonContent = {
        "name": projectName,
        "version": "1.0.0", 
        "description": "",
        "main": "src/index.js",
        "scripts": {
            "start": "node src/index.js",
            "dev": "nodemon src/index.js",
            "test": "echo \"Error: no test specified\" && exit 1"
        },
        "author": "",
        "license": "ISC"
    };
    const jsonString=JSON.stringify(packageJsonContent,null,2);
    fs.writeFileSync(path.join(projectPath,'package.json'),jsonString);
    console.log('package.json file created');
}

function createGitignore(projectPath){
    const gitignoreContent = `node_modules/
.env
.env.local
*.log
dist/
build/`;

    fs.writeFileSync(path.join(projectPath,'.gitignore'),gitignoreContent);
    console.log('.gitignore file created.')
}

function createIndexJS(projectPath){
    const indexContent = `console.log('Hello from your new Node.js project! 🚀');`
    fs.writeFileSync(path.join(projectPath,'src','index.js'),indexContent);
    console.log('index.js file created');
}

module.exports={createProjectFolder,createProjectStructure,createPackageJSON};