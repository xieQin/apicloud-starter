(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
require('./libs/api')

apiready = function () {
    $api.fixStatusBar( $api.dom('header') );
    api.setStatusBarStyle({
        style: 'dark',
        color: '#6ab494'
    });
    funIniGroup();
}
},{"./libs/api":2}],2:[function(require,module,exports){
/*
 * APICloud JavaScript Library
 * Copyright (c) 2014 apicloud.com
 */
(function(window){
    var u = {};
    var isAndroid = (/android/gi).test(navigator.appVersion);
    var uzStorage = function(){
        var ls = window.localStorage;
        if(isAndroid){
           ls = os.localStorage();
        }
        return ls;
    };
    function parseArguments(url, data, fnSuc, dataType) {
        if (typeof(data) == 'function') {
            dataType = fnSuc;
            fnSuc = data;
            data = undefined;
        }
        if (typeof(fnSuc) != 'function') {
            dataType = fnSuc;
            fnSuc = undefined;
        }
        return {
            url: url,
            data: data,
            fnSuc: fnSuc,
            dataType: dataType
        };
    }
    u.trim = function(str){
        if(String.prototype.trim){
            return str == null ? "" : String.prototype.trim.call(str);
        }else{
            return str.replace(/(^\s*)|(\s*$)/g, "");
        }
    };
    u.trimAll = function(str){
        return str.replace(/\s*/g,'');
    };
    u.isElement = function(obj){
        return !!(obj && obj.nodeType == 1);
    };
    u.isArray = function(obj){
        if(Array.isArray){
            return Array.isArray(obj);
        }else{
            return obj instanceof Array;
        }
    };
    u.isEmptyObject = function(obj){
        if(JSON.stringify(obj) === '{}'){
            return true;
        }
        return false;
    };
    u.addEvt = function(el, name, fn, useCapture){
        if(!u.isElement(el)){
            console.warn('$api.addEvt Function need el param, el param must be DOM Element');
            return;
        }
        useCapture = useCapture || false;
        if(el.addEventListener) {
            el.addEventListener(name, fn, useCapture);
        }
    };
    u.rmEvt = function(el, name, fn, useCapture){
        if(!u.isElement(el)){
            console.warn('$api.rmEvt Function need el param, el param must be DOM Element');
            return;
        }
        useCapture = useCapture || false;
        if (el.removeEventListener) {
            el.removeEventListener(name, fn, useCapture);
        }
    };
    u.one = function(el, name, fn, useCapture){
        if(!u.isElement(el)){
            console.warn('$api.one Function need el param, el param must be DOM Element');
            return;
        }
        useCapture = useCapture || false;
        var that = this;
        var cb = function(){
            fn && fn();
            that.rmEvt(el, name, cb, useCapture);
        };
        that.addEvt(el, name, cb, useCapture);
    };
    u.dom = function(el, selector){
        if(arguments.length === 1 && typeof arguments[0] == 'string'){
            if(document.querySelector){
                return document.querySelector(arguments[0]);
            }
        }else if(arguments.length === 2){
            if(el.querySelector){
                return el.querySelector(selector);
            }
        }
    };
    u.domAll = function(el, selector){
        if(arguments.length === 1 && typeof arguments[0] == 'string'){
            if(document.querySelectorAll){
                return document.querySelectorAll(arguments[0]);
            }
        }else if(arguments.length === 2){
            if(el.querySelectorAll){
                return el.querySelectorAll(selector);
            }
        }
    };
    u.byId = function(id){
        return document.getElementById(id);
    };
    u.first = function(el, selector){
        if(arguments.length === 1){
            if(!u.isElement(el)){
                console.warn('$api.first Function need el param, el param must be DOM Element');
                return;
            }
            return el.children[0];
        }
        if(arguments.length === 2){
            return this.dom(el, selector+':first-child');
        }
    };
    u.last = function(el, selector){
        if(arguments.length === 1){
            if(!u.isElement(el)){
                console.warn('$api.last Function need el param, el param must be DOM Element');
                return;
            }
            var children = el.children;
            return children[children.length - 1];
        }
        if(arguments.length === 2){
            return this.dom(el, selector+':last-child');
        }
    };
    u.eq = function(el, index){
        return this.dom(el, ':nth-child('+ index +')');
    };
    u.not = function(el, selector){
        return this.domAll(el, ':not('+ selector +')');
    };
    u.prev = function(el){
        if(!u.isElement(el)){
            console.warn('$api.prev Function need el param, el param must be DOM Element');
            return;
        }
        var node = el.previousSibling;
        if(node.nodeType && node.nodeType === 3){
            node = node.previousSibling;
            return node;
        }
    };
    u.next = function(el){
        if(!u.isElement(el)){
            console.warn('$api.next Function need el param, el param must be DOM Element');
            return;
        }
        var node = el.nextSibling;
        if(node.nodeType && node.nodeType === 3){
            node = node.nextSibling;
            return node;
        }
    };
    u.closest = function(el, selector){
        if(!u.isElement(el)){
            console.warn('$api.closest Function need el param, el param must be DOM Element');
            return;
        }
        var doms, targetDom;
        var isSame = function(doms, el){
            var i = 0, len = doms.length;
            for(i; i<len; i++){
                if(doms[i].isEqualNode(el)){
                    return doms[i];
                }
            }
            return false;
        };
        var traversal = function(el, selector){
            doms = u.domAll(el.parentNode, selector);
            targetDom = isSame(doms, el);
            while(!targetDom){
                el = el.parentNode;
                if(el != null && el.nodeType == el.DOCUMENT_NODE){
                    return false;
                }
                traversal(el, selector);
            }

            return targetDom;
        };

        return traversal(el, selector);
    };
    u.contains = function(parent,el){
        var mark = false;
        if(el === parent){
            mark = true;
            return mark;
        }else{
            do{
                el = el.parentNode;
                if(el === parent){
                    mark = true;
                    return mark;
                }
            }while(el === document.body || el === document.documentElement);

            return mark;
        }
        
    };
    u.remove = function(el){
        if(el && el.parentNode){
            el.parentNode.removeChild(el);
        }
    };
    u.attr = function(el, name, value){
        if(!u.isElement(el)){
            console.warn('$api.attr Function need el param, el param must be DOM Element');
            return;
        }
        if(arguments.length == 2){
            return el.getAttribute(name);
        }else if(arguments.length == 3){
            el.setAttribute(name, value);
            return el;
        }
    };
    u.removeAttr = function(el, name){
        if(!u.isElement(el)){
            console.warn('$api.removeAttr Function need el param, el param must be DOM Element');
            return;
        }
        if(arguments.length === 2){
            el.removeAttribute(name);
        }
    };
    u.hasCls = function(el, cls){
        if(!u.isElement(el)){
            console.warn('$api.hasCls Function need el param, el param must be DOM Element');
            return;
        }
        if(el.className.indexOf(cls) > -1){
            return true;
        }else{
            return false;
        }
    };
    u.addCls = function(el, cls){
        if(!u.isElement(el)){
            console.warn('$api.addCls Function need el param, el param must be DOM Element');
            return;
        }
        if('classList' in el){
            el.classList.add(cls);
        }else{
            var preCls = el.className;
            var newCls = preCls +' '+ cls;
            el.className = newCls;
        }
        return el;
    };
    u.removeCls = function(el, cls){
        if(!u.isElement(el)){
            console.warn('$api.removeCls Function need el param, el param must be DOM Element');
            return;
        }
        if('classList' in el){
            el.classList.remove(cls);
        }else{
            var preCls = el.className;
            var newCls = preCls.replace(cls, '');
            el.className = newCls;
        }
        return el;
    };
    u.toggleCls = function(el, cls){
        if(!u.isElement(el)){
            console.warn('$api.toggleCls Function need el param, el param must be DOM Element');
            return;
        }
       if('classList' in el){
            el.classList.toggle(cls);
        }else{
            if(u.hasCls(el, cls)){
                u.removeCls(el, cls);
            }else{
                u.addCls(el, cls);
            }
        }
        return el;
    };
    u.val = function(el, val){
        if(!u.isElement(el)){
            console.warn('$api.val Function need el param, el param must be DOM Element');
            return;
        }
        if(arguments.length === 1){
            switch(el.tagName){
                case 'SELECT':
                    var value = el.options[el.selectedIndex].value;
                    return value;
                    break;
                case 'INPUT':
                    return el.value;
                    break;
                case 'TEXTAREA':
                    return el.value;
                    break;
            }
        }
        if(arguments.length === 2){
            switch(el.tagName){
                case 'SELECT':
                    el.options[el.selectedIndex].value = val;
                    return el;
                    break;
                case 'INPUT':
                    el.value = val;
                    return el;
                    break;
                case 'TEXTAREA':
                    el.value = val;
                    return el;
                    break;
            }
        }
        
    };
    u.prepend = function(el, html){
        if(!u.isElement(el)){
            console.warn('$api.prepend Function need el param, el param must be DOM Element');
            return;
        }
        el.insertAdjacentHTML('afterbegin', html);
        return el;
    };
    u.append = function(el, html){
        if(!u.isElement(el)){
            console.warn('$api.append Function need el param, el param must be DOM Element');
            return;
        }
        el.insertAdjacentHTML('beforeend', html);
        return el;
    };
    u.before = function(el, html){
        if(!u.isElement(el)){
            console.warn('$api.before Function need el param, el param must be DOM Element');
            return;
        }
        el.insertAdjacentHTML('beforebegin', html);
        return el;
    };
    u.after = function(el, html){
        if(!u.isElement(el)){
            console.warn('$api.after Function need el param, el param must be DOM Element');
            return;
        }
        el.insertAdjacentHTML('afterend', html);
        return el;
    };
    u.html = function(el, html){
        if(!u.isElement(el)){
            console.warn('$api.html Function need el param, el param must be DOM Element');
            return;
        }
        if(arguments.length === 1){
            return el.innerHTML;
        }else if(arguments.length === 2){
            el.innerHTML = html;
            return el;
        }
    };
    u.text = function(el, txt){
        if(!u.isElement(el)){
            console.warn('$api.text Function need el param, el param must be DOM Element');
            return;
        }
        if(arguments.length === 1){
            return el.textContent;
        }else if(arguments.length === 2){
            el.textContent = txt;
            return el;
        }
    };
    u.offset = function(el){
        if(!u.isElement(el)){
            console.warn('$api.offset Function need el param, el param must be DOM Element');
            return;
        }
        var sl = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
        var st = Math.max(document.documentElement.scrollTop, document.body.scrollTop);

        var rect = el.getBoundingClientRect();
        return {
            l: rect.left + sl,
            t: rect.top + st,
            w: el.offsetWidth,
            h: el.offsetHeight
        };
    };
    u.css = function(el, css){
        if(!u.isElement(el)){
            console.warn('$api.css Function need el param, el param must be DOM Element');
            return;
        }
        if(typeof css == 'string' && css.indexOf(':') > 0){
            el.style && (el.style.cssText += ';' + css);
        }
    };
    u.cssVal = function(el, prop){
        if(!u.isElement(el)){
            console.warn('$api.cssVal Function need el param, el param must be DOM Element');
            return;
        }
        if(arguments.length === 2){
            var computedStyle = window.getComputedStyle(el, null);
            return computedStyle.getPropertyValue(prop);
        }
    };
    u.jsonToStr = function(json){
        if(typeof json === 'object'){
            return JSON && JSON.stringify(json);
        }
    };
    u.strToJson = function(str){
        if(typeof str === 'string'){
            return JSON && JSON.parse(str);
        }
    };
    u.setStorage = function(key, value){
        if(arguments.length === 2){
            var v = value;
            if(typeof v == 'object'){
                v = JSON.stringify(v);
                v = 'obj-'+ v;
            }else{
                v = 'str-'+ v;
            }
            var ls = uzStorage();
            if(ls){
                ls.setItem(key, v);
            }
        }
    };
    u.getStorage = function(key){
        var ls = uzStorage();
        if(ls){
            var v = ls.getItem(key);
            if(!v){return;}
            if(v.indexOf('obj-') === 0){
                v = v.slice(4);
                return JSON.parse(v);
            }else if(v.indexOf('str-') === 0){
                return v.slice(4);
            }
        }
    };
    u.rmStorage = function(key){
        var ls = uzStorage();
        if(ls && key){
            ls.removeItem(key);
        }
    };
    u.clearStorage = function(){
        var ls = uzStorage();
        if(ls){
            ls.clear();
        }
    };

   
    /*by king*/
    u.fixIos7Bar = function(el){
        if(!u.isElement(el)){
            console.warn('$api.fixIos7Bar Function need el param, el param must be DOM Element');
            return;
        }
        var strDM = api.systemType;
        if (strDM == 'ios') {
            var strSV = api.systemVersion;
            var numSV = parseInt(strSV,10);
            var fullScreen = api.fullScreen;
            var iOS7StatusBarAppearance = api.iOS7StatusBarAppearance;
            if (numSV >= 7 && !fullScreen && iOS7StatusBarAppearance) {
                el.style.paddingTop = '20px';
            }
        }
    };
    u.fixStatusBar = function(el){
        if(!u.isElement(el)){
            console.warn('$api.fixStatusBar Function need el param, el param must be DOM Element');
            return;
        }
        var sysType = api.systemType;
        if(sysType == 'ios'){
            u.fixIos7Bar(el);
        }else if(sysType == 'android'){
            var ver = api.systemVersion;
            ver = parseFloat(ver);
            if(ver >= 4.4){
                el.style.paddingTop = '25px';
            }
        }
    };
    u.toast = function(title, text, time){
        var opts = {};
        var show = function(opts, time){
            api.showProgress(opts);
            setTimeout(function(){
                api.hideProgress();
            },time);
        };
        if(arguments.length === 1){
            var time = time || 500;
            if(typeof title === 'number'){
                time = title;
            }else{
                opts.title = title+'';
            }
            show(opts, time);
        }else if(arguments.length === 2){
            var time = time || 500;
            var text = text;
            if(typeof text === "number"){
                var tmp = text;
                time = tmp;
                text = null;
            }
            if(title){
                opts.title = title;
            }
            if(text){
                opts.text = text;
            }
            show(opts, time);
        }
        if(title){
            opts.title = title;
        }
        if(text){
            opts.text = text;
        }
        time = time || 500;
        show(opts, time);
    };
    u.post = function(/*url,data,fnSuc,dataType*/){
        var argsToJson = parseArguments.apply(null, arguments);
        var json = {};
        var fnSuc = argsToJson.fnSuc;
        argsToJson.url && (json.url = argsToJson.url);
        argsToJson.data && (json.data = argsToJson.data);
        if(argsToJson.dataType){
            var type = argsToJson.dataType.toLowerCase();
            if (type == 'text'||type == 'json') {
                json.dataType = type;
            }
        }else{
            json.dataType = 'json';
        }
        json.method = 'post';
        api.ajax(json,
            function(ret,err){
                if (ret) {
                    fnSuc && fnSuc(ret);
                }
            }
        );
    };
    u.get = function(/*url,fnSuc,dataType*/){
        var argsToJson = parseArguments.apply(null, arguments);
        var json = {};
        var fnSuc = argsToJson.fnSuc;
        argsToJson.url && (json.url = argsToJson.url);
        //argsToJson.data && (json.data = argsToJson.data);
        if(argsToJson.dataType){
            var type = argsToJson.dataType.toLowerCase();
            if (type == 'text'||type == 'json') {
                json.dataType = type;
            }
        }else{
            json.dataType = 'text';
        }
        json.method = 'get';
        api.ajax(json,
            function(ret,err){
                if (ret) {
                    fnSuc && fnSuc(ret);
                }
            }
        );
    };

/*end*/
    

    window.$api = u;

})(window);



},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzY3JpcHQvYXBwLmpzIiwic2NyaXB0L2xpYnMvYXBpLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJyZXF1aXJlKCcuL2xpYnMvYXBpJylcclxuXHJcbmFwaXJlYWR5ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgJGFwaS5maXhTdGF0dXNCYXIoICRhcGkuZG9tKCdoZWFkZXInKSApO1xyXG4gICAgYXBpLnNldFN0YXR1c0JhclN0eWxlKHtcclxuICAgICAgICBzdHlsZTogJ2RhcmsnLFxyXG4gICAgICAgIGNvbG9yOiAnIzZhYjQ5NCdcclxuICAgIH0pO1xyXG4gICAgZnVuSW5pR3JvdXAoKTtcclxufSIsIi8qXG4gKiBBUElDbG91ZCBKYXZhU2NyaXB0IExpYnJhcnlcbiAqIENvcHlyaWdodCAoYykgMjAxNCBhcGljbG91ZC5jb21cbiAqL1xuKGZ1bmN0aW9uKHdpbmRvdyl7XG4gICAgdmFyIHUgPSB7fTtcbiAgICB2YXIgaXNBbmRyb2lkID0gKC9hbmRyb2lkL2dpKS50ZXN0KG5hdmlnYXRvci5hcHBWZXJzaW9uKTtcbiAgICB2YXIgdXpTdG9yYWdlID0gZnVuY3Rpb24oKXtcbiAgICAgICAgdmFyIGxzID0gd2luZG93LmxvY2FsU3RvcmFnZTtcbiAgICAgICAgaWYoaXNBbmRyb2lkKXtcbiAgICAgICAgICAgbHMgPSBvcy5sb2NhbFN0b3JhZ2UoKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbHM7XG4gICAgfTtcbiAgICBmdW5jdGlvbiBwYXJzZUFyZ3VtZW50cyh1cmwsIGRhdGEsIGZuU3VjLCBkYXRhVHlwZSkge1xuICAgICAgICBpZiAodHlwZW9mKGRhdGEpID09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGRhdGFUeXBlID0gZm5TdWM7XG4gICAgICAgICAgICBmblN1YyA9IGRhdGE7XG4gICAgICAgICAgICBkYXRhID0gdW5kZWZpbmVkO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0eXBlb2YoZm5TdWMpICE9ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGRhdGFUeXBlID0gZm5TdWM7XG4gICAgICAgICAgICBmblN1YyA9IHVuZGVmaW5lZDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgICAgICBkYXRhOiBkYXRhLFxuICAgICAgICAgICAgZm5TdWM6IGZuU3VjLFxuICAgICAgICAgICAgZGF0YVR5cGU6IGRhdGFUeXBlXG4gICAgICAgIH07XG4gICAgfVxuICAgIHUudHJpbSA9IGZ1bmN0aW9uKHN0cil7XG4gICAgICAgIGlmKFN0cmluZy5wcm90b3R5cGUudHJpbSl7XG4gICAgICAgICAgICByZXR1cm4gc3RyID09IG51bGwgPyBcIlwiIDogU3RyaW5nLnByb3RvdHlwZS50cmltLmNhbGwoc3RyKTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICByZXR1cm4gc3RyLnJlcGxhY2UoLyheXFxzKil8KFxccyokKS9nLCBcIlwiKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgdS50cmltQWxsID0gZnVuY3Rpb24oc3RyKXtcbiAgICAgICAgcmV0dXJuIHN0ci5yZXBsYWNlKC9cXHMqL2csJycpO1xuICAgIH07XG4gICAgdS5pc0VsZW1lbnQgPSBmdW5jdGlvbihvYmope1xuICAgICAgICByZXR1cm4gISEob2JqICYmIG9iai5ub2RlVHlwZSA9PSAxKTtcbiAgICB9O1xuICAgIHUuaXNBcnJheSA9IGZ1bmN0aW9uKG9iail7XG4gICAgICAgIGlmKEFycmF5LmlzQXJyYXkpe1xuICAgICAgICAgICAgcmV0dXJuIEFycmF5LmlzQXJyYXkob2JqKTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICByZXR1cm4gb2JqIGluc3RhbmNlb2YgQXJyYXk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHUuaXNFbXB0eU9iamVjdCA9IGZ1bmN0aW9uKG9iail7XG4gICAgICAgIGlmKEpTT04uc3RyaW5naWZ5KG9iaikgPT09ICd7fScpe1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG4gICAgdS5hZGRFdnQgPSBmdW5jdGlvbihlbCwgbmFtZSwgZm4sIHVzZUNhcHR1cmUpe1xuICAgICAgICBpZighdS5pc0VsZW1lbnQoZWwpKXtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignJGFwaS5hZGRFdnQgRnVuY3Rpb24gbmVlZCBlbCBwYXJhbSwgZWwgcGFyYW0gbXVzdCBiZSBET00gRWxlbWVudCcpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHVzZUNhcHR1cmUgPSB1c2VDYXB0dXJlIHx8IGZhbHNlO1xuICAgICAgICBpZihlbC5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgICAgICBlbC5hZGRFdmVudExpc3RlbmVyKG5hbWUsIGZuLCB1c2VDYXB0dXJlKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgdS5ybUV2dCA9IGZ1bmN0aW9uKGVsLCBuYW1lLCBmbiwgdXNlQ2FwdHVyZSl7XG4gICAgICAgIGlmKCF1LmlzRWxlbWVudChlbCkpe1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCckYXBpLnJtRXZ0IEZ1bmN0aW9uIG5lZWQgZWwgcGFyYW0sIGVsIHBhcmFtIG11c3QgYmUgRE9NIEVsZW1lbnQnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB1c2VDYXB0dXJlID0gdXNlQ2FwdHVyZSB8fCBmYWxzZTtcbiAgICAgICAgaWYgKGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgICAgIGVsLnJlbW92ZUV2ZW50TGlzdGVuZXIobmFtZSwgZm4sIHVzZUNhcHR1cmUpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICB1Lm9uZSA9IGZ1bmN0aW9uKGVsLCBuYW1lLCBmbiwgdXNlQ2FwdHVyZSl7XG4gICAgICAgIGlmKCF1LmlzRWxlbWVudChlbCkpe1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCckYXBpLm9uZSBGdW5jdGlvbiBuZWVkIGVsIHBhcmFtLCBlbCBwYXJhbSBtdXN0IGJlIERPTSBFbGVtZW50Jyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdXNlQ2FwdHVyZSA9IHVzZUNhcHR1cmUgfHwgZmFsc2U7XG4gICAgICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICAgICAgdmFyIGNiID0gZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGZuICYmIGZuKCk7XG4gICAgICAgICAgICB0aGF0LnJtRXZ0KGVsLCBuYW1lLCBjYiwgdXNlQ2FwdHVyZSk7XG4gICAgICAgIH07XG4gICAgICAgIHRoYXQuYWRkRXZ0KGVsLCBuYW1lLCBjYiwgdXNlQ2FwdHVyZSk7XG4gICAgfTtcbiAgICB1LmRvbSA9IGZ1bmN0aW9uKGVsLCBzZWxlY3Rvcil7XG4gICAgICAgIGlmKGFyZ3VtZW50cy5sZW5ndGggPT09IDEgJiYgdHlwZW9mIGFyZ3VtZW50c1swXSA9PSAnc3RyaW5nJyl7XG4gICAgICAgICAgICBpZihkb2N1bWVudC5xdWVyeVNlbGVjdG9yKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcihhcmd1bWVudHNbMF0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9ZWxzZSBpZihhcmd1bWVudHMubGVuZ3RoID09PSAyKXtcbiAgICAgICAgICAgIGlmKGVsLnF1ZXJ5U2VsZWN0b3Ipe1xuICAgICAgICAgICAgICAgIHJldHVybiBlbC5xdWVyeVNlbGVjdG9yKHNlbGVjdG9yKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgdS5kb21BbGwgPSBmdW5jdGlvbihlbCwgc2VsZWN0b3Ipe1xuICAgICAgICBpZihhcmd1bWVudHMubGVuZ3RoID09PSAxICYmIHR5cGVvZiBhcmd1bWVudHNbMF0gPT0gJ3N0cmluZycpe1xuICAgICAgICAgICAgaWYoZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCl7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYXJndW1lbnRzWzBdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfWVsc2UgaWYoYXJndW1lbnRzLmxlbmd0aCA9PT0gMil7XG4gICAgICAgICAgICBpZihlbC5xdWVyeVNlbGVjdG9yQWxsKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gZWwucXVlcnlTZWxlY3RvckFsbChzZWxlY3Rvcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHUuYnlJZCA9IGZ1bmN0aW9uKGlkKXtcbiAgICAgICAgcmV0dXJuIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGlkKTtcbiAgICB9O1xuICAgIHUuZmlyc3QgPSBmdW5jdGlvbihlbCwgc2VsZWN0b3Ipe1xuICAgICAgICBpZihhcmd1bWVudHMubGVuZ3RoID09PSAxKXtcbiAgICAgICAgICAgIGlmKCF1LmlzRWxlbWVudChlbCkpe1xuICAgICAgICAgICAgICAgIGNvbnNvbGUud2FybignJGFwaS5maXJzdCBGdW5jdGlvbiBuZWVkIGVsIHBhcmFtLCBlbCBwYXJhbSBtdXN0IGJlIERPTSBFbGVtZW50Jyk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGVsLmNoaWxkcmVuWzBdO1xuICAgICAgICB9XG4gICAgICAgIGlmKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZG9tKGVsLCBzZWxlY3RvcisnOmZpcnN0LWNoaWxkJyk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHUubGFzdCA9IGZ1bmN0aW9uKGVsLCBzZWxlY3Rvcil7XG4gICAgICAgIGlmKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpe1xuICAgICAgICAgICAgaWYoIXUuaXNFbGVtZW50KGVsKSl7XG4gICAgICAgICAgICAgICAgY29uc29sZS53YXJuKCckYXBpLmxhc3QgRnVuY3Rpb24gbmVlZCBlbCBwYXJhbSwgZWwgcGFyYW0gbXVzdCBiZSBET00gRWxlbWVudCcpO1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBjaGlsZHJlbiA9IGVsLmNoaWxkcmVuO1xuICAgICAgICAgICAgcmV0dXJuIGNoaWxkcmVuW2NoaWxkcmVuLmxlbmd0aCAtIDFdO1xuICAgICAgICB9XG4gICAgICAgIGlmKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpe1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZG9tKGVsLCBzZWxlY3RvcisnOmxhc3QtY2hpbGQnKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgdS5lcSA9IGZ1bmN0aW9uKGVsLCBpbmRleCl7XG4gICAgICAgIHJldHVybiB0aGlzLmRvbShlbCwgJzpudGgtY2hpbGQoJysgaW5kZXggKycpJyk7XG4gICAgfTtcbiAgICB1Lm5vdCA9IGZ1bmN0aW9uKGVsLCBzZWxlY3Rvcil7XG4gICAgICAgIHJldHVybiB0aGlzLmRvbUFsbChlbCwgJzpub3QoJysgc2VsZWN0b3IgKycpJyk7XG4gICAgfTtcbiAgICB1LnByZXYgPSBmdW5jdGlvbihlbCl7XG4gICAgICAgIGlmKCF1LmlzRWxlbWVudChlbCkpe1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCckYXBpLnByZXYgRnVuY3Rpb24gbmVlZCBlbCBwYXJhbSwgZWwgcGFyYW0gbXVzdCBiZSBET00gRWxlbWVudCcpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBub2RlID0gZWwucHJldmlvdXNTaWJsaW5nO1xuICAgICAgICBpZihub2RlLm5vZGVUeXBlICYmIG5vZGUubm9kZVR5cGUgPT09IDMpe1xuICAgICAgICAgICAgbm9kZSA9IG5vZGUucHJldmlvdXNTaWJsaW5nO1xuICAgICAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHUubmV4dCA9IGZ1bmN0aW9uKGVsKXtcbiAgICAgICAgaWYoIXUuaXNFbGVtZW50KGVsKSl7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJyRhcGkubmV4dCBGdW5jdGlvbiBuZWVkIGVsIHBhcmFtLCBlbCBwYXJhbSBtdXN0IGJlIERPTSBFbGVtZW50Jyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG5vZGUgPSBlbC5uZXh0U2libGluZztcbiAgICAgICAgaWYobm9kZS5ub2RlVHlwZSAmJiBub2RlLm5vZGVUeXBlID09PSAzKXtcbiAgICAgICAgICAgIG5vZGUgPSBub2RlLm5leHRTaWJsaW5nO1xuICAgICAgICAgICAgcmV0dXJuIG5vZGU7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHUuY2xvc2VzdCA9IGZ1bmN0aW9uKGVsLCBzZWxlY3Rvcil7XG4gICAgICAgIGlmKCF1LmlzRWxlbWVudChlbCkpe1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCckYXBpLmNsb3Nlc3QgRnVuY3Rpb24gbmVlZCBlbCBwYXJhbSwgZWwgcGFyYW0gbXVzdCBiZSBET00gRWxlbWVudCcpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBkb21zLCB0YXJnZXREb207XG4gICAgICAgIHZhciBpc1NhbWUgPSBmdW5jdGlvbihkb21zLCBlbCl7XG4gICAgICAgICAgICB2YXIgaSA9IDAsIGxlbiA9IGRvbXMubGVuZ3RoO1xuICAgICAgICAgICAgZm9yKGk7IGk8bGVuOyBpKyspe1xuICAgICAgICAgICAgICAgIGlmKGRvbXNbaV0uaXNFcXVhbE5vZGUoZWwpKXtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRvbXNbaV07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9O1xuICAgICAgICB2YXIgdHJhdmVyc2FsID0gZnVuY3Rpb24oZWwsIHNlbGVjdG9yKXtcbiAgICAgICAgICAgIGRvbXMgPSB1LmRvbUFsbChlbC5wYXJlbnROb2RlLCBzZWxlY3Rvcik7XG4gICAgICAgICAgICB0YXJnZXREb20gPSBpc1NhbWUoZG9tcywgZWwpO1xuICAgICAgICAgICAgd2hpbGUoIXRhcmdldERvbSl7XG4gICAgICAgICAgICAgICAgZWwgPSBlbC5wYXJlbnROb2RlO1xuICAgICAgICAgICAgICAgIGlmKGVsICE9IG51bGwgJiYgZWwubm9kZVR5cGUgPT0gZWwuRE9DVU1FTlRfTk9ERSl7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdHJhdmVyc2FsKGVsLCBzZWxlY3Rvcik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHJldHVybiB0YXJnZXREb207XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIHRyYXZlcnNhbChlbCwgc2VsZWN0b3IpO1xuICAgIH07XG4gICAgdS5jb250YWlucyA9IGZ1bmN0aW9uKHBhcmVudCxlbCl7XG4gICAgICAgIHZhciBtYXJrID0gZmFsc2U7XG4gICAgICAgIGlmKGVsID09PSBwYXJlbnQpe1xuICAgICAgICAgICAgbWFyayA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm4gbWFyaztcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICBkb3tcbiAgICAgICAgICAgICAgICBlbCA9IGVsLnBhcmVudE5vZGU7XG4gICAgICAgICAgICAgICAgaWYoZWwgPT09IHBhcmVudCl7XG4gICAgICAgICAgICAgICAgICAgIG1hcmsgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbWFyaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9d2hpbGUoZWwgPT09IGRvY3VtZW50LmJvZHkgfHwgZWwgPT09IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudCk7XG5cbiAgICAgICAgICAgIHJldHVybiBtYXJrO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgIH07XG4gICAgdS5yZW1vdmUgPSBmdW5jdGlvbihlbCl7XG4gICAgICAgIGlmKGVsICYmIGVsLnBhcmVudE5vZGUpe1xuICAgICAgICAgICAgZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHUuYXR0ciA9IGZ1bmN0aW9uKGVsLCBuYW1lLCB2YWx1ZSl7XG4gICAgICAgIGlmKCF1LmlzRWxlbWVudChlbCkpe1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCckYXBpLmF0dHIgRnVuY3Rpb24gbmVlZCBlbCBwYXJhbSwgZWwgcGFyYW0gbXVzdCBiZSBET00gRWxlbWVudCcpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmKGFyZ3VtZW50cy5sZW5ndGggPT0gMil7XG4gICAgICAgICAgICByZXR1cm4gZWwuZ2V0QXR0cmlidXRlKG5hbWUpO1xuICAgICAgICB9ZWxzZSBpZihhcmd1bWVudHMubGVuZ3RoID09IDMpe1xuICAgICAgICAgICAgZWwuc2V0QXR0cmlidXRlKG5hbWUsIHZhbHVlKTtcbiAgICAgICAgICAgIHJldHVybiBlbDtcbiAgICAgICAgfVxuICAgIH07XG4gICAgdS5yZW1vdmVBdHRyID0gZnVuY3Rpb24oZWwsIG5hbWUpe1xuICAgICAgICBpZighdS5pc0VsZW1lbnQoZWwpKXtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignJGFwaS5yZW1vdmVBdHRyIEZ1bmN0aW9uIG5lZWQgZWwgcGFyYW0sIGVsIHBhcmFtIG11c3QgYmUgRE9NIEVsZW1lbnQnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZihhcmd1bWVudHMubGVuZ3RoID09PSAyKXtcbiAgICAgICAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZShuYW1lKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgdS5oYXNDbHMgPSBmdW5jdGlvbihlbCwgY2xzKXtcbiAgICAgICAgaWYoIXUuaXNFbGVtZW50KGVsKSl7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJyRhcGkuaGFzQ2xzIEZ1bmN0aW9uIG5lZWQgZWwgcGFyYW0sIGVsIHBhcmFtIG11c3QgYmUgRE9NIEVsZW1lbnQnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZihlbC5jbGFzc05hbWUuaW5kZXhPZihjbHMpID4gLTEpe1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgfTtcbiAgICB1LmFkZENscyA9IGZ1bmN0aW9uKGVsLCBjbHMpe1xuICAgICAgICBpZighdS5pc0VsZW1lbnQoZWwpKXtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignJGFwaS5hZGRDbHMgRnVuY3Rpb24gbmVlZCBlbCBwYXJhbSwgZWwgcGFyYW0gbXVzdCBiZSBET00gRWxlbWVudCcpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmKCdjbGFzc0xpc3QnIGluIGVsKXtcbiAgICAgICAgICAgIGVsLmNsYXNzTGlzdC5hZGQoY2xzKTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICB2YXIgcHJlQ2xzID0gZWwuY2xhc3NOYW1lO1xuICAgICAgICAgICAgdmFyIG5ld0NscyA9IHByZUNscyArJyAnKyBjbHM7XG4gICAgICAgICAgICBlbC5jbGFzc05hbWUgPSBuZXdDbHM7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGVsO1xuICAgIH07XG4gICAgdS5yZW1vdmVDbHMgPSBmdW5jdGlvbihlbCwgY2xzKXtcbiAgICAgICAgaWYoIXUuaXNFbGVtZW50KGVsKSl7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJyRhcGkucmVtb3ZlQ2xzIEZ1bmN0aW9uIG5lZWQgZWwgcGFyYW0sIGVsIHBhcmFtIG11c3QgYmUgRE9NIEVsZW1lbnQnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZignY2xhc3NMaXN0JyBpbiBlbCl7XG4gICAgICAgICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKGNscyk7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgdmFyIHByZUNscyA9IGVsLmNsYXNzTmFtZTtcbiAgICAgICAgICAgIHZhciBuZXdDbHMgPSBwcmVDbHMucmVwbGFjZShjbHMsICcnKTtcbiAgICAgICAgICAgIGVsLmNsYXNzTmFtZSA9IG5ld0NscztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZWw7XG4gICAgfTtcbiAgICB1LnRvZ2dsZUNscyA9IGZ1bmN0aW9uKGVsLCBjbHMpe1xuICAgICAgICBpZighdS5pc0VsZW1lbnQoZWwpKXtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignJGFwaS50b2dnbGVDbHMgRnVuY3Rpb24gbmVlZCBlbCBwYXJhbSwgZWwgcGFyYW0gbXVzdCBiZSBET00gRWxlbWVudCcpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgaWYoJ2NsYXNzTGlzdCcgaW4gZWwpe1xuICAgICAgICAgICAgZWwuY2xhc3NMaXN0LnRvZ2dsZShjbHMpO1xuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIGlmKHUuaGFzQ2xzKGVsLCBjbHMpKXtcbiAgICAgICAgICAgICAgICB1LnJlbW92ZUNscyhlbCwgY2xzKTtcbiAgICAgICAgICAgIH1lbHNle1xuICAgICAgICAgICAgICAgIHUuYWRkQ2xzKGVsLCBjbHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBlbDtcbiAgICB9O1xuICAgIHUudmFsID0gZnVuY3Rpb24oZWwsIHZhbCl7XG4gICAgICAgIGlmKCF1LmlzRWxlbWVudChlbCkpe1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCckYXBpLnZhbCBGdW5jdGlvbiBuZWVkIGVsIHBhcmFtLCBlbCBwYXJhbSBtdXN0IGJlIERPTSBFbGVtZW50Jyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSl7XG4gICAgICAgICAgICBzd2l0Y2goZWwudGFnTmFtZSl7XG4gICAgICAgICAgICAgICAgY2FzZSAnU0VMRUNUJzpcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gZWwub3B0aW9uc1tlbC5zZWxlY3RlZEluZGV4XS52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdJTlBVVCc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlbC52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnVEVYVEFSRUEnOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWwudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpe1xuICAgICAgICAgICAgc3dpdGNoKGVsLnRhZ05hbWUpe1xuICAgICAgICAgICAgICAgIGNhc2UgJ1NFTEVDVCc6XG4gICAgICAgICAgICAgICAgICAgIGVsLm9wdGlvbnNbZWwuc2VsZWN0ZWRJbmRleF0udmFsdWUgPSB2YWw7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBlbDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAnSU5QVVQnOlxuICAgICAgICAgICAgICAgICAgICBlbC52YWx1ZSA9IHZhbDtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGVsO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlICdURVhUQVJFQSc6XG4gICAgICAgICAgICAgICAgICAgIGVsLnZhbHVlID0gdmFsO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZWw7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgIH07XG4gICAgdS5wcmVwZW5kID0gZnVuY3Rpb24oZWwsIGh0bWwpe1xuICAgICAgICBpZighdS5pc0VsZW1lbnQoZWwpKXtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignJGFwaS5wcmVwZW5kIEZ1bmN0aW9uIG5lZWQgZWwgcGFyYW0sIGVsIHBhcmFtIG11c3QgYmUgRE9NIEVsZW1lbnQnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBlbC5pbnNlcnRBZGphY2VudEhUTUwoJ2FmdGVyYmVnaW4nLCBodG1sKTtcbiAgICAgICAgcmV0dXJuIGVsO1xuICAgIH07XG4gICAgdS5hcHBlbmQgPSBmdW5jdGlvbihlbCwgaHRtbCl7XG4gICAgICAgIGlmKCF1LmlzRWxlbWVudChlbCkpe1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCckYXBpLmFwcGVuZCBGdW5jdGlvbiBuZWVkIGVsIHBhcmFtLCBlbCBwYXJhbSBtdXN0IGJlIERPTSBFbGVtZW50Jyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZWwuaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmVlbmQnLCBodG1sKTtcbiAgICAgICAgcmV0dXJuIGVsO1xuICAgIH07XG4gICAgdS5iZWZvcmUgPSBmdW5jdGlvbihlbCwgaHRtbCl7XG4gICAgICAgIGlmKCF1LmlzRWxlbWVudChlbCkpe1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCckYXBpLmJlZm9yZSBGdW5jdGlvbiBuZWVkIGVsIHBhcmFtLCBlbCBwYXJhbSBtdXN0IGJlIERPTSBFbGVtZW50Jyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZWwuaW5zZXJ0QWRqYWNlbnRIVE1MKCdiZWZvcmViZWdpbicsIGh0bWwpO1xuICAgICAgICByZXR1cm4gZWw7XG4gICAgfTtcbiAgICB1LmFmdGVyID0gZnVuY3Rpb24oZWwsIGh0bWwpe1xuICAgICAgICBpZighdS5pc0VsZW1lbnQoZWwpKXtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignJGFwaS5hZnRlciBGdW5jdGlvbiBuZWVkIGVsIHBhcmFtLCBlbCBwYXJhbSBtdXN0IGJlIERPTSBFbGVtZW50Jyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgZWwuaW5zZXJ0QWRqYWNlbnRIVE1MKCdhZnRlcmVuZCcsIGh0bWwpO1xuICAgICAgICByZXR1cm4gZWw7XG4gICAgfTtcbiAgICB1Lmh0bWwgPSBmdW5jdGlvbihlbCwgaHRtbCl7XG4gICAgICAgIGlmKCF1LmlzRWxlbWVudChlbCkpe1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCckYXBpLmh0bWwgRnVuY3Rpb24gbmVlZCBlbCBwYXJhbSwgZWwgcGFyYW0gbXVzdCBiZSBET00gRWxlbWVudCcpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmKGFyZ3VtZW50cy5sZW5ndGggPT09IDEpe1xuICAgICAgICAgICAgcmV0dXJuIGVsLmlubmVySFRNTDtcbiAgICAgICAgfWVsc2UgaWYoYXJndW1lbnRzLmxlbmd0aCA9PT0gMil7XG4gICAgICAgICAgICBlbC5pbm5lckhUTUwgPSBodG1sO1xuICAgICAgICAgICAgcmV0dXJuIGVsO1xuICAgICAgICB9XG4gICAgfTtcbiAgICB1LnRleHQgPSBmdW5jdGlvbihlbCwgdHh0KXtcbiAgICAgICAgaWYoIXUuaXNFbGVtZW50KGVsKSl7XG4gICAgICAgICAgICBjb25zb2xlLndhcm4oJyRhcGkudGV4dCBGdW5jdGlvbiBuZWVkIGVsIHBhcmFtLCBlbCBwYXJhbSBtdXN0IGJlIERPTSBFbGVtZW50Jyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSl7XG4gICAgICAgICAgICByZXR1cm4gZWwudGV4dENvbnRlbnQ7XG4gICAgICAgIH1lbHNlIGlmKGFyZ3VtZW50cy5sZW5ndGggPT09IDIpe1xuICAgICAgICAgICAgZWwudGV4dENvbnRlbnQgPSB0eHQ7XG4gICAgICAgICAgICByZXR1cm4gZWw7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHUub2Zmc2V0ID0gZnVuY3Rpb24oZWwpe1xuICAgICAgICBpZighdS5pc0VsZW1lbnQoZWwpKXtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignJGFwaS5vZmZzZXQgRnVuY3Rpb24gbmVlZCBlbCBwYXJhbSwgZWwgcGFyYW0gbXVzdCBiZSBET00gRWxlbWVudCcpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBzbCA9IE1hdGgubWF4KGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zY3JvbGxMZWZ0LCBkb2N1bWVudC5ib2R5LnNjcm9sbExlZnQpO1xuICAgICAgICB2YXIgc3QgPSBNYXRoLm1heChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wLCBkb2N1bWVudC5ib2R5LnNjcm9sbFRvcCk7XG5cbiAgICAgICAgdmFyIHJlY3QgPSBlbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGw6IHJlY3QubGVmdCArIHNsLFxuICAgICAgICAgICAgdDogcmVjdC50b3AgKyBzdCxcbiAgICAgICAgICAgIHc6IGVsLm9mZnNldFdpZHRoLFxuICAgICAgICAgICAgaDogZWwub2Zmc2V0SGVpZ2h0XG4gICAgICAgIH07XG4gICAgfTtcbiAgICB1LmNzcyA9IGZ1bmN0aW9uKGVsLCBjc3Mpe1xuICAgICAgICBpZighdS5pc0VsZW1lbnQoZWwpKXtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignJGFwaS5jc3MgRnVuY3Rpb24gbmVlZCBlbCBwYXJhbSwgZWwgcGFyYW0gbXVzdCBiZSBET00gRWxlbWVudCcpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmKHR5cGVvZiBjc3MgPT0gJ3N0cmluZycgJiYgY3NzLmluZGV4T2YoJzonKSA+IDApe1xuICAgICAgICAgICAgZWwuc3R5bGUgJiYgKGVsLnN0eWxlLmNzc1RleHQgKz0gJzsnICsgY3NzKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgdS5jc3NWYWwgPSBmdW5jdGlvbihlbCwgcHJvcCl7XG4gICAgICAgIGlmKCF1LmlzRWxlbWVudChlbCkpe1xuICAgICAgICAgICAgY29uc29sZS53YXJuKCckYXBpLmNzc1ZhbCBGdW5jdGlvbiBuZWVkIGVsIHBhcmFtLCBlbCBwYXJhbSBtdXN0IGJlIERPTSBFbGVtZW50Jyk7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgaWYoYXJndW1lbnRzLmxlbmd0aCA9PT0gMil7XG4gICAgICAgICAgICB2YXIgY29tcHV0ZWRTdHlsZSA9IHdpbmRvdy5nZXRDb21wdXRlZFN0eWxlKGVsLCBudWxsKTtcbiAgICAgICAgICAgIHJldHVybiBjb21wdXRlZFN0eWxlLmdldFByb3BlcnR5VmFsdWUocHJvcCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHUuanNvblRvU3RyID0gZnVuY3Rpb24oanNvbil7XG4gICAgICAgIGlmKHR5cGVvZiBqc29uID09PSAnb2JqZWN0Jyl7XG4gICAgICAgICAgICByZXR1cm4gSlNPTiAmJiBKU09OLnN0cmluZ2lmeShqc29uKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgdS5zdHJUb0pzb24gPSBmdW5jdGlvbihzdHIpe1xuICAgICAgICBpZih0eXBlb2Ygc3RyID09PSAnc3RyaW5nJyl7XG4gICAgICAgICAgICByZXR1cm4gSlNPTiAmJiBKU09OLnBhcnNlKHN0cik7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHUuc2V0U3RvcmFnZSA9IGZ1bmN0aW9uKGtleSwgdmFsdWUpe1xuICAgICAgICBpZihhcmd1bWVudHMubGVuZ3RoID09PSAyKXtcbiAgICAgICAgICAgIHZhciB2ID0gdmFsdWU7XG4gICAgICAgICAgICBpZih0eXBlb2YgdiA9PSAnb2JqZWN0Jyl7XG4gICAgICAgICAgICAgICAgdiA9IEpTT04uc3RyaW5naWZ5KHYpO1xuICAgICAgICAgICAgICAgIHYgPSAnb2JqLScrIHY7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICB2ID0gJ3N0ci0nKyB2O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdmFyIGxzID0gdXpTdG9yYWdlKCk7XG4gICAgICAgICAgICBpZihscyl7XG4gICAgICAgICAgICAgICAgbHMuc2V0SXRlbShrZXksIHYpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcbiAgICB1LmdldFN0b3JhZ2UgPSBmdW5jdGlvbihrZXkpe1xuICAgICAgICB2YXIgbHMgPSB1elN0b3JhZ2UoKTtcbiAgICAgICAgaWYobHMpe1xuICAgICAgICAgICAgdmFyIHYgPSBscy5nZXRJdGVtKGtleSk7XG4gICAgICAgICAgICBpZighdil7cmV0dXJuO31cbiAgICAgICAgICAgIGlmKHYuaW5kZXhPZignb2JqLScpID09PSAwKXtcbiAgICAgICAgICAgICAgICB2ID0gdi5zbGljZSg0KTtcbiAgICAgICAgICAgICAgICByZXR1cm4gSlNPTi5wYXJzZSh2KTtcbiAgICAgICAgICAgIH1lbHNlIGlmKHYuaW5kZXhPZignc3RyLScpID09PSAwKXtcbiAgICAgICAgICAgICAgICByZXR1cm4gdi5zbGljZSg0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgdS5ybVN0b3JhZ2UgPSBmdW5jdGlvbihrZXkpe1xuICAgICAgICB2YXIgbHMgPSB1elN0b3JhZ2UoKTtcbiAgICAgICAgaWYobHMgJiYga2V5KXtcbiAgICAgICAgICAgIGxzLnJlbW92ZUl0ZW0oa2V5KTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgdS5jbGVhclN0b3JhZ2UgPSBmdW5jdGlvbigpe1xuICAgICAgICB2YXIgbHMgPSB1elN0b3JhZ2UoKTtcbiAgICAgICAgaWYobHMpe1xuICAgICAgICAgICAgbHMuY2xlYXIoKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgIFxuICAgIC8qYnkga2luZyovXG4gICAgdS5maXhJb3M3QmFyID0gZnVuY3Rpb24oZWwpe1xuICAgICAgICBpZighdS5pc0VsZW1lbnQoZWwpKXtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignJGFwaS5maXhJb3M3QmFyIEZ1bmN0aW9uIG5lZWQgZWwgcGFyYW0sIGVsIHBhcmFtIG11c3QgYmUgRE9NIEVsZW1lbnQnKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB2YXIgc3RyRE0gPSBhcGkuc3lzdGVtVHlwZTtcbiAgICAgICAgaWYgKHN0ckRNID09ICdpb3MnKSB7XG4gICAgICAgICAgICB2YXIgc3RyU1YgPSBhcGkuc3lzdGVtVmVyc2lvbjtcbiAgICAgICAgICAgIHZhciBudW1TViA9IHBhcnNlSW50KHN0clNWLDEwKTtcbiAgICAgICAgICAgIHZhciBmdWxsU2NyZWVuID0gYXBpLmZ1bGxTY3JlZW47XG4gICAgICAgICAgICB2YXIgaU9TN1N0YXR1c0JhckFwcGVhcmFuY2UgPSBhcGkuaU9TN1N0YXR1c0JhckFwcGVhcmFuY2U7XG4gICAgICAgICAgICBpZiAobnVtU1YgPj0gNyAmJiAhZnVsbFNjcmVlbiAmJiBpT1M3U3RhdHVzQmFyQXBwZWFyYW5jZSkge1xuICAgICAgICAgICAgICAgIGVsLnN0eWxlLnBhZGRpbmdUb3AgPSAnMjBweCc7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9O1xuICAgIHUuZml4U3RhdHVzQmFyID0gZnVuY3Rpb24oZWwpe1xuICAgICAgICBpZighdS5pc0VsZW1lbnQoZWwpKXtcbiAgICAgICAgICAgIGNvbnNvbGUud2FybignJGFwaS5maXhTdGF0dXNCYXIgRnVuY3Rpb24gbmVlZCBlbCBwYXJhbSwgZWwgcGFyYW0gbXVzdCBiZSBET00gRWxlbWVudCcpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHZhciBzeXNUeXBlID0gYXBpLnN5c3RlbVR5cGU7XG4gICAgICAgIGlmKHN5c1R5cGUgPT0gJ2lvcycpe1xuICAgICAgICAgICAgdS5maXhJb3M3QmFyKGVsKTtcbiAgICAgICAgfWVsc2UgaWYoc3lzVHlwZSA9PSAnYW5kcm9pZCcpe1xuICAgICAgICAgICAgdmFyIHZlciA9IGFwaS5zeXN0ZW1WZXJzaW9uO1xuICAgICAgICAgICAgdmVyID0gcGFyc2VGbG9hdCh2ZXIpO1xuICAgICAgICAgICAgaWYodmVyID49IDQuNCl7XG4gICAgICAgICAgICAgICAgZWwuc3R5bGUucGFkZGluZ1RvcCA9ICcyNXB4JztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG4gICAgdS50b2FzdCA9IGZ1bmN0aW9uKHRpdGxlLCB0ZXh0LCB0aW1lKXtcbiAgICAgICAgdmFyIG9wdHMgPSB7fTtcbiAgICAgICAgdmFyIHNob3cgPSBmdW5jdGlvbihvcHRzLCB0aW1lKXtcbiAgICAgICAgICAgIGFwaS5zaG93UHJvZ3Jlc3Mob3B0cyk7XG4gICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgYXBpLmhpZGVQcm9ncmVzcygpO1xuICAgICAgICAgICAgfSx0aW1lKTtcbiAgICAgICAgfTtcbiAgICAgICAgaWYoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSl7XG4gICAgICAgICAgICB2YXIgdGltZSA9IHRpbWUgfHwgNTAwO1xuICAgICAgICAgICAgaWYodHlwZW9mIHRpdGxlID09PSAnbnVtYmVyJyl7XG4gICAgICAgICAgICAgICAgdGltZSA9IHRpdGxlO1xuICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgb3B0cy50aXRsZSA9IHRpdGxlKycnO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2hvdyhvcHRzLCB0aW1lKTtcbiAgICAgICAgfWVsc2UgaWYoYXJndW1lbnRzLmxlbmd0aCA9PT0gMil7XG4gICAgICAgICAgICB2YXIgdGltZSA9IHRpbWUgfHwgNTAwO1xuICAgICAgICAgICAgdmFyIHRleHQgPSB0ZXh0O1xuICAgICAgICAgICAgaWYodHlwZW9mIHRleHQgPT09IFwibnVtYmVyXCIpe1xuICAgICAgICAgICAgICAgIHZhciB0bXAgPSB0ZXh0O1xuICAgICAgICAgICAgICAgIHRpbWUgPSB0bXA7XG4gICAgICAgICAgICAgICAgdGV4dCA9IG51bGw7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZih0aXRsZSl7XG4gICAgICAgICAgICAgICAgb3B0cy50aXRsZSA9IHRpdGxlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYodGV4dCl7XG4gICAgICAgICAgICAgICAgb3B0cy50ZXh0ID0gdGV4dDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNob3cob3B0cywgdGltZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYodGl0bGUpe1xuICAgICAgICAgICAgb3B0cy50aXRsZSA9IHRpdGxlO1xuICAgICAgICB9XG4gICAgICAgIGlmKHRleHQpe1xuICAgICAgICAgICAgb3B0cy50ZXh0ID0gdGV4dDtcbiAgICAgICAgfVxuICAgICAgICB0aW1lID0gdGltZSB8fCA1MDA7XG4gICAgICAgIHNob3cob3B0cywgdGltZSk7XG4gICAgfTtcbiAgICB1LnBvc3QgPSBmdW5jdGlvbigvKnVybCxkYXRhLGZuU3VjLGRhdGFUeXBlKi8pe1xuICAgICAgICB2YXIgYXJnc1RvSnNvbiA9IHBhcnNlQXJndW1lbnRzLmFwcGx5KG51bGwsIGFyZ3VtZW50cyk7XG4gICAgICAgIHZhciBqc29uID0ge307XG4gICAgICAgIHZhciBmblN1YyA9IGFyZ3NUb0pzb24uZm5TdWM7XG4gICAgICAgIGFyZ3NUb0pzb24udXJsICYmIChqc29uLnVybCA9IGFyZ3NUb0pzb24udXJsKTtcbiAgICAgICAgYXJnc1RvSnNvbi5kYXRhICYmIChqc29uLmRhdGEgPSBhcmdzVG9Kc29uLmRhdGEpO1xuICAgICAgICBpZihhcmdzVG9Kc29uLmRhdGFUeXBlKXtcbiAgICAgICAgICAgIHZhciB0eXBlID0gYXJnc1RvSnNvbi5kYXRhVHlwZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gJ3RleHQnfHx0eXBlID09ICdqc29uJykge1xuICAgICAgICAgICAgICAgIGpzb24uZGF0YVR5cGUgPSB0eXBlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIGpzb24uZGF0YVR5cGUgPSAnanNvbic7XG4gICAgICAgIH1cbiAgICAgICAganNvbi5tZXRob2QgPSAncG9zdCc7XG4gICAgICAgIGFwaS5hamF4KGpzb24sXG4gICAgICAgICAgICBmdW5jdGlvbihyZXQsZXJyKXtcbiAgICAgICAgICAgICAgICBpZiAocmV0KSB7XG4gICAgICAgICAgICAgICAgICAgIGZuU3VjICYmIGZuU3VjKHJldCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICApO1xuICAgIH07XG4gICAgdS5nZXQgPSBmdW5jdGlvbigvKnVybCxmblN1YyxkYXRhVHlwZSovKXtcbiAgICAgICAgdmFyIGFyZ3NUb0pzb24gPSBwYXJzZUFyZ3VtZW50cy5hcHBseShudWxsLCBhcmd1bWVudHMpO1xuICAgICAgICB2YXIganNvbiA9IHt9O1xuICAgICAgICB2YXIgZm5TdWMgPSBhcmdzVG9Kc29uLmZuU3VjO1xuICAgICAgICBhcmdzVG9Kc29uLnVybCAmJiAoanNvbi51cmwgPSBhcmdzVG9Kc29uLnVybCk7XG4gICAgICAgIC8vYXJnc1RvSnNvbi5kYXRhICYmIChqc29uLmRhdGEgPSBhcmdzVG9Kc29uLmRhdGEpO1xuICAgICAgICBpZihhcmdzVG9Kc29uLmRhdGFUeXBlKXtcbiAgICAgICAgICAgIHZhciB0eXBlID0gYXJnc1RvSnNvbi5kYXRhVHlwZS50b0xvd2VyQ2FzZSgpO1xuICAgICAgICAgICAgaWYgKHR5cGUgPT0gJ3RleHQnfHx0eXBlID09ICdqc29uJykge1xuICAgICAgICAgICAgICAgIGpzb24uZGF0YVR5cGUgPSB0eXBlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgIGpzb24uZGF0YVR5cGUgPSAndGV4dCc7XG4gICAgICAgIH1cbiAgICAgICAganNvbi5tZXRob2QgPSAnZ2V0JztcbiAgICAgICAgYXBpLmFqYXgoanNvbixcbiAgICAgICAgICAgIGZ1bmN0aW9uKHJldCxlcnIpe1xuICAgICAgICAgICAgICAgIGlmIChyZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgZm5TdWMgJiYgZm5TdWMocmV0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICk7XG4gICAgfTtcblxuLyplbmQqL1xuICAgIFxuXG4gICAgd2luZG93LiRhcGkgPSB1O1xuXG59KSh3aW5kb3cpO1xuXG5cbiJdfQ==
