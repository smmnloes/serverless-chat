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
exports.RestApiConstruct = void 0;
const aws_apigateway_1 = require("aws-cdk-lib/aws-apigateway");
const aws_lambda_nodejs_1 = require("aws-cdk-lib/aws-lambda-nodejs");
const aws_logs_1 = require("aws-cdk-lib/aws-logs");
const aws_route53_1 = require("aws-cdk-lib/aws-route53");
const targets = __importStar(require("aws-cdk-lib/aws-route53-targets"));
const constructs_1 = require("constructs");
class RestApiConstruct extends constructs_1.Construct {
    constructor(scope, id, props) {
        super(scope, id);
        const chatRestApiDomainName = `chat-rest-api.${props.siteDomain}`;
        const restApi = new aws_apigateway_1.RestApi(this, 'RestApi', {
            defaultCorsPreflightOptions: {
                allowOrigins: aws_apigateway_1.Cors.ALL_ORIGINS, allowMethods: aws_apigateway_1.Cors.ALL_METHODS
            }
        });
        restApi.addDomainName('DomainName', {
            certificate: props.certificate, domainName: chatRestApiDomainName
        });
        new aws_route53_1.ARecord(this, 'Arecord', {
            target: aws_route53_1.RecordTarget.fromAlias(new targets.ApiGateway(restApi)),
            zone: props.hostedZone,
            recordName: chatRestApiDomainName
        });
        const getAllConnectedUsersHandler = new aws_lambda_nodejs_1.NodejsFunction(this, 'get-connected-users-handler', {
            environment: { CONNECTION_TABLE_NAME: props.connectionTable.tableName }, logRetention: aws_logs_1.RetentionDays.ONE_MONTH
        });
        const getAllMessagesHandler = new aws_lambda_nodejs_1.NodejsFunction(this, 'get-all-messages-handler', {
            environment: { MESSAGES_TABLE_NAME: props.messagesTable.tableName }, logRetention: aws_logs_1.RetentionDays.ONE_MONTH
        });
        const getUsernameAvailableHandler = new aws_lambda_nodejs_1.NodejsFunction(this, 'get-username-available-handler', {
            environment: { CONNECTION_TABLE_NAME: props.connectionTable.tableName }, logRetention: aws_logs_1.RetentionDays.ONE_MONTH
        });
        props.connectionTable.grantReadData(getAllConnectedUsersHandler);
        props.connectionTable.grantReadData(getUsernameAvailableHandler);
        props.messagesTable.grantReadWriteData(getAllMessagesHandler);
        const userResource = restApi.root.addResource('user');
        userResource.addMethod('GET', new aws_apigateway_1.LambdaIntegration(getAllConnectedUsersHandler));
        userResource.addResource('{username}').addMethod('GET', new aws_apigateway_1.LambdaIntegration(getUsernameAvailableHandler));
        restApi.root.addResource('message').addMethod('GET', new aws_apigateway_1.LambdaIntegration(getAllMessagesHandler));
    }
}
exports.RestApiConstruct = RestApiConstruct;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzdC1hcGktY29uc3RydWN0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicmVzdC1hcGktY29uc3RydWN0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsK0RBQTRFO0FBRzVFLHFFQUE2RDtBQUM3RCxtREFBbUQ7QUFDbkQseURBQTJFO0FBQzNFLHlFQUEyRDtBQUMzRCwyQ0FBcUM7QUFFckMsTUFBYSxnQkFBaUIsU0FBUSxzQkFBUztJQUMzQyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBRXpDO1FBQ0csS0FBSyxDQUFDLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQTtRQUVoQixNQUFNLHFCQUFxQixHQUFHLGlCQUFpQixLQUFLLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDbEUsTUFBTSxPQUFPLEdBQUcsSUFBSSx3QkFBTyxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUU7WUFDekMsMkJBQTJCLEVBQUU7Z0JBQ3pCLFlBQVksRUFBRSxxQkFBSSxDQUFDLFdBQVcsRUFBRSxZQUFZLEVBQUUscUJBQUksQ0FBQyxXQUFXO2FBQ2pFO1NBQ0osQ0FBQyxDQUFBO1FBQ0YsT0FBTyxDQUFDLGFBQWEsQ0FBQyxZQUFZLEVBQUU7WUFDaEMsV0FBVyxFQUFFLEtBQUssQ0FBQyxXQUFXLEVBQUUsVUFBVSxFQUFFLHFCQUFxQjtTQUNwRSxDQUFDLENBQUE7UUFDRixJQUFJLHFCQUFPLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRTtZQUN6QixNQUFNLEVBQUUsMEJBQVksQ0FBQyxTQUFTLENBQUMsSUFBSSxPQUFPLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQy9ELElBQUksRUFBRSxLQUFLLENBQUMsVUFBVTtZQUN0QixVQUFVLEVBQUUscUJBQXFCO1NBQ3BDLENBQUMsQ0FBQTtRQUVGLE1BQU0sMkJBQTJCLEdBQUcsSUFBSSxrQ0FBYyxDQUFDLElBQUksRUFBRSw2QkFBNkIsRUFBRTtZQUN4RixXQUFXLEVBQUUsRUFBQyxxQkFBcUIsRUFBRSxLQUFLLENBQUMsZUFBZSxDQUFDLFNBQVMsRUFBQyxFQUFFLFlBQVksRUFBRSx3QkFBYSxDQUFDLFNBQVM7U0FDL0csQ0FBQyxDQUFBO1FBQ0YsTUFBTSxxQkFBcUIsR0FBRyxJQUFJLGtDQUFjLENBQUMsSUFBSSxFQUFFLDBCQUEwQixFQUFFO1lBQy9FLFdBQVcsRUFBRSxFQUFDLG1CQUFtQixFQUFFLEtBQUssQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFDLEVBQUUsWUFBWSxFQUFFLHdCQUFhLENBQUMsU0FBUztTQUMzRyxDQUFDLENBQUE7UUFDRixNQUFNLDJCQUEyQixHQUFHLElBQUksa0NBQWMsQ0FBQyxJQUFJLEVBQUUsZ0NBQWdDLEVBQUU7WUFDM0YsV0FBVyxFQUFFLEVBQUMscUJBQXFCLEVBQUUsS0FBSyxDQUFDLGVBQWUsQ0FBQyxTQUFTLEVBQUMsRUFBRSxZQUFZLEVBQUUsd0JBQWEsQ0FBQyxTQUFTO1NBQy9HLENBQUMsQ0FBQTtRQUNGLEtBQUssQ0FBQyxlQUFlLENBQUMsYUFBYSxDQUFDLDJCQUEyQixDQUFDLENBQUE7UUFDaEUsS0FBSyxDQUFDLGVBQWUsQ0FBQyxhQUFhLENBQUMsMkJBQTJCLENBQUMsQ0FBQTtRQUNoRSxLQUFLLENBQUMsYUFBYSxDQUFDLGtCQUFrQixDQUFDLHFCQUFxQixDQUFDLENBQUE7UUFDN0QsTUFBTSxZQUFZLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdEQsWUFBWSxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxrQ0FBaUIsQ0FBQywyQkFBMkIsQ0FBQyxDQUFDLENBQUE7UUFDakYsWUFBWSxDQUFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksa0NBQWlCLENBQUMsMkJBQTJCLENBQUMsQ0FBQyxDQUFBO1FBRTNHLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEVBQUUsSUFBSSxrQ0FBaUIsQ0FBQyxxQkFBcUIsQ0FBQyxDQUFDLENBQUE7SUFDdEcsQ0FBQztDQUNKO0FBdkNELDRDQXVDQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29ycywgTGFtYmRhSW50ZWdyYXRpb24sIFJlc3RBcGl9IGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtYXBpZ2F0ZXdheVwiO1xuaW1wb3J0IHtJQ2VydGlmaWNhdGV9IGZyb20gXCJhd3MtY2RrLWxpYi9hd3MtY2VydGlmaWNhdGVtYW5hZ2VyXCI7XG5pbXBvcnQge1RhYmxlfSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWR5bmFtb2RiXCI7XG5pbXBvcnQge05vZGVqc0Z1bmN0aW9ufSBmcm9tIFwiYXdzLWNkay1saWIvYXdzLWxhbWJkYS1ub2RlanNcIjtcbmltcG9ydCB7UmV0ZW50aW9uRGF5c30gZnJvbSBcImF3cy1jZGstbGliL2F3cy1sb2dzXCI7XG5pbXBvcnQge0FSZWNvcmQsIElIb3N0ZWRab25lLCBSZWNvcmRUYXJnZXR9IGZyb20gXCJhd3MtY2RrLWxpYi9hd3Mtcm91dGU1M1wiO1xuaW1wb3J0ICogYXMgdGFyZ2V0cyBmcm9tIFwiYXdzLWNkay1saWIvYXdzLXJvdXRlNTMtdGFyZ2V0c1wiO1xuaW1wb3J0IHtDb25zdHJ1Y3R9IGZyb20gXCJjb25zdHJ1Y3RzXCI7XG5cbmV4cG9ydCBjbGFzcyBSZXN0QXBpQ29uc3RydWN0IGV4dGVuZHMgQ29uc3RydWN0IHtcbiAgICBjb25zdHJ1Y3RvcihzY29wZTogQ29uc3RydWN0LCBpZDogc3RyaW5nLCBwcm9wczoge1xuICAgICAgICBjZXJ0aWZpY2F0ZTogSUNlcnRpZmljYXRlLCBob3N0ZWRab25lOiBJSG9zdGVkWm9uZSwgc2l0ZURvbWFpbjogc3RyaW5nLCBjb25uZWN0aW9uVGFibGU6IFRhYmxlLCBtZXNzYWdlc1RhYmxlOiBUYWJsZVxuICAgIH0pIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkKVxuXG4gICAgICAgIGNvbnN0IGNoYXRSZXN0QXBpRG9tYWluTmFtZSA9IGBjaGF0LXJlc3QtYXBpLiR7cHJvcHMuc2l0ZURvbWFpbn1gO1xuICAgICAgICBjb25zdCByZXN0QXBpID0gbmV3IFJlc3RBcGkodGhpcywgJ1Jlc3RBcGknLCB7XG4gICAgICAgICAgICBkZWZhdWx0Q29yc1ByZWZsaWdodE9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICBhbGxvd09yaWdpbnM6IENvcnMuQUxMX09SSUdJTlMsIGFsbG93TWV0aG9kczogQ29ycy5BTExfTUVUSE9EU1xuICAgICAgICAgICAgfVxuICAgICAgICB9KVxuICAgICAgICByZXN0QXBpLmFkZERvbWFpbk5hbWUoJ0RvbWFpbk5hbWUnLCB7XG4gICAgICAgICAgICBjZXJ0aWZpY2F0ZTogcHJvcHMuY2VydGlmaWNhdGUsIGRvbWFpbk5hbWU6IGNoYXRSZXN0QXBpRG9tYWluTmFtZVxuICAgICAgICB9KVxuICAgICAgICBuZXcgQVJlY29yZCh0aGlzLCAnQXJlY29yZCcsIHtcbiAgICAgICAgICAgIHRhcmdldDogUmVjb3JkVGFyZ2V0LmZyb21BbGlhcyhuZXcgdGFyZ2V0cy5BcGlHYXRld2F5KHJlc3RBcGkpKSxcbiAgICAgICAgICAgIHpvbmU6IHByb3BzLmhvc3RlZFpvbmUsXG4gICAgICAgICAgICByZWNvcmROYW1lOiBjaGF0UmVzdEFwaURvbWFpbk5hbWVcbiAgICAgICAgfSlcblxuICAgICAgICBjb25zdCBnZXRBbGxDb25uZWN0ZWRVc2Vyc0hhbmRsZXIgPSBuZXcgTm9kZWpzRnVuY3Rpb24odGhpcywgJ2dldC1jb25uZWN0ZWQtdXNlcnMtaGFuZGxlcicsIHtcbiAgICAgICAgICAgIGVudmlyb25tZW50OiB7Q09OTkVDVElPTl9UQUJMRV9OQU1FOiBwcm9wcy5jb25uZWN0aW9uVGFibGUudGFibGVOYW1lfSwgbG9nUmV0ZW50aW9uOiBSZXRlbnRpb25EYXlzLk9ORV9NT05USFxuICAgICAgICB9KVxuICAgICAgICBjb25zdCBnZXRBbGxNZXNzYWdlc0hhbmRsZXIgPSBuZXcgTm9kZWpzRnVuY3Rpb24odGhpcywgJ2dldC1hbGwtbWVzc2FnZXMtaGFuZGxlcicsIHtcbiAgICAgICAgICAgIGVudmlyb25tZW50OiB7TUVTU0FHRVNfVEFCTEVfTkFNRTogcHJvcHMubWVzc2FnZXNUYWJsZS50YWJsZU5hbWV9LCBsb2dSZXRlbnRpb246IFJldGVudGlvbkRheXMuT05FX01PTlRIXG4gICAgICAgIH0pXG4gICAgICAgIGNvbnN0IGdldFVzZXJuYW1lQXZhaWxhYmxlSGFuZGxlciA9IG5ldyBOb2RlanNGdW5jdGlvbih0aGlzLCAnZ2V0LXVzZXJuYW1lLWF2YWlsYWJsZS1oYW5kbGVyJywge1xuICAgICAgICAgICAgZW52aXJvbm1lbnQ6IHtDT05ORUNUSU9OX1RBQkxFX05BTUU6IHByb3BzLmNvbm5lY3Rpb25UYWJsZS50YWJsZU5hbWV9LCBsb2dSZXRlbnRpb246IFJldGVudGlvbkRheXMuT05FX01PTlRIXG4gICAgICAgIH0pXG4gICAgICAgIHByb3BzLmNvbm5lY3Rpb25UYWJsZS5ncmFudFJlYWREYXRhKGdldEFsbENvbm5lY3RlZFVzZXJzSGFuZGxlcilcbiAgICAgICAgcHJvcHMuY29ubmVjdGlvblRhYmxlLmdyYW50UmVhZERhdGEoZ2V0VXNlcm5hbWVBdmFpbGFibGVIYW5kbGVyKVxuICAgICAgICBwcm9wcy5tZXNzYWdlc1RhYmxlLmdyYW50UmVhZFdyaXRlRGF0YShnZXRBbGxNZXNzYWdlc0hhbmRsZXIpXG4gICAgICAgIGNvbnN0IHVzZXJSZXNvdXJjZSA9IHJlc3RBcGkucm9vdC5hZGRSZXNvdXJjZSgndXNlcicpO1xuICAgICAgICB1c2VyUmVzb3VyY2UuYWRkTWV0aG9kKCdHRVQnLCBuZXcgTGFtYmRhSW50ZWdyYXRpb24oZ2V0QWxsQ29ubmVjdGVkVXNlcnNIYW5kbGVyKSlcbiAgICAgICAgdXNlclJlc291cmNlLmFkZFJlc291cmNlKCd7dXNlcm5hbWV9JykuYWRkTWV0aG9kKCdHRVQnLCBuZXcgTGFtYmRhSW50ZWdyYXRpb24oZ2V0VXNlcm5hbWVBdmFpbGFibGVIYW5kbGVyKSlcblxuICAgICAgICByZXN0QXBpLnJvb3QuYWRkUmVzb3VyY2UoJ21lc3NhZ2UnKS5hZGRNZXRob2QoJ0dFVCcsIG5ldyBMYW1iZGFJbnRlZ3JhdGlvbihnZXRBbGxNZXNzYWdlc0hhbmRsZXIpKVxuICAgIH1cbn0iXX0=