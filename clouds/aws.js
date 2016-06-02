var AWS = require("aws-sdk"),
    fs = require('fs'),
    path = require('path'),
    walk = require('walk');


module.exports.createSite = function(options) {
    "use strict";

    if(typeof options.awsKey === "undefined" || options.awsKey === "") {
        throw("required awsKey, not provided");
    }

    if(typeof options.awsPass === "undefined" || options.awsPass === "") {
        throw("required awsPass, not provided");
    }

    if(typeof options.domain === "undefined" || options.domain === "") {
        throw("required domain, not provided");
    }

    if(typeof options.callback !== "function") {
        throw("required callback not provided");
    }

    if(typeof options.region === "undefined" || options.region === "") {
        throw("required region not provided");
    }

    var s3 = new AWS.S3({
        accessKeyId: options.awsKey,
        secretAccessKey: options.awsPass,
        region: options.region,
        sslEnabled: true
    });

    s3.createBucket({
        Bucket: options.domain,
        ACL: "public-read"
    }, function(error, data) {
        if(error) {
            throw(error);
        } else {
            try {
                // TODO: be concerned if this fails
                s3.putBucketWebsite({
                    Bucket: options.domain,
                    WebsiteConfiguration: {
                        IndexDocument: {
                            Suffix: "index.html"
                        },
                        ErrorDocument: {
                            Key: "404.html"
                        }
                    }
                }).send();

                var uploadTasks = [];
                var walker = walk.walk(options.directory, {followLinks: true});
                walker.on("file", function(root, fileStat, next) {
                    var cloudPath = fileStat.name;
                    if(root.length > options.directory.length) {
                        cloudPath = root.substr(options.directory.length + 1) + "/" + fileStat.name;
                    }
                    uploadTasks.push(new Promise((resolve, reject) => {
                        s3.upload({
                            ACL: "public-read",
                            Body: fs.createReadStream(path.join(root, fileStat.name)),
                            Bucket: options.domain,
                            Key: cloudPath
                        }, function(error, data) {
                            if(error) {
                                reject(error);
                            } else {
                                resolve(data);
                            }
                        });
                    }));
                    next();
                });

                walker.on("errors", function(root, nodeStatsArray, next) {
                    nodeStatsArray.forEach(function (n) {
                        throw(n.error.message || (n.error.code + ": " + n.error.path));
                    });
                    next();
                });

                walker.on("end", function() {
                    Promise.all(uploadTasks)
                        .then(options.callback)
                        .catch(function(error) {
                            throw(error);
                        });
                });

            } catch (error) {
                throw(error);
            }
        }
    });
};

module.exports.listBuckets = function(options) {
    "use strict";

    if(typeof options.awsKey === "undefined" || options.awsKey === "") {
        throw("required awsKey, not provided");
    }

    if(typeof options.awsPass === "undefined" || options.awsPass === "") {
        throw("required awsPass, not provided");
    }

    if(typeof options.callback !== "function") {
        throw("required callback not provided");
    }

    var s3 = new AWS.S3({
        accessKeyId: options.awsKey,
        secretAccessKey: options.awsPass
    });

    s3.listBuckets(options.callback);
};