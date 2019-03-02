# Albert

This project allows you to generate SVGs and layout their elements using the
[Cassowary constraint solver](https://github.com/slightlyoff/cassowary.js).

## How to use

This project requires [Node](https://nodejs.org) and [NPM](https://www.npmjs.com).
To use it in your project, run:

```
npm install --save albert-svg
```

You can also use the one of the pre-compiled bundles hosted on unpkg:

- https://unpkg.com/albert-svg/dist/albert.js
- https://unpkg.com/albert-svg/dist/albert.min.js

Examples on how to use Albert are in the [`examples`](https://github.com/evoL/albert/tree/master/examples) directory.

To see them in action, clone the repository and run:

```
npm install
npm start
```

This starts a web server on http://localhost:8080 that serves the `examples/`
directory and the Albert bundle itself.

## Building a bundle

Building the bundle requires [Webpack](https://webpack.js.org), which in turn

If you have Node and NPM installed, build the bundle by running:

```
npm run build
```

## Disclaimer

This is not an officially supported Google product.
