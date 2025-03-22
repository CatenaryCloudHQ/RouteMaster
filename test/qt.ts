import { readFileSync } from "fs";
import { Template, Match } from "aws-cdk-lib/assertions";

// Template generated when cdk app is using this construct
const template = JSON.parse(readFileSync("test/template.json", "utf8"));
const t = Template.fromJSON(template);

// Run with ts-node test/qt.ts for quick feedback on matchers - otherwise its painful to debug it
try {
  t.hasResourceProperties("Custom::AWS", {
    Create: Match.objectLike({
      "Fn::Join": [
        "",
        Match.arrayWith([
          '{"service":"Route53Domains","action":"updateDomainNameservers","parameters":{"DomainName":"acme.com","Nameservers":[{"Name":"',
          ...Array.from({ length: 4 }, (_, i) =>
            Match.objectLike({
              "Fn::GetAtt": [
                Match.anyValue(),
                `DelegationSet.NameServers.${i}`,
              ],
            }),
          ),
          '"}]},"physicalResourceId":{"id":"NS-acme.com"}}',
        ]),
      ],
    }),
  });
  console.log(
    "Test passed: Found Route53 domain nameserver update with all 4 nameservers",
  );
} catch (error: any) {
  console.log("Test failed:", error.message);
}
