# Contributing Presets to lib-version-check

## Preset Contribution Guidelines

### Overview
We welcome community contributions to expand our library presets! This guide will help you add new preset stacks to the `presets.js` file.

### Contribution Process

1. **Fork the Repository**
    - Go to the [lib-version-check GitHub repository](https://github.com/jiji-hoon96/lib-version-check)
    - Click "Fork" to create your own copy of the repository

2. **Create a New Branch**
   ```bash
   git checkout -b add-new-preset-stack
   ```

3. **Modify the Presets**
    - Open `presets.js` in the project root
    - Add your new preset to the appropriate category or create a new category if needed

### Preset Contribution Template

When adding a new preset, follow this structure:

```javascript
'unique-preset-key': {
    name: 'Descriptive Name of Preset Stack',
    packages: [
        'package1',
        'package2',
        // Add relevant packages for your stack
    ]
}
```

### Preset Contribution Criteria

✅ DO:
- Choose well-maintained and popular libraries
- Include libraries that work well together
- Provide a clear, descriptive name for the preset
- Group libraries by technology domain or use case

❌ DO NOT:
- Add outdated or deprecated packages
- Include experimental or niche libraries
- Create overly specific or narrow presets

### Example Contribution

```javascript
// In presets.js, under the appropriate category
'python-data-science': {
    name: 'Python Data Science Stack',
    packages: [
        'pandas',
        'numpy',
        'scikit-learn',
        'matplotlib',
        'seaborn',
        'jupyter',
        'plotly'
    ]
}
```

### Validation Checklist
Before submitting your PR:
1. Ensure all package names are correct
2. Check that packages are publicly available on npm
3. Verify the preset makes sense as a cohesive stack
4. Run any project tests if applicable

### Submitting Your Contribution

1. Commit your changes:
   ```bash
   git add presets.js
   git commit -m "Add [Category]: [Preset Name] preset stack"
   ```

2. Push to your fork:
   ```bash
   git push origin add-new-preset-stack
   ```

3. Open a Pull Request
    - Go to the original repository
    - Click "New Pull Request"
    - Select your fork and branch
    - Describe your preset contribution

### Review Process
- Maintainers will review your contribution
- They may request modifications or clarifications
- Once approved, your preset will be merged

### Questions?
If you have any questions about contributing presets, please open an issue on the GitHub repository.

## Thank You!
Your contributions help make lib-version-check more valuable for the entire developer community! 🚀