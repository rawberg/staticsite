#!/usr/bin/env node
"use strict";

var argparse = require('argparse'),
    rkp = require("./clouds/rkp"),
    aws = require("./clouds/aws"),
    azure = require("./clouds/azure"),
    validations = require("./validations");

var usageExamples = "examples\n" +
    "AWS\n staticsite aws new-site.com" +
    " -k aws-secret-key -p aws-secret-password -r us-west-2 " +
    "(defaults to us-east-1)\n Rackspace\n staticsite " +
    "rkp new-site.com -u rkp-username -k rkp-api-key\n" +
    "Azure\n staticsite azure new-site.com -k azure-secret-key " +
    "-p azure-secret-password";


var parser = new argparse.ArgumentParser({
    version: "0.99.0",
    addHelp: true,
    formatterClass: argparse.RawTextHelpFormatter,
    usage: usageExamples,
    description: "StaticSite CLI"
});

// load up avialable arguments
require("./arguments")(parser);
var args = parser.parseArgs();

// DEBUG
// console.log(args);

// handle cloud command
switch(args.cloud) {
    case "aws":
        validations.awsValidations(args);
        aws.createSite({
            awsKey: args.key,
            awsPass: args.pass,
            domain: args.domain,
            directory: args.directory,
            callback: function(error, data) {
                if(error) {
                    console.log("aws error: ", error);
                } else {
                    console.log("successfully created " + args.domain + " on amazon web services cloud.");
                }
            }
        });
        break;
    case "rkp":
        validations.rkpValidations(args);
        rkp.createSite({
            user: args.user,
            apiKey: args.key,
            region: args.region,
            domain: args.domain,
            directory: args.directory,
            callback: function(error) {
                if(error) {
                    console.log("rkp error: ", error);
                } else {
                    console.log("successfully created " + args.domain + " on rackspace cloud.");
                }
            }
        });
        break;
    case "azure":
        console.log("azure is coming soon");
        break;
}