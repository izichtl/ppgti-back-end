# Express.js, Typescript, Biome Boilerplate

## Overview

This project is a boilerplate for building scalable and modular applications using Express.js with TypeScript. It leverages a suite of packages to enhance development and ensure code quality:

- **express**: A fast, unopinionated, minimalist web framework for Node.js.
- **typescript**: A strongly typed programming language that builds on JavaScript, giving you better tooling at any scale.
- **biome**: A tool for code formatting and linting.
- **dotenv**: Loads environment variables from a `.env` file into `process.env`.
- **cors**: Middleware for enabling CORS (Cross-Origin Resource Sharing).
- **helmet**: Helps secure Express apps by setting various HTTP headers.
- **morgan**: HTTP request logger middleware.
- **winston**: A logger for JavaScript with support for multiple transports.
- **luxon**: A library for working with dates and times.
- **zod**: A TypeScript-first schema declaration and validation library.

## Features

- RESTful API endpoints for managing resources
- Authentication and authorization mechanisms
- Error handling and logging
- Scalable and modular architecture

## Repository Structure

```
express-ts-boilerplate/
├── .env
├── .env.example
├── .gitignore
├── .husky/
│   └── pre-commit
├── api/
│   └── index.ts
├── biome.json
├── config/
│   ├── custom-environment-variables.json
│   ├── default.json
│   ├── development.json
│   ├── production.json
│   └── stage.json
├── package.json
├── public/
│   └── index.html
├── README.md
├── src/
│   ├── app.ts
│   ├── connections/
│   │   └── .gitkeep
│   ├── controllers/
│   │   └── health.ts
│   ├── index.ts
│   ├── interactor/
│   │   └── .gitkeep
│   ├── lib/
│   │   ├── controllerWrapper.ts
│   │   └── error/
│   │       └── custom.error.ts
│   ├── middlewares/
│   │   ├── middlewares.ts
│   │   └── response.ts
│   ├── models/
│   │   └── .gitkeep
│   ├── routes.ts
│   ├── services/
│   │   └── .gitkeep
│   └── utils/
│       ├── logger.ts
│       └── winstonLogger.ts
├── tsconfig.json
└── vercel.json
```

### Directory Details

- **api/**: Contains API endpoint definitions and related logic.
- **config/**: Configuration files for different environments.
- **public/**: Static assets and public files.
- **src/**: Main source code including application logic, models, controllers, and services.
- **.husky/**: Configuration for Husky pre-commit hooks.
- **.env**: Environment variables file.
- **.env.example**: Sample environment configuration file.
- **biome.json**: Configuration for Biome.
- **package.json**: Node.js project metadata and dependencies.
- **tsconfig.json**: TypeScript configuration file.
- **vercel.json**: Configuration for deployment on Vercel.

## Setup and Installation

1. **Clone the repository:**

   ```sh
   git clone https://github.com/arnavsharma2711/express-ts-boilerplate.git
   cd express-ts-boilerplate
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Setup environment variables:**

   Copy `.env.example` to `.env` and configure the environment variables.

   ```sh
   cp .env.example .env
   ```

4. **Run the application:**

   ```sh
   npm run dev
   ```

## Technologies Used

- **Language**: TypeScript
- **Environment**: Node
- **Framework**: Express
- **Deployment**: Vercel
