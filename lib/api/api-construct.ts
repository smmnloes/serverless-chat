import { WebSocketApi, WebSocketStage } from "@aws-cdk/aws-apigatewayv2-alpha";
import { WebSocketLambdaIntegration } from "@aws-cdk/aws-apigatewayv2-integrations-alpha";
import { NodejsFunction } from "aws-cdk-lib/aws-lambda-nodejs";
import { Construct } from "constructs";


export class ApiConstruct extends Construct {
    constructor(scope: Construct, id: string) {
        super(scope, id)

        const defaultHandler = new NodejsFunction(this, 'default-handler')


        const webSocketApi = new WebSocketApi(this, 'WebSocketApi', {
            defaultRouteOptions: { integration: new WebSocketLambdaIntegration('DefaultIntegration', defaultHandler) }
        })

        const stage = new WebSocketStage(this, 'prod', {
            webSocketApi,
            stageName: 'prod',
            autoDeploy: true,
        });

        defaultHandler.addEnvironment('CALLBACK_URL', stage.callbackUrl)
        
        webSocketApi.grantManageConnections(defaultHandler)
    }
}