var fs = require('fs');
var formidable = require('formidable');
/**
 * query json array
 * @param jsonArray 
 * @param conditions like {"name":"value"}
 * @returns {Object} 
 */
exports.jsonQuery = function (jsonArray, conditions) {
    var i = 0,
        len = jsonArray.length,
        json,
        condition,
        flag;
    for (; i < len; i++) {
        flag = true;
        json = jsonArray[i];
        for (condition in conditions) {
            if (json[condition] !== conditions[condition]) {
                flag = false;
                break;
            }
        }
        if (flag) {
            return json;
        }
    }
};

/**
 * get config
 * @param filePath 
 * @param [key] 
 * @param callback 
 */
exports.getConfig = function (filePath, key, callback) {
    if(typeof key === 'function'){
        callback = key;
        key = undefined;
    }
    fs.readFile(filePath, 'utf8', function (err, file) {
        if (err) {
            console.log('读取文件%s出错：' + err, filePath);
            return callback(err);
        }
        var data = JSON.parse(file);
        if (typeof key === 'string') {
            data = data[key];
        }
        return callback(null, data);
    });
};

/**
 * set config
 * @param filePath 
 * @param setters 
 */
exports.setConfig = function (filePath, setters) {
    fs.readFile(filePath, 'utf8', function (err, file) {
        var data = JSON.parse(file),
            key;
        for (key in setters) {
            data[key] = setters[key];
        }
        var newFile = JSON.stringify(data, null, 2);
        fs.writeFile(filePath, newFile, 'utf8');
    });
};

/**
 * create key
 * @param [prefix] 
 * @param obj 
 * @returns {string} prefix_name_kan_age_20，name_kan_age_20
 */
exports.generateKey = function (prefix, obj) {
    if (typeof prefix === 'object') {
        obj = prefix;
        prefix = undefined;
    }
    var attr,
        value,
        key = '';
    for (attr in obj) {
        value = obj[attr];
        key += attr.toString().toLowerCase() + '_' + value.toString();
    }
    if (prefix) {
        //形如：prefix_name_kan_age_20
        key = prefix + '_' + key;
    }
    return key;
};
/**
 * delete key undefined null ''
 * @param obj 
 * @param callback 
 */
exports.deObject = function (obj, callback) {
    for(var key in obj){
        if(obj[key] === undefined || obj[key] === null || obj[key] === ''){
            delete obj[key];
        }
    }
    return obj;
};
/**
 * return upload with configure，fileHandler
 */
exports.upload = (function(){
    var uploadDir, uploadUrl;
    var configure = function(opts){
        opts.uploadDir && (uploadDir = opts.uploadDir);
        opts.uploadUrl && (uploadUrl = opts.uploadUrl);
    };
    var fileHandler = function(){
        var result = [];
        var form = new formidable.IncomingForm();   
        form.uploadDir = uploadDir;
        form.maxFieldsSize = 2 * 1024 * 1024;
        form.maxFields = 1000;
        form.keepExtensions = true;
        /*form.encoding = 'utf-8';
        form.hash = false;
        form.on('end', function() {
        });
        */
        return function(req, res, next){
            form.parse(req, function(err, fields, files) {
                if (err) {
                    next(err);
                }
                var len = uploadDir.length;
                for(var key in files){
                    result.push(uploadUrl + files[key].path.substring(len));
                }
                res.json({
                    status: 'success',
                    data: result
                });
            });
        }
    };
    return {
        configure: configure,
        fileHandler: fileHandler
    };
})();