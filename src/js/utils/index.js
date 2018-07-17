//兼容代码可以这样子写
const SCREEN_WIDTH = window.innerWidth
const SCREEN_HEIGHT = window.innerHeight;

if (typeof SCREEN_WIDTH != 'number') {       //如果类型不为number,表示该浏览器不支持innerWidth属性

    if (document.compatMode == 'CSS1Compat') {          //CSS1Compat：判断是否为标准兼容模式。

        SCREEN_WIDTH = document.documentElement.clientWidth;

        SCREEN_HEIGHT = document.docuementElement.clientHeight;

    } else {  //不是标准模式,则有可能是IE6或及其以下版本(早期的浏览器对css进行解析时，并未遵守W3C标准)

        SCREEN_WIDTH = document.body.clientWidth;            //网页可见区域宽

        SCREEN_HEIGHT = document.body.clientHeight;          //网页可见区域高
    }
}

window.SCREEN_WIDTH = SCREEN_WIDTH
window.SCREEN_HEIGHT = SCREEN_HEIGHT

window.GRID_LENGTH = 64

window.getLen = function(len) {
  return window.GRID_LENGTH * len
}