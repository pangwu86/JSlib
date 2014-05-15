$z.browser = {
    /**
     * 获得窗口大小
     *
     * @returns {*}
     */
    winsz: function () {
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
    }
};
