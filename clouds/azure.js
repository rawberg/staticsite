var azure = require("azure-storage"),
    fs = require('fs'),
    path = require('path'),
    walk = require('walk');


module.exports.createSite = function(options) {
    "use strict";

    var required = ["storageAccount", "apiKey", "domain", "callback"];
    for(let req of required) {
        if(typeof options[req] === "undefined" || options[req] === "") {
            throw("required " + req + ", not provided");
        }
    }

    var blobService = azure.createBlobService(options.storageAccount, options.apiKey);
    blobService.createContainerIfNotExists(options.domain, {
        publicAccessLevel: azure.BlobUtilities.BlobContainerPublicAccessType.BLOB,
        useNagleAlgorithm: true
    }, function(error, result) {
        if(error) {
            throw(error);
        } else {
            try {
                var uploadTasks = [];
                var walker = walk.walk(options.directory, { followLinks: true });
                walker.on("file", function(root, fileStat, next) {
                    var cloudPath = fileStat.name;
                    if(root.length > options.directory.length) {
                        cloudPath = root.substr(options.directory.length + 1) + "/" + fileStat.name;
                    }
                    uploadTasks.push(new Promise((resolve, reject) => {
                        var localStream = fs.createReadStream(path.join(root, fileStat.name));
                        localStream.pipe(blobService.createWriteStreamToBlockBlob(options.domain, cloudPath, {
                                useNagleAlgorithm: true
                            }, function(error, result) {
                                if(error) {
                                    reject(error);
                                } else {
                                    resolve(result);
                                }
                            }
                        ));
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
            } catch(error) {
                throw(error);
            }
        }
    });
};

module.exports.listContainers = function(options) {
    "use strict";

    var required = ["apiKey", "domain", "callback"];
    for(let req of required) {
        if(typeof options[req] === "undefined" || options[req] === "") {
            throw("required " + req + ", not provided");
        }
    }

    var blobService = azure.createBlobService(options.domain, options.apiKey);
    blobService.listContainersSegmented(null, options.callback);
};