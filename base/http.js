$z.http = {
    constant: {
        method: {
            GET: 'GET',
            POST: 'POST'
        },
        contentType: {
            form: 'application/x-www-form-urlencoded',
            file: 'multipart/form-data'
        },
        comet: {
            endline: '\n-[comet]-\n'
        },
        ajax: {
            useAjaxReturn: true,
            useJson: true
        }
    },
    /**
     * 生成一个新的XMLHttpRequest对象, 兼容IE
     *
     * @returns {XMLHttpRequest}
     */
    xhr: function () {
        if (window.XMLHttpRequest === undefined) {
            window.XMLHttpRequest = function () {
                // IE5和IE6不支持, 需要使用ActivieX对象进行构建
                try {
                    return new ActiveXObject("Msxml2.XMLHTTP.6.0");
                } catch (e1) {
                    try {
                        return new ActiveXObject("Msxml2.XMLHTTP.3.0");
                    } catch (e2) {
                        throw new Error("XMLHttpRequest is not supported");
                    }
                }
            };
        }
        return new XMLHttpRequest();
    },
    //================================================ 长连接部分
    /**
     * 在进行长连接前, 对opt做对应的检查与处理
     *
     * @param opt
     */
    beforeComet: function (opt) {
        // 检查
        if ($z.util.isBlank(opt.url)) {
            $z.err.new("url is empty");
        }
        if (!$z.util.isFunction(opt.onChange)) {
            $z.err.new("onChange is not defined");
        }
        if ($z.util.isBlank(opt.contentType)) {
            opt.contentType = $z.http.constant.contentType.form;
        }
        if ($z.util.isBlank(opt.method)) {
            opt.method = $z.http.constant.method.GET;
        }
        // 准备
        if (!$z.util.isEmpty(opt.data)) {
            var params = [];
            var key;
            for (key in opt.data) {
                params.push(key + "=" + encodeURIComponent(opt.data[key]));
            }
            opt.urlparams = params.join('&');
        }
        opt.useEndline = (opt.endline != undefined);
        opt.useGet = (opt.method.toUpperCase() == $z.http.constant.method.GET);
        if (opt.useGet) {
            opt.body = null;
            if (!$z.util.isBlank(opt.urlparams)) {
                opt.url += '?' + opt.urlparams;
            }
        } else {
            opt.body = opt.urlparams;
        }
    },
    /**
     * 发送一个长连接
     *
     * @param opt
     *
     *  {
     *      url         : 'http://xxx.xxx.xxx:8080',
     *      method      : 'GET',
     *      contentType : 'application/x-www-form-urlencoded',
     *      data        : {},
     *      endline     : '\n--[comet]--\n',
     *      onChange    : function(changeTxt){
     *          // changeTxt 是每次更新的内容
     *          // 更新文本的完整性根据endline是否设置进行分割
     *      },
     *      onFinish    : function(respTxt){
     *          // respTxt 是全部的返回内容
     *      },
     *      onError     : function(xhr) {
     *          // 发生错误时, 也就是 status != 200
     *      }
     *  }
     *
     */
    comet: function (opt) {
        $z.http.beforeComet(opt);
        // 发起连接
        var xhr = $z.http.xhr();
        var respLength = 0;
        var respTmp = '';
        xhr.onreadystatechange = function (e) {
            if (xhr.readyState >= 3) {
                var respTxt = xhr.responseText.substr(respLength);
                if (respTxt.length > 0) {
                    respLength += respTxt.length;
                    if (opt.useEndline) {
                        var fpos = respTxt.indexOf(opt.endline);
                        if (fpos < 0) {
                            // 没有拿到完整的数据等待下次
                            respTmp = respTxt;
                        } else {
                            // 尝试拼装数据
                            var realRespTxt = respTmp + respTxt.substr(0, fpos);
                            respTmp = respTxt.substr(fpos + opt.endline.length);
                            respTxt = realRespTxt;
                        }
                    }
                    respTxt = $z.util.trim(respTxt);
                    if (respTxt.length > 0) {
                        opt.onChange(respTxt);
                    }
                }
            }
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    if (opt.onFinish) {
                        opt.onFinish($z.util.trim(xhr.responseText));
                    }
                } else {
                    if (opt.onError) {
                        opt.onError(xhr);
                    } else {
                        $z.err.new("http " + xhr.status + "\n" + xhr.responseText);
                    }
                }
            }
        };
        xhr.open(opt.useGet ? "GET" : "POST", opt.url);
        xhr.setRequestHeader('Content-type', opt.contentType);
        xhr.send(opt.body);
    },
    /**
     * 长连接, 需要一直连接, 断开后会自动重连
     *
     * @param opt
     */
    cometES: function (opt) {
        // 仅仅支持GET
        opt.method = $z.http.constant.method.GET;
        $z.http.beforeComet(opt);

        if (window.EventSource === undefined) {
            $z.err.new("EventSource is not supported");
            // TODO 使用xhr模拟EventSource
        }
        var evts = new EventSource(opt.url);
        evts.onmessage = function (e) {
            opt.onChange(e.data);
        };
        evts.onerror = function (e) {
            if (opt.onError) {
                opt.onError(e);
            } else {
                $z.err.new("EventSource has err, maybe connect is break");
            }
        };
    },
    //================================================ ajax请求部分
    /**
     * 设置ajax成功时,对返回内容的处理方式
     *
     * @param opt
     *
     * {
     *      useAjaxReturn   : true | false,
     *      useJson         : true | false
     * }
     *
     */
    setAajx: function(opt){
        if(opt.useAjaxReturn !== undefined){
             $z.http.constant.ajax.useAjaxReturn = opt.useAjaxReturn;
        }
        if(opt.useJson !== undefined){
             $z.http.constant.ajax.useJson = opt.useJson;
        }
    },
    get: function (url, form, callback) {
        $z.http._ajax($z.http.constant.method.GET, url, form, callback);
    },
    post: function (url, form, callback) {
        $z.http._ajax($z.http.constant.method.POST, url, form, callback);
    },
    _ajax: function (method, url, form, callback) {
        if (typeof form === 'function') {
            callback = form;
            form = null;
        }
        $.ajax({
            type: method,
            url: url,
            data: form
        }).done(function (re) {
            $z.http._ajaxDone(re, callback);
        }).fail($z.http._ajaxFail);
    },
    _ajaxDone: function (re, callback) {
        if ($z.http.constant.ajax.useJson) {
            if (typeof re === 'string') {
                re = $z.util.toJson(re);
            } else {
                $z.err.new("ajaxReturn is not a String, can't be use as JSON");
            }
        }
        if ($z.http.constant.ajax.useAjaxReturn) {
            if (re.ok) {
                callback(re);
            } else {
                $z.http._ajaxErrorMsg(re);
            }
        } else {
            callback(re);
        }
    },
    _ajaxFail: function (e) {
        alert('Ajax Error!\n' + e);
    },
    _ajaxErrorMsg: function (re) {
        // TODO 想想如何处理
    }
};