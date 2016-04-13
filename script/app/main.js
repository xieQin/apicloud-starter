require('../libs/api')
var des = require('../libs/crypto_des.js')
var jQuery = require('jquery')

apiready = function(){
  var encode = des.encode('This is test.', 'JiwLYG=-');
  jQuery('.empty').html(encode);
};