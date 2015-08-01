var assert = require('assert');
var Driver = require('..');
var driver = new Driver();

var testMalformedEmails = ['bademail' ];
var testMalformedKeys = [ '....' ];
var testGoodEmails = [ 'user1@example.com', 'user2+vrrp@example.com' ];
var testGoodKeys = [
    "-----BEGIN PGP PUBLIC KEY BLOCK-----\n"+
    "Version: BCPG C# v1.6.1.0\n" +
    "\n" +
    "mQENBFW7/+QBCACD/26MUOC2noyMHonHOJRfC/ANV2rWJ/waX5KgDSSaDLAKgIVF\n" +
    "tXk/nNLgn5gF9br0DNgX5gWkcU9Q7+QdmS2YAUJFdfX8FB06w3qLmqpLLKjtsSYz\n" +
    "iRfKw6PNzUBTgCJrC3zPlQJhFZCsQ/EZvSxeersgc+5dkRWsM0aSI556xekPsUNg\n" +
    "HqZP7fw1mr2pdXYDEcU4UYktEJnE+dEjmTLXo6QiGCLofg4Nc9AOZBGcJY8+GvDZ\n" +
    "IUQm+KIFprlZaiP3rin3a6XFiNq6MpAhk0/u6+R8X/UglB/VVsLq73O4mTWWQS9o\n" +
    "jwMdEA+CcExwtpQXhWWi9wu8i0lilp0LsYw9ABEBAAG0EXVzZXIxQGV4YW1wbGUu\n" +
    "Y29tiQEcBBABAgAGBQJVu//kAAoJEKPW17gPKkltto8H/3HwqkuieDrSb4wwyMCX\n" +
    "A4ZH5YC77lFWpWl0yCEe/91uM8z944c86nyCb60XdrJvL8KCV96S3MnYPKILIR7e\n" +
    "Aj2/CDHH9+LDsu7M4yaDD1MSEId1NXX8/At7GDKHclbu1eVnFdOhBtx4G95c2DzB\n" +
    "pQxKm1QEAlTkAb6jWN3R8nf2IgvARDcP/Vz3oeFx8/H5yx/UNJv0QpbWsq+tUH9F\n" +
    "TiGc05zVfoBpHFoq1nFTOn1G/Wm5xl8LG7sVkaxY5pTtMp7vaxvdEr6DMLB71DrC\n" +
    "F9P69AlIhY0S87re5H82eph/xkIuVsCVaaQJtCvwta5wrBcYoeqeWJIbsZCAnK4+\n" +
    "okY=\n" +
    "=nrQ4\n" +
    "-----END PGP PUBLIC KEY BLOCK-----"
];


describe('AKS Memory Driver', function() {
    describe('add', function() {
        it('should error if email is missing', function() {
            driver.add(null, testGoodKeys[0], function(err, res) {
                assert.equal(err, 'email missing');
            });
        });

        it('should error if email is malformed', function() {
            driver.add('bademail', testGoodKeys[0], function(err, res) {
                assert.equal(err, 'email malformed');
            });
        });

        it('should error if keytext is missing', function() {
            driver.add(testGoodEmails[0], null, function(err, res) {
                assert.equal(err, 'keytext missing');
            });
        });

        it('should error if keytext is malformed', function() {
            testMalformedKeys.forEach(function(key) {
                driver.add(testGoodEmails[0], key, function(err, res) {
                    assert.equal(err, 'keytext malformed');
                });
            });
        });

        it('should save valid input and return congruent data', function() {
            testGoodEmails.forEach(function(email) {
                testGoodKeys.forEach(function(key) {
                    driver.add(email, key, function(err, res) {
                        assert.equal(err, null);
                        assert.equal(res.email, email);
                        assert.equal(res.keytext, key);
                        var parts = email.split('@');
                        assert.equal(res.user, parts[0]);
                        assert.equal(res.domain, parts[1]);
                    });
                });
            });
        });
    });

    describe('findOne', function() {
        it('should error if email is missing', function() {
            driver.findOne(null, function(err, res) {
                assert.equal(err, 'email missing');
            });
        });
        it('should error if email is malformed', function() {
            testMalformedEmails.forEach(function(email) {
                driver.findOne(email, function(err, res) {
                    assert.equal(err, 'email malformed');
                });
            });
        });

        it('should error if domain is missing from db', function() {
            driver.findOne('user@missingdomain.com', function(err, res) {
                assert.equal(err, 'domain not found');
            });
        });

        it('should error if user is missing from db', function() {
            driver.findOne('missinguser@example.com', function(err, res) {
                assert.equal(err, 'user not found');
            });
        });

        it('should return the proper key', function() {
            testGoodEmails.forEach(function(email) {
                testGoodKeys.forEach(function(key) {
                    driver.add(email, key, function(err, res) {
                         driver.findOne(email, function(err, res) {
                            assert.equal(err, null);
                            assert.equal(res.email, email);
                            assert.equal(res.keytext, key);
                            var parts = email.split('@');
                            assert.equal(res.user, parts[0]);
                            assert.equal(res.domain, parts[1]);
                        });
                    });
                });
            });
        });
    });

    describe('find', function() {
        it('should error if domain parameter is missing', function() {
            driver.find(null, function(err, res) {
                assert.equal(err, 'domain missing');
            });
        });

        it('should error if domain is missing from db', function() {
            driver.find('missing.com', function(err, res) {
                assert.equal(err, 'domain not found');
            });
        });

        it('should return an array of properly formatted keys', function() {
            testGoodEmails.forEach(function(email) {
                driver.add(email, testGoodKeys[0], function(err, res) {});
            });

            driver.find('example.com', function(err, res) {
                assert.equal(err, null);
                assert.equal(res.length, testGoodEmails.length);
                var seen = [];
                res.forEach(function(key) {
                    // ensure key matches loaded key.
                    assert.equal(key.keytext, testGoodKeys[0]);
                    // ensure emails aren't duplicated.
                    assert.equal(false, seen.indexOf(key.email) != -1);
                    seen.push(key.email);
                })
            });

        });
    });
});