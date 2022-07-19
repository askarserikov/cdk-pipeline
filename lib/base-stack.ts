import { Stack, StackProps } from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import { Construct } from 'constructs';

export class BaseStack extends Stack {
  public readonly cluster: ecs.Cluster;
  
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'ecsVpc', {
      maxAzs: 3
    });

    this.cluster = new ecs.Cluster(this, 'MainCluster', {
      vpc
    });

  }
}
