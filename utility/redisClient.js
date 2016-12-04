var redis = require('redis');
var config = require('../config');
var client = redis.createClient(config.RedisPort, config.RedisHost);
client.on('error', function (err) {
    console.error('Redis连接错误: ' + err);
    process.exit(1);
});

/**
 * set item
 * @param key 
 * @param value 
 * @param expired 
 * @param callback 
 */
exports.setItem = function (key, value, expired, callback) {
    client.set(key, JSON.stringify(value), function (err) {
        if (err) {
            return callback(err);
        }
        if (expired) {
            client.expire(key, expired);
        }
        return callback(null);
    });
};

/**
 * get item
 * @param key 
 * @param callback 
 */
exports.getItem = function (key, callback) {
    client.get(key, function (err, reply) {
        if (err) {
            return callback(err);
        }
        return callback(null, JSON.parse(reply));
    });
};

/**
 * remove item
 * @param key 
 * @param callback 
 */
exports.removeItem = function (key, callback) {
    client.del(key, function (err) {
        if (err) {
            return callback(err);
        }
        return callback(null);
    });
};

/**
 * get dafault cache expired
 */
exports.defaultExpired = parseInt(config.CacheExpired);