import { StackProps, Stack, Duration } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { DockerImageAsset } from 'aws-cdk-lib/aws-ecr-assets';
import * as path from 'path';
import * as lb from 'aws-cdk-lib/aws-elasticloadbalancingv2';

export class NoPipelineStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
      super(scope, id, props);

      const vpc = new ec2.Vpc(this, 'ecsVpc', {
        maxAzs: 3
      });
  
      const cluster = new ecs.Cluster(this, 'MainCluster', {
        vpc
      });


      const asset = new DockerImageAsset(this, 'FlaskAppImage', {
        directory: path.join(__dirname, '..', 'src')
      });

      const fargateTaskDefinition = new ecs.FargateTaskDefinition(this, 'TaskDef', {
        memoryLimitMiB: 1024,
        cpu: 512
      });

      const container = new ecs.ContainerDefinition(this, 'FargateContainer', {
          image: ecs.EcrImage.fromDockerImageAsset(asset),
          taskDefinition: fargateTaskDefinition,
          environment: {
              'CUSTOM_ENVVAR': 'Hi from Main account',
              'BG_COLOR': "#FF0000"
          },
          portMappings: [{ containerPort: 80 }]
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
          securityGroups: [ securityGroup ],
          desiredCount: 3
      });

      const alb = new lb.ApplicationLoadBalancer(this, "flaskAppALB", {vpc, internetFacing: true});

      const listener = alb.addListener('Listener', { port: 80, protocol: lb.ApplicationProtocol.HTTP });

      listener.addTargets('ecsTG', {
          port: 80,
          targets: [fargateEcsService],
          protocol: lb.ApplicationProtocol.HTTP,
          healthCheck: {
              path: '/',
              interval: Duration.seconds(60)
          }
      });



      

    }
}