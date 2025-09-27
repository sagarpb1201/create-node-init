const {isValidProjectName}=require('../src/utils/projectValidator');

console.log('Test 1', isValidProjectName('my-app'));
console.log('Test 2', isValidProjectName(' '));
console.log('Test 3', isValidProjectName(undefined));
console.log('Test 4', isValidProjectName(null));
console.log('Test 5', isValidProjectName('.'));
console.log('Test 6', isValidProjectName('node_modules'));
console.log('Test 7', isValidProjectName('MY APP'));
console.log('Test 8', isValidProjectName('_underscore'));
console.log('Test 9', isValidProjectName('UPPERCASE'));
console.log('Test 10', isValidProjectName('my project with    spaces'));