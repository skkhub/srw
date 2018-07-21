import {GRID_LENGTH} from './constants'

export function getLen(len) {
    return GRID_LENGTH * len
}

export let deepCopy = o => {
    if (o instanceof Array) {
        var n = [];
        for (var i = 0; i < o.length; ++i) {
            n[i] = deepCopy(o[i]);
        }
        return n;
    } else if (o instanceof Function) {
        var n = new Function("return " + o.toString())();
        return n
    } else if (o instanceof Object) {
        var n = {}
        for (var i in o) {
            n[i] = deepCopy(o[i]);
        }
        return n;
    } else {
        return o;
    }
}
