import { awscdk, javascript } from "projen";
import { YarnNodeLinker } from "projen/lib/javascript";
import { ReleaseTrigger } from "projen/lib/release";

const project = new awscdk.AwsCdkConstructLibrary({
  author: "Roman Naumenko",
  authorAddress: "hi@catenary.cloud",
  packageName: "RouteMaster",
  cdkVersion: "2.173.2",
  majorVersion: 1,
  defaultReleaseBranch: "main",
  release: true,
  releaseTrigger: ReleaseTrigger.manual(),
  prerelease: "beta",
  prettier: true,
  jsiiVersion: "~5.7.0",
  name: "RouteMaster",
  keywords: ["awscdk", "cdk", "route53", "cross-account", "aws orgs"],
  description:
    "High level construct to manage zones in a central account. Sets permissions via AWS Org",
  packageManager: javascript.NodePackageManager.YARN_BERRY,
  projenrcTs: true,
  license: "Apache-2.0",
  repositoryUrl: "https://github.com/CatenaryCloudHQ/RouteMaster.git",
  yarnBerryOptions: {
    version: "4.6.0",
    zeroInstalls: false,
    yarnRcOptions: {
      nodeLinker: YarnNodeLinker.NODE_MODULES,
    },
  },

  deps: [
    "cdk-cross-account-route53@1.0.1",
    "@trautonen/cdk-dns-validated-certificate@0.1.12",
  ],
  bundledDeps: ["@aws-sdk/client-route-53", "@types/aws-lambda"],
  // devDeps: [],             /* Build dependencies for this module. */
});

project.addTask("install-yarn", {
  exec: "yarn set version 4.6.0",
});

project.synth();
