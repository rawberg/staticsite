var AWS = require("aws-sdk");


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

    var s3 = new AWS.S3({
        accessKeyId: options.awsKey,
        secretAccessKey: options.awsPass,
        region: region,
        sslEnabled: true
    });

    var awsReqCreateBucket = s3.createBucket({
        Bucket: req.body.bucketDomain,
        ACL: "public-read",
        CreateBucketConfiguration: {LocationConstraint: region}
    });

    var awsReqPutWebsite = s3.putBucketWebsite({
        Bucket: req.body.bucketDomain,
        WebsiteConfiguration: {
            IndexDocument: {
                Suffix: "index.html"
            },
            ErrorDocument: {
                Key: "404.html"
            }
        }
    });

    var awsReqUploadIndex = s3.upload({
        ACL: "public-read",
        Body: bufferIndexhtml,
        Bucket: req.body.bucketDomain,
        Key: "index.html",
        ContentType: "text/html"
    });

    var awsReqUpload404 = s3.upload({
        ACL: "public-read",
        Body: bufferErrorhtml,
        Bucket: req.body.bucketDomain,
        Key: "404.html",
        ContentType: "text/html"
    });

    var errorResponse = function(error, response) {
        console.log("error: ", error);
        console.log("response: ", response);
        res.sendStatus(502);
        rollbar.handleError(error, response);
    };

    var successResponseBucketCreated = function() {
        res.status(200).json({success: true});
    };

    awsReqPutWebsite.on("error", errorResponse);
    awsReqCreateBucket.on("error", errorResponse);

    var awsReqUpload404Callback = function(err, data) {
        if(err) {
            errorResponse(err);
            return;
        }
        console.log("awsReqUpload404 succeeded");
        console.log(data);
        successResponseBucketCreated();
    };

    var awsReqUploadIndexCallback = function(err, data) {
        if(err) {
            errorResponse(err);
            return;
        }
        console.log("awsReqUploadIndex succeeded");
        console.log(data);
        awsReqUpload404.send(awsReqUpload404Callback);
    };

    awsReqPutWebsite.on("success", function(response) {
        console.log("awsReqPutWebsite succeeded");
        awsReqUploadIndex.send(awsReqUploadIndexCallback);
    });
    awsReqCreateBucket.on("success", function(response) {
        console.log("awsReqCreateBucket succeeded");
        awsReqPutWebsite.send();
    });

    console.log("calling awsReqCreateBucket");
    awsReqCreateBucket.send();
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