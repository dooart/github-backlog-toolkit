# Github Backlog Toolkit

A toolkit to help teams using Github to organize their sprints. It runs different tasks to fetch information from Github.

GBT currently does three things:
1. Find issues not assigned to any project boards
2. Find issues in project boards that contain specific labels
3. Prints the last time you've deployed a repository to production (last version tag)

### Using GBT in a project
1. Add it to your project using `yarn` or `npm`
2. Import GBT as a module
3. Send a configuration object as a parameter to the module (see `config.json.sample` for an example)

### Running GBT from the command line
1. Create a `config.json` file with the contents of `config.json.sample`.
2. Remove the tasks you don't want to run
3. Update the configuration to match your repositories, project boards, etc.
4. Set a `GITHUB_TOKEN` env var containing a valid Github token.
