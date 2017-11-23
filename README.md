### Initial dependencies
- Node >=6.5.0
- Webpack >=3.8.1
- MongoDB >=3.2.9
  - start mondodb after ensuring it's installed (let it run in a separate Terminal window)
    - `mongod --config /usr/local/etc/mongod.conf` (MacOSX method or equivalent way of starting mongodb on your system)

### To Install
- Install npm packages
  - `npm install`

### Development
Webpack will recompile when changes are made and node will watch for any recompiling and will restart automatically
- run webpack to build dev front-end
  - `npm run dev`
- start server and watch for updates
  - `npm run watch`

### Production
Webpack will clear out `dist` directory and build the production-ready front-end and `npm start` will start the server
- run webpack to build production front-end
  - `npm run build`
- start server
  - `npm start`


### General Explanation
To initially create the front-end we use Webpack to compile all JS, CSS, HTML, and fonts from the `public` and `app` directories into the `dist` directory.

The **JS** is primarily comprised of React JS, which is entirely in the `app` directory, with the entry file: `index.js`.

The **CSS** is transpiled from the `public/scss` directory.

The **HTML** is pulled from the `public/views` directory.

The `server.js` is run with the command `npm start` and links directly to the newly-generated `index.html` file in the `dist` directory.

