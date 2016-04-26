require('../libs/api')
var request = require('superagent')
var mypara = require('../libs/mypara')
var des = require('../libs/crypto_des.js')
var jQuery = require('jquery')
var config = require('../../config')

apiready = function(){
  var encode = des.encode('This is test.', 'JiwLYG=-')
  var param = {
    'page' : 1,
    'pageSize' : 10
  }
  var para = mypara.post('zhangying', param)
  request
    .post(config['zhangying']['url'] + 'referringDataV1')
    .send('p=' + encodeURIComponent(para))
    .end(function(err, data) {
      if (err) {
        return
      }
      var result = des.decode(data.text, 'abcdefgh')
      jQuery('.data').html(result)
      var d = JSON.parse(result)
      alert(d.d.total)
      // jQuery('.data').html(d)
    })
};
