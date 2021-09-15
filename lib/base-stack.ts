import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ecr from '@aws-cdk/aws-ecr';

export class BaseStack extends cdk.Stack {
  public readonly cluster: ecs.Cluster;
  public readonly repository: ecr.Repository;
  
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'ecsVpc', {
      maxAzs: 3
    });

    this.cluster = new ecs.Cluster(this, 'MainCluster', {
      vpc
    });

    this.repository = new ecr.Repository(this, 'ecsRepo');

  }
}
