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
  },
  'zhangying' : {
    'url' : 'http://192.168.10.244/zhangying/zhangying/index.php/Api/',
    'token' : 'abcdefgh',
    'deskey' : 'abcdefgh',
    'os' : 'Web'
  }
}

module.exports = config;