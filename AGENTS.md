# Repository Guidelines

## Project Structure & Module Organization

This repository is a small Node.js/Express service. The application entry point is `server.js`, which defines the Express app, in-memory car data, and all current HTTP routes. `package.json` and `package-lock.json` define the runtime dependency on Express and the available npm scripts. `.devcontainer/` stores Codespaces/container configuration. There is no separate `src/`, `test/`, or assets directory yet; add those only when the codebase grows enough to justify them.

## Build, Test, and Development Commands

- `npm install`: install dependencies from `package-lock.json`.
- `npm start`: run `node server.js` and serve the API at `http://localhost:3000`.
- `node server.js`: equivalent direct startup command for quick local checks.

No build step is currently required because the project uses plain CommonJS JavaScript.

## Coding Style & Naming Conventions

Use CommonJS imports (`require`) and keep route handlers close to the data or helper functions they use. Match the existing two-space indentation, semicolons, and single-quote string style. Prefer descriptive names such as `carIndex`, `updatedCar`, and `newCar`. Route paths should be REST-like and plural for collections, for example `/cars` and `/cars/:id`.

Keep comments useful and brief. Existing comments are Korean and explanatory; if adding comments, use the same language style already present in the touched section unless a broader documentation change is requested.

## Testing Guidelines

There is no test framework configured yet. For manual verification, start the server with `npm start` and exercise endpoints such as `GET /`, `GET /cars`, `GET /cars/1`, `POST /cars`, `PUT /cars/1`, and `DELETE /cars/1`.

When adding automated tests, prefer a Node HTTP/API test setup such as Jest or Mocha with Supertest. Place tests in `test/` or use `*.test.js` files, and add an `npm test` script in `package.json`.

## Commit & Pull Request Guidelines

The current Git history contains only `Initial commit`, so no detailed convention is established. Use short, imperative commit messages such as `Add car validation` or `Document API routes`.

Pull requests should include a brief summary, the commands or manual checks run, and any API behavior changes. Include example requests/responses when changing routes, and link related issues when available.

## Security & Configuration Tips

Do not commit secrets or local environment files; `.gitignore` already excludes `.env` and `.env.*`. The current data store is in-memory, so changes reset on restart. Validate request bodies before relying on client-provided data in production-facing changes.
