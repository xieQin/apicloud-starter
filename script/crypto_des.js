var crypto = require('crypto');

var crypto_des = {
  encode: function(str, key) {
    var iv = new Buffer(key, "utf8");
    var key = new Buffer(key, "utf8");

    var cipher = crypto.createCipheriv('des-cbc', key, iv);
    str = cipher.update(str, 'utf8', 'base64') + cipher.final('base64');

    str = str.replace(/\//g, "@@")

    str = str.replace(/\+/g, "$$$")

    return str;
  },
  decode: function(str, key) {
    var iv = new Buffer(key, "utf8");
    key = new Buffer(key, "utf8");
    str = str.replace(/\@\@/g, "/");

    str = str.replace(/\$\$/g, "+");

    var decipher = crypto.createDecipheriv('des-cbc', key, iv);
    var str = decipher.update(str, 'base64', 'utf8') + decipher.final('utf8');
    return str;
  }
};

module.exports = crypto_des;