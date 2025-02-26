# lib-version-check

[한국어](./README.ko.md)

A command-line tool to easily track and check versions of your favorite NPM libraries.

## Features

- Track NPM libraries by user
- Autocomplete search for NPM packages
- Check latest versions of libraries
- View last update dates
- Get library descriptions
- Simple and intuitive commands

## Community Contributions

### Preset Stacks
We love community contributions! Want to add a new preset stack for your favorite technology combination?

🚀 [See our Contribution Guide](CONTRIBUTING.md) to learn how to add new presets!

- Contribute new frontend, backend, testing, or infrastructure presets
- Help expand our library of technology stacks
- Share your expertise with the community

### How to Contribute
1. Check out our [Contribution Guidelines](CONTRIBUTING.md)
2. Fork the repository
3. Add your preset to `presets.js`
4. Open a Pull Request

## Contributing

Found a bug or want to suggest a new feature?
- [Open an Issue](https://github.com/jiji-hoon96/lib-version-check/issues)
- [Read Contributing Guidelines](CONTRIBUTING.md)

## Installation

```bash
npm install -g lib-version-check
```

## Usage

### Set User ID
When you run any command for the first time, you'll be prompted to enter a user ID. This ID is used to maintain separate library lists for different users.

### View Help
```bash
lib-check --help
```

### Add Libraries to Watch
```bash
lib-check add

# Interactive autocomplete search will start
# Type at least 3 characters to search for packages
```

### View Watched Libraries
```bash
lib-check list
```

### Check Library Information
```bash
lib-check check
```
This command shows the following information for each watched library:
- Current version
- Last update date
- Library description
- Homepage (if available)

### Remove Libraries
```bash
lib-check remove

# Interactive selection will appear
```

### Manage Configuration
```bash
# Show current configuration
lib-check config --show

# Change user ID
lib-check config --change

# Reset all configuration
lib-check config --reset
```

## Using with npx

You can also use the tool without global installation:

```bash
npx lib-version-check --help
npx lib-version-check add
npx lib-version-check list
npx lib-version-check check
```

## Example Output

```bash
$ lib-check add
? Search for a package: react
Successfully added react to your watch list

$ lib-check list
Watched libraries for user "your-user-id":
- react

$ lib-check check
Fetching library information...

react:
  Current version: 18.2.0
  Last updated: 2023-06-14
  Description: React is a JavaScript library for building user interfaces.
  Homepage: https://reactjs.org
```

## Why lib-version-check?

- **User-Specific Lists**: Each user can maintain their own list of watched libraries
- **Easy Search**: Autocomplete search makes finding packages simple
- **Stay Updated**: Quickly check if your favorite libraries have updates
- **Efficient**: Get all important information in one place
- **Simple Interface**: Intuitive commands make it easy to use

## Contributing

Found a bug or want to suggest a new feature? Please create an issue on GitHub.

## License

MIT

## Author

jiji-hoon96