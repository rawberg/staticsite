var fs = require('fs');


function directoryValidation(directory) {
    fs.stat(directory, function(err, stats) {
        if(err || !stats.isDirectory()) {
            console.log("invalid directory");
            process.exit(1);
        }
    });
}

function domainValidation(domain) {
    if(!(/\b((?=[a-z0-9-]{1,63}\.)(xn--)?[a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,63}\b/.test(domain))) {
        console.log("invalid domain name (" + domain + ")");
        process.exit(1);
    }
}

function awsValidations(args) {
    var awsRegions = [
        "us-east-1",
        "us-west-1",
        "us-west-2",
        "eu-central-1",
        "ap-northeast-1",
        "ap-northeast-2",
        "ap-southeast-1",
        "ap-southeast-2",
        "sa-east-1"
    ];

    domainValidation(args.domain);
    if(args.key === null || args.key === "") {
        console.log("missing required aws secret access key");
        process.exit(1);
    }
    if(args.pass === null || args.pass === "") {
        console.log("missing required aws password");
        process.exit(1);
    }
    if(args.region !== null || args.region !== "") {
        if(awsRegions.indexOf(args.region) < 0) {
            console.log("invalid aws region, available regions: " + awsRegions.join(", "));
            process.exit(1);
        }
    }
    if(directory === null || directory === "") {
        args.directory = "./site_files";
    }
    directoryValidation(args.directory);
}

function rkpValidations(args) {
    var rkpRegions = [
        "ORD",
        "DFW",
        "HKG",
        "LON",
        "IAD",
        "SYD"
    ];

    domainValidation(args.domain);
    if(args.key === null || args.key === "") {
        console.log("missing required rkp api key");
        process.exit(1);
    }
    if(args.user === null || args.user === "") {
        console.log("missing required rkp username");
        process.exit(1);
    }
    if(args.region !== null || args.region !== "") {
        if(rkpRegions.indexOf(args.region) < 0) {
            console.log("invalid rkp region, available regions: " + rkpRegions.join(", "));
            process.exit(1);
        }
    }
    if(directory === null || directory === "") {
        args.directory = "./site_files";
    }
    directoryValidation(args.directory);
}

module.exports = {
    awsValidations: awsValidations,
    rkpValidations: rkpValidations
};