const prompts = require('prompts');
const { isValidProjectName, sanitizeProjectName } = require('./projectValidator');

async function getProjectconfig() {
  const directoryChoice = await prompts({
    type: 'confirm',
    name: 'useCurrentDirectory',
    message: 'Initialize project in current directory?',
    initial: false,
  });
  let sanitizedProjectName = null;

  if (!directoryChoice.useCurrentDirectory) {
    const namePrompt = await prompts({
      type: 'text',
      name: 'projectName',
      message: 'What is your project name?',
      initial: 'my-app',
      validate: (value) => {
        const result = isValidProjectName(value);
        return result.isValid ? true : result.reason;
      },
    });
    sanitizedProjectName = sanitizeProjectName(namePrompt.projectName);
  }

  const questions = [
    {
      type: 'confirm',
      name: 'typescript',
      message: 'Do you want Typescript support?',
      initial: false,
    },
    {
      type: 'confirm',
      name: 'expressRequired',
      message: 'Do you want express initialized?',
      initial: false,
    },
    {
      type: 'confirm',
      name: 'initializeGit',
      message: 'Initialize Git repository?',
      initial: false,
    },
    {
      type: 'select',
      name: 'packageManager',
      message: 'Which package manager do you prefer?',
      choices: [
        { title: 'npm', value: 'npm' },
        { title: 'yarn', value: 'yarn' },
        { title: 'pnpm', value: 'pnpm' },
      ],
      initial: 0,
    },
  ];

  const answers = await prompts(questions);
  return {
    useCurrentDirectory: directoryChoice.useCurrentDirectory,
    projectName: sanitizedProjectName,
    ...answers,
  };
}
module.exports = { getProjectconfig };
