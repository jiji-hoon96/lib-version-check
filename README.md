# lib-check

A command-line tool to easily track and check versions of your favorite NPM libraries.

## Features

- Maintain a watchlist of NPM libraries
- Check latest versions of libraries
- View last update dates
- Get library descriptions
- Simple and intuitive commands

## Installation

```bash
npm install -g @jiji-hoon96/lib-check
```

## Usage

### View Help
```bash
lib-check --help
```

### Add Libraries to Watch
```bash
lib-check add <library-name>

# Examples
lib-check add react
lib-check add next
lib-check add tailwindcss
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

### Remove Libraries
```bash
lib-check remove <library-name>

# Example
lib-check remove react
```

## Using with npx

You can also use the tool without global installation:

```bash
npx @jiji-hoon96/lib-check --help
npx @jiji-hoon96/lib-check add react
npx @jiji-hoon96/lib-check list
npx @jiji-hoon96/lib-check check
```

## Example Output

```bash
$ lib-check add react
Successfully added react to watch list

$ lib-check add next
Successfully added next to watch list

$ lib-check list
Your watched libraries:
- react
- next

$ lib-check check
Fetching library information...

react:
  Current version: 18.2.0
  Last updated: 2023-06-14
  Description: React is a JavaScript library for building user interfaces.

next:
  Current version: 14.0.4
  Last updated: 2023-12-19
  Description: The React Framework for Production
```

## Why lib-check?

- **Save Time**: Quickly check library versions without visiting npm websites
- **Stay Updated**: Easily track multiple libraries' updates
- **Simple Interface**: Intuitive commands make it easy to use
- **Efficient**: Get all important information in one place

## Contributing

Found a bug or want to suggest a new feature? Please create an issue on GitHub.

## License

MIT

## Author

jiji-hoon96