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
        "eu-west-1",
        "ap-northeast-1",
        "ap-northeast-2",
        "ap-southeast-1",
        "ap-southeast-2",
        "sa-east-1",
        "cn-north-1"
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
    if(args.region !== null && args.region !== "") {
        if(awsRegions.indexOf(args.region) < 0) {
            console.log("invalid aws region, available regions: " + awsRegions.join(", "));
            process.exit(1);
        }
    } else {
        args.region = "us-east-1";
    }
    if(args.directory === null || args.directory === "") {
        args.directory = "./default_site_files";
    }
    directoryValidation(args.directory);
}

function azureValidations(args) {
    if(args.key === null || args.key === "") {
        console.log("missing required azure api key");
        process.exit(1);
    }
    if(args.user === null || args.user === "") {
        console.log("missing required azure storage account name");
        process.exit(1);
    }
    if(args.domain === null || args.domain === "") {
        console.log("missing required azure container name");
        process.exit(1);
    }
    else if(args.user.length < 3 || args.user.length > 63) {
        console.log("container name must be between 3 and 63 characters")
    }
    args.domain = args.domain.replace(/[\W_]+/g, "");

    if(args.directory === null || args.directory === "") {
        args.directory = "./default_site_files";
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
    if(args.directory === null || args.directory === "") {
        args.directory = "./default_site_files";
    }
    directoryValidation(args.directory);
}

module.exports = {
    awsValidations: awsValidations,
    azureValidations: azureValidations,
    rkpValidations: rkpValidations
};