"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WSApiConstruct = void 0;
const aws_apigatewayv2_alpha_1 = require("@aws-cdk/aws-apigatewayv2-alpha");
const aws_apigatewayv2_integrations_alpha_1 = require("@aws-cdk/aws-apigatewayv2-integrations-alpha");
const aws_cdk_lib_1 = require("aws-cdk-lib");
const aws_lambda_nodejs_1 = require("aws-cdk-lib/aws-lambda-nodejs");
const aws_logs_1 = require("aws-cdk-lib/aws-logs");
const aws_route53_1 = require("aws-cdk-lib/aws-route53");
const targets = __importStar(require("aws-cdk-lib/aws-route53-targets"));
const constructs_1 = require("constructs");
class WSApiConstruct extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        const connectionTableName = props.connectionTable.tableName;
        const messagesTableName = props.messagesTable.tableName;
        const messageHandler = new aws_lambda_nodejs_1.NodejsFunction(this, 'message-handler', { environment: { CONNECTION_TABLE_NAME: connectionTableName, MESSAGES_TABLE_NAME: messagesTableName }, logRetention: aws_logs_1.RetentionDays.ONE_MONTH });
        const connectHandler = new aws_lambda_nodejs_1.NodejsFunction(this, 'connect-handler', { environment: { CONNECTION_TABLE_NAME: connectionTableName }, logRetention: aws_logs_1.RetentionDays.ONE_MONTH });
        const disconnectHandler = new aws_lambda_nodejs_1.NodejsFunction(this, 'disconnect-handler', { environment: { CONNECTION_TABLE_NAME: connectionTableName }, logRetention: aws_logs_1.RetentionDays.ONE_MONTH });
        const defaultHandler = new aws_lambda_nodejs_1.NodejsFunction(this, 'default-handler', { logRetention: aws_logs_1.RetentionDays.ONE_MONTH });
        props.connectionTable.grantReadWriteData(connectHandler);
        props.connectionTable.grantReadWriteData(disconnectHandler);
        props.connectionTable.grantReadData(messageHandler);
        props.messagesTable.grantWriteData(messageHandler);
        const webSocketApi = new aws_apigatewayv2_alpha_1.WebSocketApi(this, 'WebSocketApi', {
            routeSelectionExpression: '$request.body.action',
            defaultRouteOptions: { integration: new aws_apigatewayv2_integrations_alpha_1.WebSocketLambdaIntegration('DefaultIntegration', defaultHandler) },
            connectRouteOptions: { integration: new aws_apigatewayv2_integrations_alpha_1.WebSocketLambdaIntegration('ConnectIntegration', connectHandler) },
            disconnectRouteOptions: { integration: new aws_apigatewayv2_integrations_alpha_1.WebSocketLambdaIntegration('DisconnectIntegration', disconnectHandler) }
        });
        webSocketApi.addRoute('message', { integration: new aws_apigatewayv2_integrations_alpha_1.WebSocketLambdaIntegration('MessageIntegration', messageHandler) });
        webSocketApi.grantManageConnections(messageHandler);
        webSocketApi.grantManageConnections(connectHandler);
        webSocketApi.grantManageConnections(disconnectHandler);
        const stage = new aws_apigatewayv2_alpha_1.WebSocketStage(this, 'prod', {
            webSocketApi, stageName: 'prod', autoDeploy: true, throttle: {
                rateLimit: 10, burstLimit: 20
            }
        });
        messageHandler.addEnvironment('CALLBACK_URL', stage.callbackUrl);
        connectHandler.addEnvironment('CALLBACK_URL', stage.callbackUrl);
        disconnectHandler.addEnvironment('CALLBACK_URL', stage.callbackUrl);
        const chatWSApiDomainName = `chat-ws-api.${props.siteDomain}`;
        const domainName = new aws_apigatewayv2_alpha_1.DomainName(this, 'DomainName', {
            domainName: chatWSApiDomainName,
            certificate: props.certificate
        });
        new aws_apigatewayv2_alpha_1.ApiMapping(this, 'Mapping', { api: webSocketApi, domainName, stage });
        new aws_cdk_lib_1.aws_route53.ARecord(this, 'Arecord', {
            target: aws_route53_1.RecordTarget.fromAlias(new targets.ApiGatewayv2DomainProperties(domainName.regionalDomainName, domainName.regionalHostedZoneId)),
            zone: props.hostedZone,
            recordName: chatWSApiDomainName
        });
    }
}
exports.WSApiConstruct = WSApiConstruct;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoid3MtYXBpLWNvbnN0cnVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIndzLWFwaS1jb25zdHJ1Y3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQSw0RUFBcUc7QUFDckcsc0dBQXdGO0FBQ3hGLDZDQUFtRDtBQUduRCxxRUFBNkQ7QUFDN0QsbURBQW1EO0FBQ25ELHlEQUFrRTtBQUNsRSx5RUFBMkQ7QUFDM0QsMkNBQXFDO0FBRXJDLE1BQWEsY0FBZSxTQUFRLHNCQUFTO0lBQ3pDLFlBQVksS0FBZ0IsRUFBRSxFQUFVLEVBQUUsS0FFekM7UUFDRyxLQUFLLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFBO1FBR2hCLE1BQU0sbUJBQW1CLEdBQUcsS0FBSyxDQUFDLGVBQWUsQ0FBQyxTQUFTLENBQUM7UUFDNUQsTUFBTSxpQkFBaUIsR0FBRyxLQUFLLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQztRQUN4RCxNQUFNLGNBQWMsR0FBRyxJQUFJLGtDQUFjLENBQUMsSUFBSSxFQUFFLGlCQUFpQixFQUFFLEVBQUUsV0FBVyxFQUFFLEVBQUUscUJBQXFCLEVBQUUsbUJBQW1CLEVBQUUsbUJBQW1CLEVBQUUsaUJBQWlCLEVBQUUsRUFBRSxZQUFZLEVBQUUsd0JBQWEsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxDQUFBO1FBQ2xOLE1BQU0sY0FBYyxHQUFHLElBQUksa0NBQWMsQ0FBQyxJQUFJLEVBQUUsaUJBQWlCLEVBQUUsRUFBRSxXQUFXLEVBQUUsRUFBRSxxQkFBcUIsRUFBRSxtQkFBbUIsRUFBRSxFQUFFLFlBQVksRUFBRSx3QkFBYSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUE7UUFDMUssTUFBTSxpQkFBaUIsR0FBRyxJQUFJLGtDQUFjLENBQUMsSUFBSSxFQUFFLG9CQUFvQixFQUFFLEVBQUUsV0FBVyxFQUFFLEVBQUUscUJBQXFCLEVBQUUsbUJBQW1CLEVBQUUsRUFBRSxZQUFZLEVBQUUsd0JB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Q0FDSjtBQXRERCx3Q0FzREMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0FwaU1hcHBpbmcsIERvbWFpbk5hbWUsIFdlYlNvY2tldEFwaSwgV2ViU29ja2V0U3RhZ2V9IGZyb20gXCJAYXdzLWNkay9hd3MtYXBpZ2F0ZXdheXYyLWFscGhhXCI7XG5pbXBvcnQge1dlYlNvY2tldExhbWJkYUludGVncmF0aW9ufSBmcm9tIFwiQGF3cy1jZGsvYXdzLWFwaWdhdGV3YXl2Mi1pbnRlZ3JhdGlvbnMtYWxwaGFcIjtcbmltcG9ydCB7YXdzX3JvdXRlNTMgYXMgcm91dGU1M30gZnJvbSBcImF3cy1jZGstbGliXCI7XG5pbXBvcnQge0lDZXJ0aWZpY2F0ZX0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1jZXJ0aWZpY2F0ZW1hbmFnZXJcIjtcbmltcG9ydCB7VGFibGV9IGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtZHluYW1vZGJcIjtcbmltcG9ydCB7Tm9kZWpzRnVuY3Rpb259IGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtbGFtYmRhLW5vZGVqc1wiO1xuaW1wb3J0IHtSZXRlbnRpb25EYXlzfSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWxvZ3NcIjtcbmltcG9ydCB7SUhvc3RlZFpvbmUsIFJlY29yZFRhcmdldH0gZnJvbSBcImF3cy1jZGstbGliL2F3cy1yb3V0ZTUzXCI7XG5pbXBvcnQgKiBhcyB0YXJnZXRzIGZyb20gXCJhd3MtY2RrLWxpYi9hd3Mtcm91dGU1My10YXJnZXRzXCI7XG5pbXBvcnQge0NvbnN0cnVjdH0gZnJvbSBcImNvbnN0cnVjdHNcIjtcblxuZXhwb3J0IGNsYXNzIFdTQXBpQ29uc3RydWN0IGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczoge1xuICAgICAgICBjb25uZWN0aW9uVGFibGU6IFRhYmxlLCBtZXNzYWdlc1RhYmxlOiBUYWJsZSwgaG9zdGVkWm9uZTogSUhvc3RlZFpvbmUsIGNlcnRpZmljYXRlOiBJQ2VydGlmaWNhdGUsIHNpdGVEb21haW46IHN0cmluZ1xuICAgIH0pIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkKVxuXG5cbiAgICAgICAgY29uc3QgY29ubmVjdGlvblRhYmxlTmFtZSA9IHByb3BzLmNvbm5lY3Rpb25UYWJsZS50YWJsZU5hbWU7XG4gICAgICAgIGNvbnN0IG1lc3NhZ2VzVGFibGVOYW1lID0gcHJvcHMubWVzc2FnZXNUYWJsZS50YWJsZU5hbWU7XG4gICAgICAgIGNvbnN0IG1lc3NhZ2VIYW5kbGVyID0gbmV3IE5vZGVqc0Z1bmN0aW9uKHRoaXMsICdtZXNzYWdlLWhhbmRsZXInLCB7IGVudmlyb25tZW50OiB7IENPTk5FQ1RJT05fVEFCTEVfTkFNRTogY29ubmVjdGlvblRhYmxlTmFtZSwgTUVTU0FHRVNfVEFCTEVfTkFNRTogbWVzc2FnZXNUYWJsZU5hbWUgfSwgbG9nUmV0ZW50aW9uOiBSZXRlbnRpb25EYXlzLk9ORV9NT05USCB9KVxuICAgICAgICBjb25zdCBjb25uZWN0SGFuZGxlciA9IG5ldyBOb2RlanNGdW5jdGlvbih0aGlzLCAnY29ubmVjdC1oYW5kbGVyJywgeyBlbnZpcm9ubWVudDogeyBDT05ORUNUSU9OX1RBQkxFX05BTUU6IGNvbm5lY3Rpb25UYWJsZU5hbWUgfSwgbG9nUmV0ZW50aW9uOiBSZXRlbnRpb25EYXlzLk9ORV9NT05USCB9KVxuICAgICAgICBjb25zdCBkaXNjb25uZWN0SGFuZGxlciA9IG5ldyBOb2RlanNGdW5jdGlvbih0aGlzLCAnZGlzY29ubmVjdC1oYW5kbGVyJywgeyBlbnZpcm9ubWVudDogeyBDT05ORUNUSU9OX1RBQkxFX05BTUU6IGNvbm5lY3Rpb25UYWJsZU5hbWUgfSwgbG9nUmV0ZW50aW9uOiBSZXRlbnRpb25EYXlzLk9ORV9NT05USCB9KVxuICAgICAgICBjb25zdCBkZWZhdWx0SGFuZGxlciA9IG5ldyBOb2RlanNGdW5jdGlvbih0aGlzLCAnZGVmYXVsdC1oYW5kbGVyJywgeyBsb2dSZXRlbnRpb246IFJldGVudGlvbkRheXMuT05FX01PTlRIIH0pXG4gICAgICAgIHByb3BzLmNvbm5lY3Rpb25UYWJsZS5ncmFudFJlYWRXcml0ZURhdGEoY29ubmVjdEhhbmRsZXIpXG4gICAgICAgIHByb3BzLmNvbm5lY3Rpb25UYWJsZS5ncmFudFJlYWRXcml0ZURhdGEoZGlzY29ubmVjdEhhbmRsZXIpXG4gICAgICAgIHByb3BzLmNvbm5lY3Rpb25UYWJsZS5ncmFudFJlYWREYXRhKG1lc3NhZ2VIYW5kbGVyKVxuICAgICAgICBwcm9wcy5tZXNzYWdlc1RhYmxlLmdyYW50V3JpdGVEYXRhKG1lc3NhZ2VIYW5kbGVyKVxuXG4gICAgICAgIGNvbnN0IHdlYlNvY2tldEFwaSA9IG5ldyBXZWJTb2NrZXRBcGkodGhpcywgJ1dlYlNvY2tldEFwaScsIHtcbiAgICAgICAgICAgIHJvdXRlU2VsZWN0aW9uRXhwcmVzc2lvbjogJyRyZXF1ZXN0LmJvZHkuYWN0aW9uJyxcbiAgICAgICAgICAgIGRlZmF1bHRSb3V0ZU9wdGlvbnM6IHsgaW50ZWdyYXRpb246IG5ldyBXZWJTb2NrZXRMYW1iZGFJbnRlZ3JhdGlvbignRGVmYXVsdEludGVncmF0aW9uJywgZGVmYXVsdEhhbmRsZXIpIH0sXG4gICAgICAgICAgICBjb25uZWN0Um91dGVPcHRpb25zOiB7IGludGVncmF0aW9uOiBuZXcgV2ViU29ja2V0TGFtYmRhSW50ZWdyYXRpb24oJ0Nvbm5lY3RJbnRlZ3JhdGlvbicsIGNvbm5lY3RIYW5kbGVyKSB9LFxuICAgICAgICAgICAgZGlzY29ubmVjdFJvdXRlT3B0aW9uczogeyBpbnRlZ3JhdGlvbjogbmV3IFdlYlNvY2tldExhbWJkYUludGVncmF0aW9uKCdEaXNjb25uZWN0SW50ZWdyYXRpb24nLCBkaXNjb25uZWN0SGFuZGxlcikgfVxuICAgICAgICB9KVxuICAgICAgICB3ZWJTb2NrZXRBcGkuYWRkUm91dGUoJ21lc3NhZ2UnLCB7IGludGVncmF0aW9uOiBuZXcgV2ViU29ja2V0TGFtYmRhSW50ZWdyYXRpb24oJ01lc3NhZ2VJbnRlZ3JhdGlvbicsIG1lc3NhZ2VIYW5kbGVyKSB9KVxuXG5cbiAgICAgICAgd2ViU29ja2V0QXBpLmdyYW50TWFuYWdlQ29ubmVjdGlvbnMobWVzc2FnZUhhbmRsZXIpXG4gICAgICAgIHdlYlNvY2tldEFwaS5ncmFudE1hbmFnZUNvbm5lY3Rpb25zKGNvbm5lY3RIYW5kbGVyKVxuICAgICAgICB3ZWJTb2NrZXRBcGkuZ3JhbnRNYW5hZ2VDb25uZWN0aW9ucyhkaXNjb25uZWN0SGFuZGxlcilcblxuICAgICAgICBjb25zdCBzdGFnZSA9IG5ldyBXZWJTb2NrZXRTdGFnZSh0aGlzLCAncHJvZCcsIHtcbiAgICAgICAgICAgIHdlYlNvY2tldEFwaSwgc3RhZ2VOYW1lOiAncHJvZCcsIGF1dG9EZXBsb3k6IHRydWUsIHRocm90dGxlOiB7XG4gICAgICAgICAgICAgICAgcmF0ZUxpbWl0OiAxMCwgYnVyc3RMaW1pdDogMjBcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgbWVzc2FnZUhhbmRsZXIuYWRkRW52aXJvbm1lbnQoJ0NBTExCQUNLX1VSTCcsIHN0YWdlLmNhbGxiYWNrVXJsKVxuICAgICAgICBjb25uZWN0SGFuZGxlci5hZGRFbnZpcm9ubWVudCgnQ0FMTEJBQ0tfVVJMJywgc3RhZ2UuY2FsbGJhY2tVcmwpXG4gICAgICAgIGRpc2Nvbm5lY3RIYW5kbGVyLmFkZEVudmlyb25tZW50KCdDQUxMQkFDS19VUkwnLCBzdGFnZS5jYWxsYmFja1VybClcblxuICAgICAgICBjb25zdCBjaGF0V1NBcGlEb21haW5OYW1lID0gYGNoYXQtd3MtYXBpLiR7cHJvcHMuc2l0ZURvbWFpbn1gO1xuICAgICAgICBjb25zdCBkb21haW5OYW1lID0gbmV3IERvbWFpbk5hbWUodGhpcywgJ0RvbWFpbk5hbWUnLCB7XG4gICAgICAgICAgICBkb21haW5OYW1lOiBjaGF0V1NBcGlEb21haW5OYW1lLFxuICAgICAgICAgICAgY2VydGlmaWNhdGU6IHByb3BzLmNlcnRpZmljYXRlXG4gICAgICAgIH0pO1xuXG4gICAgICAgIG5ldyBBcGlNYXBwaW5nKHRoaXMsICdNYXBwaW5nJywge2FwaTogd2ViU29ja2V0QXBpLCBkb21haW5OYW1lLCBzdGFnZX0pXG4gICAgICAgIG5ldyByb3V0ZTUzLkFSZWNvcmQodGhpcywgJ0FyZWNvcmQnLCB7XG4gICAgICAgICAgICB0YXJnZXQ6IFJlY29yZFRhcmdldC5mcm9tQWxpYXMobmV3IHRhcmdldHMuQXBpR2F0ZXdheXYyRG9tYWluUHJvcGVydGllcyhkb21haW5OYW1lLnJlZ2lvbmFsRG9tYWluTmFtZSwgZG9tYWluTmFtZS5yZWdpb25hbEhvc3RlZFpvbmVJZCkpLFxuICAgICAgICAgICAgem9uZTogcHJvcHMuaG9zdGVkWm9uZSxcbiAgICAgICAgICAgIHJlY29yZE5hbWU6IGNoYXRXU0FwaURvbWFpbk5hbWVcbiAgICAgICAgfSlcbiAgICB9XG59Il19