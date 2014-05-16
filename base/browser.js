(function ($z) {

    var brow = $z.makePackage('browser');

    brow.winsz = function () {
        if (window.innerWidth) {
            return {
                width: window.innerWidth,
                height: window.innerHeight
            };
        }
        if (document.documentElement) {
            return {
                width: document.documentElement.clientWidth,
                height: document.documentElement.clientHeight
            };
        }
        return {
            width: document.body.clientWidth,
            height: document.body.clientHeight
        };
    };

})($z);

