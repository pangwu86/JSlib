// util
(function ($z) {

    var err = $z.makePackage("err");

    err.new = function (errorMsg) {
        throw new Error(errorMsg);
    };

    err.noImpl = function () {
        err.new("Not Implement Yet!");
    };

})($z);