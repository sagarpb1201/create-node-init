# @sagarbiradar/create-node-init

A modern CLI tool for scaffolding production-ready Node.js projects with interactive configuration.

## Installation & Usage

```bash
# Create a new project (recommended)
npx @sagarbiradar/create-node-init

# Or install globally
npm install -g @sagarbiradar/create-node-init
create-node-init
```

The CLI will guide you through an interactive setup process to configure your project exactly how you want it.

## Interactive Configuration

The CLI prompts you to customize your project:

- **Directory Setup**: Initialize in current directory or create a new one
- **Project Name**: Custom project naming with automatic sanitization
- **Express.js**: Optionally generate a complete Express server with routes
- **Git Repository**: Automatic Git initialization
- **TypeScript**: (Coming Soon) TypeScript configuration and templates
- **Package Manager**: (Coming Soon) Choose between npm, yarn, or pnpm

## Features

### **Smart Project Scaffolding**
- Automatic project name validation and sanitization
- Converts spaces to hyphens: "My Project" → "my-project"
- Prevents invalid names (reserved words, special characters)

### **Express.js Integration** 
- Complete Express server template with JSON API
- Organized folder structure (routes/, middleware/)
- Health check endpoint included
- Automatic dependency management with latest versions

### **TypeScript Integration**
- **Zero-Config Setup**: Generates a production-ready `tsconfig.json` with best-practice settings for Node.js.
- **Type-Safe Templates**: All generated code, including Express routes and middleware, is fully typed.
- **Seamless DX**: The `dev` script is pre-configured with `ts-node` and `nodemon` for a live-reloading TypeScript environment.
- **Automatic Dependencies**: Automatically adds `typescript`, `@types/node`, `@types/express`, and `ts-node` to your dev dependencies.
- **Build Ready**: Includes a `build` script that compiles your TypeScript to optimized JavaScript in a `dist/` directory.

### **Git Integration**
- Optional Git repository initialization
- Professional .gitignore with Node.js best practices
- Ready for version control from day one

### **Professional Structure**
- Clean, maintainable folder organization
- Production-ready package.json with proper scripts
- Development tools pre-configured (nodemon for Express projects)

## Generated Project Structure

### Basic Node.js Project
```
my-project/
├── src/
│   └── index.js          # Basic Node.js starter
├── package.json          # Configured with start/test scripts
├── .gitignore           # Node.js specific ignores
└── README.md            # (Coming Soon)
```

### Express.js Project
```
my-project/
├── src/
│   ├── index.js         # Express server with middleware
│   ├── routes/
│   │   └── index.js     # Health check route
│   └── middleware/      # Ready for custom middleware
├── package.json         # Express + nodemon configured
├── .gitignore          # Enhanced for Express projects
└── README.md           # (Coming Soon)
```

## Quick Start

1. **Create your project:**
   ```bash
   npx @sagarbiradar/create-node-init
   ```

2. **Follow the interactive prompts:**
   ```
   ✔ Initialize project in current directory? … no
   ✔ What is your project name? … my-awesome-api
   ✔ Do you want Express.js initialized? … yes
   ✔ Initialize Git repository? … yes
   ```

3. **Start developing:**
   ```bash
   cd my-awesome-api
   npm install
   npm run dev          # For Express projects
   # OR
   npm start            # For basic projects
   ```

4. **Test your Express API:**
   ```bash
   curl http://localhost:3000
   # Response: {"message": "Hello from your new Express.js API!", "timestamp": "..."}
   
   curl http://localhost:3000/health
   # Response: {"status": "OK", "service": "healthy"}
   ```

## Why @sagarbiradar/create-node-init?

- **Zero Configuration**: Get started immediately without boilerplate setup
- **Production Ready**: Best practices built-in from day one  
- **Modern Tooling**: Latest package versions and development tools
- **Flexible**: Works for both simple scripts and full Express APIs
- **Maintained**: Actively developed with new features added regularly
- **TypeScript Support**: Full TypeScript templates and configuration

## Coming Soon

- **Package Manager Choice**: Support for npm, yarn, and pnpm
- **Testing Setup**: Jest/Mocha integration options
- **Docker Support**: Containerization templates
- **More Templates**: Additional framework options

## Contributing

Issues and pull requests are welcome! This project is actively maintained and growing.

## Author

**Sagar Biradar**
- Building developer tools that solve real problems
- Learning and coding in public

## License

MIT