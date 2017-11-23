### Initial dependencies
- Node 6.5.0
- MongoDB 3.2.9
- Webpack 3.8.1

### To Install
- Install npm packages
  - `npm install`
- start mondodb
  - `mongod --config /usr/local/etc/mongod.conf` (or equivalent way of starting mongodb on your system)
- run webpack to build front-end
  - `webpack`

### General Explanation
To initially create the front-end we use Webpack to compile all JS, CSS, HTML, and fonts into the `public` directory.

The **JS** is primarily comprised of React JS, which is entirely in the `app` directory, with the entry file: `index.js`.

The **CSS** is transpiled from the `scss` directory.

The **HTML** is pulled from the `views` directory.

The `server.js` is run with the command `npm start` and links directly to the newly-generated `index.html` file in the `public` directory.

