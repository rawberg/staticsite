# Static Site - CLI to Set Up Static Hosting on AWS, Rackspace and Azure.
Automates the process of creating a storage bucket and configuring it for static hosting across all the major cloud platforms. Uploads a local directory containing your site files.

Can be used as a command line tool or programatically as a node module.

## Installation
Tested on the latest stable LTS version of Node (v4.4.5). 
```
npm install staticsite -g
```

## CLI Usage
To get started you just have to specify a cloud (aws, rkp, azure) along with a domain name you'd like to use and your authentication details for the cloud platform. If you don't specify a local directoy it uploads the contents of [default_site_files](default_site_files) which contains a simple hello world index.html file and 404.html.
#### AWS Basic Example
```bash
staticsite aws new-site.com -k aws-secret-key -p aws-secret-password (region default is us-east-1)
```
#### AWS with Region and Local Directory Upload
```bash
staticsite aws new-site.com -k aws-secret-key -p aws-secret-password -r us-west-2 -d ./path-to-local-site-files
```

#### Rackspace Basic Example
```bash
staticsite rkp new-site.com -u rkp-username -k rkp-api-key (region default is DFW)
```

#### Rackspace with Region and Local Directory Upload
```bash
staticsite rkp new-site.com -u rkp-username -k rkp-api-key -r IAD -d ./path-to-local-site-files
```

#### Azure Example
Please note: Azure currently [doesn't have the capability to specify a default file](https://feedback.azure.com/forums/217298-storage/suggestions/1180039-support-a-default-blob-for-blob-storage-containers) i.e. index.html so it's currently not an ideal solution for hosting traditional websites.
```bash
staticsite azure new-site.com -u storage-account -k azure-api-key -d ./path-to-local-site-files
```

#### Help Documentation & Complete List of Options
```bash
staticsite --help
```

## Programmatic Usage
#### AWS Example
```JavaScript
var aws = require("staticsite").clouds.aws;
aws.createSite({
    awsKey: "aws-secret-key",
    awsPass: "aws-secret-password",
    domain: "new-site.com",
    region: "us-west-1",
    directory: "./path-to-site-files",
    callback: function() {
        console.log("successfully created your new site on AWS");
    }
});
```

#### Rackspace Example
```JavaScript
var rkp = require("staticsite").clouds.rkp;
rkp.createSite({
    user: "rkp-username",
    apiKey: "rkp-api-key",
    domain: "new-site.com",
    region: "ORD",
    directory: "./path-to-site-files",
    callback: function() {
        console.log("successfully created your new site on Rackspace");
    }
});
```

#### Azure Example
```JavaScript
var azure = require("staticsite").clouds.azure;
azure.createSite({
    storageAccount: "storage-account",
    apiKey: "azure-api-key",
    domain: "new-site.com",
    directory: "./path-to-site-files",
    callback: function() {
        console.log("successfully created your new site on Azure");
    }
});
```

## Support
#### Bug Reports & Feature Requests
Please use the [issue tracker](https://github.com/rawberg/staticsite/issues) to report any bugs or request new features.

## Contributing
#### Developing
Pull requests are welcome. To begin developing, do this:
```bash
git clone git@github.com:rawberg/staticsite.git
git checkout -b new-feature-branch
```

## License
[GPLv3 License](gpl-3.0.txt)  
Copyright 2016 David Feinberg
