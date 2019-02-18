# Albert

This project allows you to generate SVGs and layout their elements using the
[Cassowary constraint solver](https://github.com/slightlyoff/cassowary.js).

## How to use

Examples on how to use Albert are in the `examples/` directory. Also, take a
take a look at the `dist/` directory for a basic setup.

To play around, run:
```
npm start
```

This starts a web server on http://localhost:8080 that serves the `dist/`
directory and the Albert bundle itself.

## Building a bundle

Building the bundle requires [Webpack](https://webpack.js.org), which in turn requires [Node](https://nodejs.org) and [NPM](https://www.npmjs.com).

If you have Node and NPM installed, build the bundle by running:

```
npm run build
```

## Disclaimer

This is not an officially supported Google product.
