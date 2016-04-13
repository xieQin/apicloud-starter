require('./libs/api')

apiready = function () {
    $api.fixStatusBar( $api.dom('header') );
    api.setStatusBarStyle({
        style: 'dark',
        color: '#6ab494'
    });
    funIniGroup();
}