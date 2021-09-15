import * as cdk from '@aws-cdk/core';
import { AppStack } from './app-stack';
import { BaseStack } from './base-stack';

export class BaseStage extends cdk.Stage {
    constructor(scope: cdk.Construct, id: string, props?: cdk.StageProps) {
        super(scope, id, props);

        const baseStack = new BaseStack(this, 'BaseStack');
        const appStack = new AppStack(this, 'AppStack', {
            repository: baseStack.repository,
            cluster: baseStack.cluster
        });
    }
}