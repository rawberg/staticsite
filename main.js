#!/usr/bin/env node
"use strict";

var argparse = require('argparse'),
    rkp = require("./rkp"),
    aws = require("./aws");

var usageExamples = "examples\nAWS\n staticsite aws new-site.com -k aws-secret-key -p aws-secret-password -r us-west-2 (defaults to us-east-1)\n" +
    "Rackspace\n staticsite rkp new-site.com -k rackspace-api-key\n" +
    "Azure\n staticsite azure new-site.com -k azure-secret-key -p azure-secret-password";


var parser = new argparse.ArgumentParser({
    version: "0.0.1",
    addHelp: true,
    formatterClass: argparse.RawTextHelpFormatter,
    usage: usageExamples,
    description: "StaticSite CLI"
});

parser.addArgument("cloud", {
    help: "cloud platform [aws, rkp, azure]",
    choices: ["aws", "rkp", "azure"]
});

parser.addArgument("domain", {
    help: "site domain name [mynewsite.com]"
});

parser.addArgument(["-r", "--region"], {
    help: "    bucket region (aws only)\n",
    metavar: "\b",
    required: false
});

parser.addArgument(["-k", "--key"], {
    help: "    aws: secret access key (required)\nrkp: api key\nazure: secret azure thingy\n",
    metavar: "\b",
    required: false
});

parser.addArgument(["-p", "--pass"], {
    help: "    aws: secret password (required)\nrkp: not used",
    metavar: "\b",
    required: false
});

var args = parser.parseArgs();

console.log(args);

function awsValidations() {
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

    domainValidation();
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
}

function domainValidation() {
    if(!(/\b((?=[a-z0-9-]{1,63}\.)(xn--)?[a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,63}\b/.test(args.domain))) {
        console.log("invalid domain name (" + args.domain + ")");
        process.exit(1);
    }
}

switch(args.cloud) {
    case "aws":
        awsValidations();
        aws.createSite({
            awsKey: args.key,
            awsPass: args.pass,
            domain: args.domain,
            callback: function(error, data) {
                if(error) {
                    console.log(error);
                } else {
                    console.log("site created!");
                }
            }
        });
        break;
    case "rkp":
        console.log("rackspace is in progress");
        break;
    case "azure":
        console.log("azure is coming soon");
        break;
}