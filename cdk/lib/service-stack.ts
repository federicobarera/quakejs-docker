import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as cdk from "aws-cdk-lib";
import { getContext } from "./utils";

export class ServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const context = getContext(scope);

    const whiteListedIps = context.tryGet<string[]>("whiteListedIps") ?? [
      "0.0.0.0/0",
    ];
    const usePrebuildImage = context.tryGet<string>("usePrebuildImage");
    const useCapacity = context.tryGet<string>("useCapacity") ?? "FARGATE";
    const cpu = context.tryGet<number>("cpu") ?? 2048;
    const memory = context.tryGet<number>("memory") ?? 4096;

    const vpc = new ec2.Vpc(this, "Vpc", {
      vpcName: "social-quakejs-vpc",
    });

    const cluster = new ecs.Cluster(this, "Cluster", {
      vpc: vpc,
      containerInsights: true,
      clusterName: "social-quakejs-cluster",
    });

    cluster.enableFargateCapacityProviders();

    const taskDefinition = new ecs.FargateTaskDefinition(
      this,
      "QuakeJsTaskDef",
      {
        cpu: cpu,
        memoryLimitMiB: memory,
      }
    );

    taskDefinition.addContainer("default", {
      image: !!usePrebuildImage
        ? ecs.ContainerImage.fromRegistry(usePrebuildImage)
        : ecs.ContainerImage.fromAsset("./", {
            exclude: ["cdk.out", "node_modules", "cdk"],
          }),
      cpu: cpu,
      memoryLimitMiB: memory,
      environment: {
        HTTP_PORT: "80",
      },
      portMappings: [
        {
          containerPort: 80,
        },
        {
          containerPort: 27960,
        },
      ],
    });

    const service = new ecs.FargateService(this, "QuakeJsService", {
      cluster,
      assignPublicIp: true,
      desiredCount: 1,
      taskDefinition: taskDefinition,
      capacityProviderStrategies: [
        {
          capacityProvider: useCapacity,
          weight: 1,
        },
      ],
    });

    whiteListedIps.forEach((ip) => {
      service.connections.allowFrom(ec2.Peer.ipv4(ip), ec2.Port.tcp(80));
      service.connections.allowFrom(ec2.Peer.ipv4(ip), ec2.Port.tcp(27960));
    });
  }
}
