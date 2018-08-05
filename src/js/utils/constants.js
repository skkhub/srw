//兼容代码可以这样子写
let screenWidth = window.innerWidth
let screenHeight = window.innerHeight
if (typeof screenWidth != 'number') {       //如果类型不为number,表示该浏览器不支持innerWidth属性

    if (document.compatMode == 'CSS1Compat') {          //CSS1Compat：判断是否为标准兼容模式。

        screenWidth = document.documentElement.clientWidth;

        screenHeight = document.docuementElement.clientHeight;

    } else {  //不是标准模式,则有可能是IE6或及其以下版本(早期的浏览器对css进行解析时，并未遵守W3C标准)

        screenWidth = document.body.clientWidth;            //网页可见区域宽

        screenHeight = document.body.clientHeight;          //网页可见区域高
    }
}

export const SCREEN_WIDTH = screenWidth
export const SCREEN_HEIGHT = screenHeight;

export const GRID_LENGTH = 48

export const DIALOG_SRC = 'images/Common.png'

export const DEFAULT_COLOR = 'gray'

export const BASE_FONT_SIZE = screenWidth / 30
