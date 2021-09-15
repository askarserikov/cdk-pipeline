import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ecr from '@aws-cdk/aws-ecr';

export interface AppStackProps extends cdk.StackProps {
    cluster: ecs.Cluster,
    repository: ecr.Repository
}

export class AppStack extends cdk.Stack {
    private cluster: ecs.Cluster;
    private repository: ecr.Repository;
    constructor(scope: cdk.Construct, id: string, props: AppStackProps) {
      super(scope, id, props);

      const cluster = props.cluster;
      const repository = props.repository;

      const fargateTaskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDef', {
        memoryLimitMiB: 1024,
        cpu: 512
      });

      const container = new ecs.ContainerDefinition(this, 'FargateContainer', {
          image: ecs.EcrImage.fromEcrRepository(repository),
          taskDefinition: fargateTaskDefinition,
          environment: {
              'CUSTOM_ENVVAR': 'Hey from Cross-Account CDK Pipeline!'
          }
      });

      const securityGroup = new ec2.SecurityGroup(this, 'MultiStackAppSG', {
        allowAllOutbound: true,
        vpc: cluster.vpc
      });

      securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80));

      const fargateEcsService = new ecs.FargateService(this, 'FargateService', {
          cluster: cluster,
          taskDefinition: fargateTaskDefinition,
          assignPublicIp: true,
          securityGroup: securityGroup
      });

    }
  }