// util
(function ($z) {

    var log = $z.makePackage("log");

    log._log = function (msg) {
        if ($z.hasConsole) {
            console.log(msg);
        }
    };

    log.i = function (msg) {
        // TODO 根据log级别做处理
        log._log(msg);
    };

})($z);
