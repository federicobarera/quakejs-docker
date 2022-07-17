#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { ServiceStack } from "../lib/service-stack";

const app = new cdk.App();

function run() {
  new ServiceStack(app, "ServiceStack", {
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: process.env.CDK_DEFAULT_REGION,
    },
    stackName: "social-quakejs-dev",
  });
}

console.log(process.env.CDK_DEFAULT_ACCOUNT);
console.log(process.env.CDK_DEFAULT_REGION);
run();
