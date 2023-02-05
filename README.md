# Welcome to AWS-CDK-Typescript

This project is a personal learning experience, please read below to know what I have learned during this process.

## About AWS-CDK

### Configuration

In order to use the CDK CLI, you need to add the environment first, to do so use: `cdk bootstrap aws://<ACCOUNT-NUMBER>/<REGION>` or add a `cdk.json` file with the env configuration to the current directory.

After the bootstrapping process, to create a project, type `cdk init --language <LANGUAGE>` to setup a project skeleton along with the needed dependencies in the specified language.

The project is organized as such:

`bin` folder contains the starting point of the project, it’ll drive all the stacks contained in the

`lib` folder, which contains files with different application stacks, resources and properties.

`package.json` file will contain the dependencies of the project, additional information and scripts to run/build it.

`cdk.json` tells the toolkit how to run the application and keeps additional configurations related to the cdk.

### Project Configuration

During the cdk cli configuration you define an account region, but to assure the project won’t be affected by some change in the cli configuration it’s a good practice to manually add the configuration in the project. To do so, we’ll add the following to the starting point inside the `bin` folder (consider a project using typescript):

```tsx
#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { CdkDemoStack } from '../lib/cdk-demo-stack';

const app = new cdk.App();
new CdkDemoStack(app, 'CdkDemoStack', {
	// the env property will contain the account and region for the application to run
  env: { account: 'ACCOUNT-NUMBER', region: 'us-east-1' },

});
```

### AWS CDK Construct Library

The construct Library contains constructs that represents the AWS resources (S3, RDS, EC2…), a construct can represent a single resource as shown above, but they can also represent higher level abstractions containing multiple resources.

For a more detailed reference please refer to:

[API Reference · AWS CDK](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-construct-library.html)

To add a module as a project dependency, simply use the package manager `npm i @aws-cdk/<MODULE>`.

### Constructing an Example VPC

Let’s see how to use the CdkStack to build our first resource, inside the folder `lib` of your project, add the following to the example file:

```tsx
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class CdkDemoStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new ec2.Vpc(this, 'mainVPC', {
      maxAzs: 2,
      subnetConfiguration: [{
        cidrMask: 24,
        name: 'public-subnet',
        subnetType: ec2.SubnetType.PUBLIC
      }]
    })
  }
}
```

The `new ec2.Vpc(...)` here is what we call a construct, note that constructs always have three parameters:

`scope`: by default the scope of the construct will be the one it’s being created inside, the usual behavior here is to pass `this` as the scope almost every time.

`id`: the construct unique id expressed in form of a string, the “uniqueness” of the id refers to the current scope only.

`props`: this last parameter is optional sometimes, it’s a config object, to define initialization properties specific to each construct.

The application also provides a testing module to help assuring the application works correctly, below is an example of the test file for the example above where we test if the number of AZs is correct and if the VPC was created as described:

```tsx
import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import * as CdkDemo from '../lib/cdk-demo-stack';

test('VPC Created', () => {
  const app = new cdk.App();
    // WHEN
  const stack = new CdkDemo.CdkDemoStack(app, 'MyTestStack');
    // THEN
  const template = Template.fromStack(stack);

  template.resourceCountIs('AWS::EC2::Subnet', 2)
  template.hasResourceProperties('AWS::EC2::VPC', {
    Tags: [{
      Key: "Name",
      Value: "MyTestStack/mainVPC",
    }]
  });
});
```

for more information please refer to: 

[aws-cdk-lib.assertions module · AWS CDK](https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.assertions-readme.html)

### Deploy

With the project completed and tested, we may proceed to deploy it using `cdk deploy`.

The above command will create a CloudFormation change set to deploy the changes. The whole process is automated.

### Synthesizing

The CDK project is a code definition of your infrastructure, when a CDK app is executed they will in fact synthesize a CloudFormation template for each stack inside your application `lib` folder. To create a template from the code, type `cdk synth` inside the project folder. The output will contain the whole template.

### Cleanup

If you need to undo the deploy process and remove the resources, just use the command `cdk destroy`, the cli will ask for confirmation showing the stack name, and that’s it.

### Getting a diff

When you run the `cdk diff` command the result will show the diff between your current code resources and the CloudFormation’s current deployed stack. This is a good way to know what will be affected by your next deploy.

### Hotswapping

During development the deploy command can be very frustating, sometimes you changed just a line in the lambda function, and a new deploy will take more than a minute to conclude, to have a faster deploy when tweaking your code, the `cdk deploy --hotswap` command is very helpful.

This flag will allow CloudFormation to deploy only the current changes (when possible) without spinning up the entire stack again. This faster deploy type can generate drift in the stack, so it should only be used for development purposes.
