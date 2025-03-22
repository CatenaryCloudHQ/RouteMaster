# Contribute and release

1. Build and test

npx projen build

can be installed locally with `yarn add ../../cdk-constructs/RouteMaster/dist/js/routemaster@0.0.0.jsii.tgz`

2. npx projen build

3. Add updated files, use "feat:" to include messages in the the change log

4. check release notes

`npx standard-version --commit-all --skip.bump --skip.tag --release-as 0.0.2-beta.1 --prerelease --verbose --dry-run`

push branch and it will create release automatically

5. Use feat, fix or chore as prefix in the PRs
