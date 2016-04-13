var config = {
  browserify: {
    debug: true,
    extensions: [],
    bundleConfigs: [
      {
        entries:    './script/app.js',
        dest:       './dist',
        outputName: 'app.js'
      }, {
        entries:    './script/app/main.js',
        dest:       './dist/app',
        outputName: 'main.js'
      }
    ]
  }
}

module.exports = config;