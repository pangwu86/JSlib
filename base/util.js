// 定义包
window.makePackage = function (pkg) {
    var plist = pkg.split(".");
    var cpkg = window.$z;
    for (var i = 0; i < plist.length; i++) {
        var pnm = plist[i];
        if (cpkg[pnm] == undefined) {
            cpkg[pnm] = {};
        }
        cpkg = cpkg[pnm];
    }
    return cpkg;
}
// 最外层包名
window.$z = {};
// 判断是否有console对象可用
$z.hasConsole = (console !== undefined);
$z.hasTrim = ("trim".trim !== undefined);

$z.util = {
    isBlank: function (str) {
        if (str == null || str == undefined) {
            return true;
        } else if (typeof str == 'string' && $z.util.trim(str) == "") {
            return true;
        }
        return false;
    },
    isEmpty: function (obj) {
        if (obj == null || obj == undefined) {
            return true;
        }
        var name;
        for (name in obj) {
            return false;
        }
        return true;
    },
    isFunction: function (fn) {
        if (fn == null || fn == undefined) {
            return false;
        }
        return typeof fn === 'function';
    },
    trim: function (str) {
        if (str == null || str == undefined) {
            return '';
        }
        if ($z.hasTrim) {
            return str.trim();
        } else {
            // 使用正则去掉前后的空格
            return str.replace(/(^\s*)|(\s*$)/g, "");
        }
    }
};