///////////////////////////////////
// Memory Driver Implementation //
///////////////////////////////////

var util = require('util');
var Base = require('express-aks-driver-base');

/**
 * Initalize a new Driver Object
 */
function Driver() {
    var kdb = this;
    this._db = {};
    return this;
}

util.inherits(Driver, Base);

/**
 * Find a single key from the email uid
 * @param  {String}   email Email uid to retrieve a key for
 * @param  {Function} callback Function to evaluate with the results of the find
 */
Driver.prototype.findOne = function(email, callback) {
    var self = this;

    function _findOne(err, key) {
        if (err) {
            callback(err);
            return;
        }
        if (!self._db[key.domain]) {
            callback('domain not found');
            return;
        }
        if (!self._db[key.domain][key.user]) {
            callback('user not found');
            return;
        }

        key = self._db[key.domain][key.user];
        callback(null, key);

    }
    // base validation and parsing is implemented in the generic driver.
    Driver.super_.prototype.findOne.call(this, email, _findOne);
};


 /**
 * Find all the keys for this server
 * @param  {String}   domain Optional domain in which to search for keys
 * @param  {Function} callback Function to evaluate with the results of the find
 */
Driver.prototype.find = function(domain, callback) {
    var self = this;
    Base.prototype.find.call(this, domain, function(err, keys) {
        if (err) {
            callback(err);
            return;
        }
        if(!self._db.hasOwnProperty(domain)) {
            return callback('domain not found');
        }
        Object.keys(self._db[domain]).forEach(function(user) {
            if (!self._db[domain].hasOwnProperty(user)) {
                return;
            }
            keys.push(self._db[domain][user]);
        });
        callback(null, keys);
    });

};





/**
 * Add a key to the database
 * @param {String}   email Email to associate with the key
 * @param {String}   keytext ASCII-armored keytext including headers
 * @param {Function} callback Function to evaluate with an error or the added key on success
 */
Driver.prototype.add = function(email, keytext, callback) {
    var self = this;
    function _add(err, key) {
        if (err) {
            callback(err);
            return;
        }
        if (!self._db.hasOwnProperty(key.domain)) {
            self._db[key.domain] = {};
        }
        self._db[key.domain][key.user] = key;
        callback(null, key);
    }

    Driver.super_.prototype.add.call(this, email, keytext, _add);
};


/**
 * Export the Driver object
 */

module.exports = Driver;