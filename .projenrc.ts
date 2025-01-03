import { awscdk, javascript } from "projen";
import { JobStep } from "projen/lib/github/workflows-model";
import { YarnNodeLinker } from "projen/lib/javascript";
import { ReleaseTrigger } from "projen/lib/release";

const project = new awscdk.AwsCdkConstructLibrary({
  author: "Roman Naumenko",
  authorAddress: "hi@catenary.cloud",
  packageName: "RouteMaster",
  cdkVersion: "2.173.2",
  majorVersion: 0,
  defaultReleaseBranch: "main",
  release: true,
  releaseTrigger: ReleaseTrigger.continuous(),
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
  // devDeps: [] /* Build dependencies for this module. */,
});

if (project.github) {
  const buildWorkflow = project.github.workflows.find(
    (wf) => wf.name === "build",
  );
  const releaseWorkflow = project.github.workflows.find(
    (wf) => wf.name === "release",
  );

  if (buildWorkflow) {
    const buildJob = buildWorkflow.getJob("build");
    const jsJob = buildWorkflow.getJob("package-js");

    if (buildJob && "steps" in buildJob && jsJob && "steps" in jsJob) {
      const corepack = {
        name: "Install Specific Yarn Version",
        run: "corepack enable && yarn set version 4.6.0",
      };

      const buildSteps = buildJob.steps as unknown as () => JobStep[];
      const jsSteps = jsJob.steps as unknown as JobStep[];

      buildWorkflow.updateJob("package-js", {
        ...jsJob,
        steps: [corepack, ...jsSteps],
      });

      buildWorkflow.updateJob("build", {
        ...buildJob,
        steps: [corepack, ...buildSteps()],
      });
    }
  }

  if (releaseWorkflow) {
    const releaseJob = releaseWorkflow.getJob("release");

    if (releaseJob && "steps" in releaseJob) {
      const corepack = {
        name: "Install Specific Yarn Version",
        run: "corepack enable && yarn set version 4.6.0",
      };

      const releaseSteps = releaseJob.steps as unknown as JobStep[];

      releaseWorkflow.updateJob("release", {
        ...releaseJob,
        steps: [corepack, ...releaseSteps],
      });
    }
  }
}

project.synth();
