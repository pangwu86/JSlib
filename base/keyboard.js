(function ($z) {

    var kb = $z.makePackage('keyboard');

    kb.keymap = (function () {

        var codeMap = {
            "112": ["f1"],
            "113": ["f2"],
            "114": ["f3"],
            "115": ["f4"],
            "116": ["f5"],
            "117": ["f6"],
            "118": ["f7"],
            "119": ["f8"],
            "120": ["f9"],
            "121": ["f10"],
            "122": ["f11"],
            "123": ["f12"]
        };

        return codeMap;
    })();


})($z);