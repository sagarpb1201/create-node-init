function sanitizeProjectName(name){
    return name.trim().toLowerCase().replace(/\s+/g, '-');
}

function isValidProjectName(name){
    if(!name || name.trim()==''){
        return {isValid:false, reason:'Please enter a valid project name'};
    }else if(name=='node_modules'){
        return {isValid:false,reason:'Project name cannot be node_modules'};
    }else{
        const sanitizedProjectName=sanitizeProjectName(name);
        if(sanitizedProjectName.startsWith('.')){
            return {isValid:false, reason:'Project name cannot start with a dot'};
        }
        return {isValid:true,cleanedName:sanitizedProjectName};
    }
}

module.exports={isValidProjectName, sanitizeProjectName};