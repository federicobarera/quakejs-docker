import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as cdk from "aws-cdk-lib";

const cpu = 2048;
const mem = 4096;

export class ServiceStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, "Vpc", {
      vpcName: "social-quakejs-vpc",
    });

    const cluster = new ecs.Cluster(this, "Cluster", {
      vpc: vpc,
      containerInsights: true,
      clusterName: "social-quakejs-cluster",
    });

    cluster.enableFargateCapacityProviders();

    const taskDefinition = new ecs.FargateTaskDefinition(this, "TaskDef", {
      family: "",
      cpu: cpu,
      memoryLimitMiB: mem,
    });

    taskDefinition.addContainer("default", {
      image: ecs.ContainerImage.fromRegistry("federicobarera2/quakejs"),
      cpu: cpu,
      memoryLimitMiB: mem,
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
          capacityProvider: "FARGATE",
          weight: 1,
        },
      ],
    });

    service.connections.allowFromAnyIpv4(ec2.Port.tcp(80));
    service.connections.allowFromAnyIpv4(ec2.Port.tcp(27960));
  }
}
