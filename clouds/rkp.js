var fs = require('fs'),
    path = require('path'),
    walk = require('walk');


module.exports.createSite = function(options) {
    "use strict";

    var required = ["user", "apiKey", "domain", "callback"];
    for(let req of required) {
        if(typeof options[req] === "undefined" || options[req] === "") {
            throw("required " + req + ", not provided");
        }
    }

    var client = require("pkgcloud").providers.rackspace.storage.createClient({
        username: options.user,
        apiKey: options.apiKey,
        region: options.region
    });

    client.createContainer({
        name: options.domain,
        metadata: {
            "X-Container-Meta-Web-Index": "index.html"
        }
    }, function(error, data) {
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
                        var writeStream = client.upload({
                            container: options.domain,
                            remote: cloudPath
                        });
                        writeStream.on("finish", resolve);
                        writeStream.on("error", reject);
                        fs.createReadStream(path.join(root, fileStat.name)).pipe(writeStream);
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
                        .catch(function(error) { throw(error); });
                });

            } catch(error) {
                throw(error);
            }
        }
    });
};

module.exports.getContainers = function(options) {
    "use strict";

    var required = ["user", "apiKey", "callback"];
    for(let req of required) {
        if(typeof options[req] === "undefined" || options[req] === "") {
            throw("required " + req + ", not provided");
        }
    }

    var client = require("pkgcloud").providers.rackspace.storage.createClient({
        username: options.user,
        apiKey: options.apiKey,
        region: options.region
    });
    client.getContainers(options.callback);
};