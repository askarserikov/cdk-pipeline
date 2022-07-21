import { Stack, StackProps, SecretValue } from 'aws-cdk-lib';
import { CodePipeline, CodePipelineSource, ShellStep, Wave } from 'aws-cdk-lib/pipelines';
import { Construct } from 'constructs';
import { BaseStage } from './base-stage';

export class CdkPipelineStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, 'Pipeline', {
      crossAccountKeys: true,
      synth: new ShellStep('Synth', {
        input: CodePipelineSource.gitHub('askarserikov/cdk-pipeline', 'master', {
          authentication: SecretValue.secretsManager('cdk-pipeline-github-token')
        }),
        commands: ['npm ci', 'npm run build', 'npx cdk synth']
      })
    });

    const wave = pipeline.addWave('MainWave');

    const mainStage = new BaseStage(this, 'BaseStage', {
      env: {
        account: '092614358952',
        region: 'eu-west-1'
      },
      customGreeting: 'Hi from Main account',
      bg: "#FF0000"
    });

    const altStage = new BaseStage(this, 'BaseStageAlt', {
      env: {
        account: '303919846363',
        region: 'eu-west-1'
      },
      customGreeting: 'Hi from Alt account',
      bg: '#FF9900'
    });

    wave.addStage(mainStage);
    wave.addStage(altStage);

    wave.addPost(new ShellStep("albTest", {
      envFromCfnOutputs: {albAddress: mainStage.albAddress},
      commands: ['curl -s -o /dev/null -w "%{http_code}" $albAddress']
    }));
  }
}
