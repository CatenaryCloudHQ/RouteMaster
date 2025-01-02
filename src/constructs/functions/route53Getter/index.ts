import {
  Route53Client,
  ListHostedZonesByNameCommand,
  ListHostedZonesByNameCommandInput,
  ListHostedZonesByNameCommandOutput,
} from "@aws-sdk/client-route-53";
import { CdkCustomResourceEvent, CdkCustomResourceResponse } from "aws-lambda";

type CdkCustomResourceEventWithPhysicalResId = CdkCustomResourceEvent & {
  PhysicalResourceId?: string;
  RequestType: "Create" | "Update" | "Delete";
};

/**
 * Function for custom resource to read hosted zones and filter them out by keyword in the description
 * It uses event.zoneDescriptionFilter to match zones
 * @param event Lambda event
 * @returns
 */
export const handler = async (
  event: CdkCustomResourceEventWithPhysicalResId,
): Promise<CdkCustomResourceResponse> => {
  const r53 = new Route53Client({});

  if (!event?.ResourceProperties) {
    throw new Error("Invalid event or missing ResourceProperties");
  }

  console.log("Event received: ", JSON.stringify(event, null, 2));

  const zoneName = event.ResourceProperties.zoneName;
  const zoneDescriptionFilter = event.ResourceProperties.zoneDescriptionFilter;

  if (!zoneName || !zoneDescriptionFilter) {
    throw new Error(
      "Missing required properties: zoneName or zoneDescriptionFilter",
    );
  }

  const response = createInitialResponse(event);
  let zoneId: string | undefined;

  switch (event.RequestType) {
    case "Create":
      zoneId = await getZoneId(r53, zoneName, zoneDescriptionFilter);
      response.Data = { zoneId };
      response.PhysicalResourceId = zoneId || "UNKNOWN";
      return response;
    case "Update": {
      zoneId = await getZoneId(r53, zoneName, zoneDescriptionFilter);
      response.Data = { zoneId };
      response.PhysicalResourceId = zoneId || "UNKNOWN";
      return response;
    }
    case "Delete": {
      response.PhysicalResourceId = event.PhysicalResourceId || "UNKNOWN";
      return response;
    }
  }
};

function createInitialResponse(
  event: CdkCustomResourceEventWithPhysicalResId,
): CdkCustomResourceResponse {
  return {
    Status: "SUCCESS",
    StackId: event.StackId,
    RequestId: event.RequestId,
    LogicalResourceId: event.LogicalResourceId,
    PhysicalResourceId: event.PhysicalResourceId || "UNKNOWN",
  };
}

async function getZoneId(
  r53: Route53Client,
  zoneName: string,
  descriptionFilter: string,
): Promise<string> {
  const input: ListHostedZonesByNameCommandInput = { DNSName: zoneName };
  const command = new ListHostedZonesByNameCommand(input);
  const output: ListHostedZonesByNameCommandOutput = await r53.send(command);

  const matchedZones = output.HostedZones?.filter(
    (zone) =>
      zone.Name === `${zoneName}.` &&
      zone.Config?.Comment &&
      zone.Config.Comment.includes(descriptionFilter),
  );

  if (!matchedZones || matchedZones.length === 0) {
    throw new Error(`No matching zones found for name: ${zoneName}`);
  }

  if (matchedZones.length > 1) {
    throw new Error(
      `Multiple zones matched the criteria for name: ${zoneName}`,
    );
  }

  const zoneId = matchedZones[0]?.Id;
  if (!zoneId) {
    throw new Error("Zone ID is undefined for the matched zone.");
  }

  return zoneId.replace(/^\/hostedzone\//, "");
}
