require('./script/api')
var des = require('./script/crypto_des.js')
var jQuery = require('./node_modules/jquery/dist/jquery.min.js')

apiready = function(){
  console.log("Hello APICloud");

  var header = $api.byId('header');
  //适配iOS7+，Android4.4+状态栏沉浸式效果，详见config文档statusBarAppearance字段
  $api.fixStatusBar(header);
  //动态计算header的高度，因iOS7+和Android4.4+上支持沉浸式效果，
  //因此header的实际高度可能为css样式中声明的44px加上设备状态栏高度
  //其中，IOS状态栏高度为20px，Android为25px
  var headerH = $api.offset(header).h;
  //footer高度为css样式中声明的30px
  var footerH = 30;
  //frame的高度为当前window高度减去header和footer的高度
  var frameH = api.winHeight - headerH - footerH;
  api.openFrame({
    name: 'main',
    url: './html/main.html',
    bounces: true,
    rect: {
      x: 0,
      y: headerH,
      w: 'auto',
      h: frameH
    }
  });
};