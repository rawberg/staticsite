module.exports = function(parser) {
    parser.addArgument("cloud", {
        help: "cloud platform [aws, rkp, azure]",
        choices: ["aws", "rkp", "azure"]
    });

    parser.addArgument("domain", {
        help: "site domain name [new-site.com]"
    });

    parser.addArgument(["-u", "--user"], {
        help: "    rkp: username\naws: not used\nazure: not used\n",
        metavar: "\b",
        required: false
    });

    parser.addArgument(["-k", "--key"], {
        help: "    aws: secret access key (required)\nrkp: api key (required)\nazure: secret azure thingy\n",
        metavar: "\b",
        required: false
    });

    parser.addArgument(["-p", "--pass"], {
        help: "    aws: secret password (required)\nrkp: not used\n",
        metavar: "\b",
        required: false
    });

    parser.addArgument(["-r", "--region"], {
        help: "    data center region (aws and rkp only)\n",
        metavar: "\b",
        required: false
    });

    parser.addArgument(["-d", "--directory"], {
        help: "    directory of site files to upload (simple defaults included)\n",
        metavar: "\b",
        default: "./default_site_files",
        required: false
    });

    return parser;
};