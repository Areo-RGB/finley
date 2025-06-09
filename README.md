# Finley App

A web application built with Vite that includes SCSS support for styling.

## Setup

```bash
# Install dependencies
npm install
```

## Development

The project now supports SCSS compilation. Here are the available commands:

```bash
# Start the development server
npm run dev

# Compile SCSS to CSS once
npm run sass

# Watch SCSS files and compile on change
npm run sass:watch

# Run this in a separate terminal while developing
# to automatically compile SCSS changes
```

## Build

```bash
# Compile SCSS to CSS
npm run build:sass

# Build the project using Vite
npm run build

# Compile SCSS and build the project in one command
npm run build:full
```

## SCSS Structure

The SCSS files are organized in the following structure:

- `/scss/main.scss` - Main entry point that imports all other SCSS files
- `/scss/bootstrap/` - Bootstrap components and utilities
- `/scss/components/` - Custom components
- `/scss/highlights/` - Theme highlight styles
- `/scss/pages/` - Page-specific styles
- `/scss/plugins/` - Plugin-specific styles
- `/scss/sticky/` - Sticky element styles

## Adding New SCSS Files

To add a new SCSS file:

1. Create the file in the appropriate directory
2. Import it in the corresponding index file (e.g., `components.scss` for a new component)
3. Run `npm run sass` to compile the changes

## Preview

```bash
# Preview the production build
npm run preview
``` 
