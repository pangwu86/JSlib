(function (window) {

    window._$z = window.$z;
    window.$z = {};

    // 判断是否已经有人用过$z这个名字了
    $z.conflicted = (_$z !== undefined);

    // 判断是否有console对象可用
    $z.hasConsole = (console !== undefined);
    $z.hasTrim = ("trim".trim !== undefined);

    // 生成对应的命名空间
    $z.makePackage = function (pkg) {
        var plist = pkg.split(".");
        var cpkg = $z;
        for (var i = 0; i < plist.length; i++) {
            var pnm = plist[i];
            if (cpkg[pnm] == undefined) {
                cpkg[pnm] = {};
            }
            cpkg = cpkg[pnm];
        }
        return cpkg;
    };

    var util = $z.makePackage("util");

    // ====================================== 对象, 方法

    util.isEmpty = function (obj) {
        if (obj == null || obj == undefined) {
            return true;
        }
        var name;
        for (name in obj) {
            return false;
        }
        return true;
    };

    util.isFunction = function (fn) {
        if (fn == null || fn == undefined) {
            return false;
        }
        return typeof fn === 'function';
    };

    // ====================================== 字符串相关

    util.isBlank = function (str) {
        if (str == null || str == undefined) {
            return true;
        } else if (typeof str == 'string' && util.trim(str) == "") {
            return true;
        }
        return false;
    };

    util.trim = function (str) {
        if (str == null || str == undefined) {
            return '';
        }
        if ($z.hasTrim) {
            return str.trim();
        } else {
            // 使用正则去掉前后的空格
            return str.replace(/(^\s*)|(\s*$)/g, "");
        }
    };

    // ====================================== json 转换

    util.toJson = function (str) {
        // eval的方法, 会执行里面的js代码, 比较有危险性, 可能会被注入
        // return eval("(" + str + ")");
        return JSON.parse(str);
    };

    util.fromJson = function (obj) {
        return JSON.stringify(obj);
    };

})(window);