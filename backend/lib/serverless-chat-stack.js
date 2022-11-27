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
exports.ServerlessChatStack = void 0;
const cdk = __importStar(require("aws-cdk-lib"));
const domain_construct_1 = require("./api/domain/domain-construct");
const rest_api_construct_1 = require("./api/rest-api/rest-api-construct");
const ws_api_construct_1 = require("./api/ws-api/ws-api-construct");
const dynamo_tables_1 = require("./dynamo/dynamo-tables");
const distribution_1 = require("./distribution/distribution");
class ServerlessChatStack extends cdk.Stack {
    constructor(scope, id, props) {
        super(scope, id, props);
        const dynamoTablesConstruct = new dynamo_tables_1.DynamoTablesConstruct(this, 'DynamoTables');
        const domainConstruct = new domain_construct_1.DomainConstruct(this, 'Domain');
        new ws_api_construct_1.WSApiConstruct(this, 'WSApi', {
            connectionTable: dynamoTablesConstruct.connectionTable,
            messagesTable: dynamoTablesConstruct.messagesTable,
            hostedZone: domainConstruct.hostedZone,
            certificate: domainConstruct.euCertificate,
            siteDomain: domainConstruct.siteDomain
        });
        new rest_api_construct_1.RestApiConstruct(this, 'RestApi', {
            certificate: domainConstruct.euCertificate,
            hostedZone: domainConstruct.hostedZone,
            siteDomain: domainConstruct.siteDomain,
            connectionTable: dynamoTablesConstruct.connectionTable,
            messagesTable: dynamoTablesConstruct.messagesTable
        });
        new distribution_1.DistributionConstruct(this, 'Distribution', {
            siteDomain: domainConstruct.siteDomain,
            zone: domainConstruct.hostedZone,
            certificate: domainConstruct.usCertificate
        });
    }
}
exports.ServerlessChatStack = ServerlessChatStack;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVybGVzcy1jaGF0LXN0YWNrLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsic2VydmVybGVzcy1jaGF0LXN0YWNrLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsaURBQW1DO0FBRW5DLG9FQUE4RDtBQUM5RCwwRUFBbUU7QUFDbkUsb0VBQTZEO0FBQzdELDBEQUE2RDtBQUM3RCw4REFBa0U7QUFHbEUsTUFBYSxtQkFBb0IsU0FBUSxHQUFHLENBQUMsS0FBSztJQUM5QyxZQUFZLEtBQWdCLEVBQUUsRUFBVSxFQUFFLEtBQXNCO1FBQzVELEtBQUssQ0FBQyxLQUFLLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQ3hCLE1BQU0scUJBQXFCLEdBQUcsSUFBSSxxQ0FBcUIsQ0FBQyxJQUFJLEVBQUUsY0FBYyxDQUFDLENBQUE7UUFDN0UsTUFBTSxlQUFlLEdBQUcsSUFBSSxrQ0FBZSxDQUFDLElBQUksRUFBRSxRQUFRLENBQUMsQ0FBQTtRQUMzRCxJQUFJLGlDQUFjLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRTtZQUM5QixlQUFlLEVBQUUscUJBQXFCLENBQUMsZUFBZTtZQUN0RCxhQUFhLEVBQUUscUJBQXFCLENBQUMsYUFBYTtZQUNsRCxVQUFVLEVBQUUsZUFBZSxDQUFDLFVBQVU7WUFDdEMsV0FBVyxFQUFFLGVBQWUsQ0FBQyxhQUFhO1lBQzFDLFVBQVUsRUFBRSxlQUFlLENBQUMsVUFBVTtTQUN6QyxDQUFDLENBQUE7UUFDRixJQUFJLHFDQUFnQixDQUFDLElBQUksRUFBRSxTQUFTLEVBQUU7WUFDbEMsV0FBVyxFQUFFLGVBQWUsQ0FBQyxhQUFhO1lBQzFDLFVBQVUsRUFBRSxlQUFlLENBQUMsVUFBVTtZQUN0QyxVQUFVLEVBQUUsZUFBZSxDQUFDLFVBQVU7WUFDdEMsZUFBZSxFQUFFLHFCQUFxQixDQUFDLGVBQWU7WUFDdEQsYUFBYSxFQUFFLHFCQUFxQixDQUFDLGFBQWE7U0FDckQsQ0FBQyxDQUFBO1FBQ0YsSUFBSSxvQ0FBcUIsQ0FBQyxJQUFJLEVBQUUsY0FBYyxFQUFFO1lBQzVDLFVBQVUsRUFBRSxlQUFlLENBQUMsVUFBVTtZQUN0QyxJQUFJLEVBQUUsZUFBZSxDQUFDLFVBQVU7WUFDaEMsV0FBVyxFQUFFLGVBQWUsQ0FBQyxhQUFhO1NBQzdDLENBQUMsQ0FBQTtJQUNOLENBQUM7Q0FDSjtBQXpCRCxrREF5QkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBjZGsgZnJvbSAnYXdzLWNkay1saWInO1xuaW1wb3J0IHtDb25zdHJ1Y3R9IGZyb20gJ2NvbnN0cnVjdHMnO1xuaW1wb3J0IHtEb21haW5Db25zdHJ1Y3R9IGZyb20gJy4vYXBpL2RvbWFpbi9kb21haW4tY29uc3RydWN0JztcbmltcG9ydCB7UmVzdEFwaUNvbnN0cnVjdH0gZnJvbSAnLi9hcGkvcmVzdC1hcGkvcmVzdC1hcGktY29uc3RydWN0JztcbmltcG9ydCB7V1NBcGlDb25zdHJ1Y3R9IGZyb20gJy4vYXBpL3dzLWFwaS93cy1hcGktY29uc3RydWN0JztcbmltcG9ydCB7RHluYW1vVGFibGVzQ29uc3RydWN0fSBmcm9tICcuL2R5bmFtby9keW5hbW8tdGFibGVzJztcbmltcG9ydCB7RGlzdHJpYnV0aW9uQ29uc3RydWN0fSBmcm9tIFwiLi9kaXN0cmlidXRpb24vZGlzdHJpYnV0aW9uXCI7XG5cblxuZXhwb3J0IGNsYXNzIFNlcnZlcmxlc3NDaGF0U3RhY2sgZXh0ZW5kcyBjZGsuU3RhY2sge1xuICAgIGNvbnN0cnVjdG9yKHNjb3BlOiBDb25zdHJ1Y3QsIGlkOiBzdHJpbmcsIHByb3BzPzogY2RrLlN0YWNrUHJvcHMpIHtcbiAgICAgICAgc3VwZXIoc2NvcGUsIGlkLCBwcm9wcyk7XG4gICAgICAgIGNvbnN0IGR5bmFtb1RhYmxlc0NvbnN0cnVjdCA9IG5ldyBEeW5hbW9UYWJsZXNDb25zdHJ1Y3QodGhpcywgJ0R5bmFtb1RhYmxlcycpXG4gICAgICAgIGNvbnN0IGRvbWFpbkNvbnN0cnVjdCA9IG5ldyBEb21haW5Db25zdHJ1Y3QodGhpcywgJ0RvbWFpbicpXG4gICAgICAgIG5ldyBXU0FwaUNvbnN0cnVjdCh0aGlzLCAnV1NBcGknLCB7XG4gICAgICAgICAgICBjb25uZWN0aW9uVGFibGU6IGR5bmFtb1RhYmxlc0NvbnN0cnVjdC5jb25uZWN0aW9uVGFibGUsXG4gICAgICAgICAgICBtZXNzYWdlc1RhYmxlOiBkeW5hbW9UYWJsZXNDb25zdHJ1Y3QubWVzc2FnZXNUYWJsZSxcbiAgICAgICAgICAgIGhvc3RlZFpvbmU6IGRvbWFpbkNvbnN0cnVjdC5ob3N0ZWRab25lLFxuICAgICAgICAgICAgY2VydGlmaWNhdGU6IGRvbWFpbkNvbnN0cnVjdC5ldUNlcnRpZmljYXRlLFxuICAgICAgICAgICAgc2l0ZURvbWFpbjogZG9tYWluQ29uc3RydWN0LnNpdGVEb21haW5cbiAgICAgICAgfSlcbiAgICAgICAgbmV3IFJlc3RBcGlDb25zdHJ1Y3QodGhpcywgJ1Jlc3RBcGknLCB7XG4gICAgICAgICAgICBjZXJ0aWZpY2F0ZTogZG9tYWluQ29uc3RydWN0LmV1Q2VydGlmaWNhdGUsXG4gICAgICAgICAgICBob3N0ZWRab25lOiBkb21haW5Db25zdHJ1Y3QuaG9zdGVkWm9uZSxcbiAgICAgICAgICAgIHNpdGVEb21haW46IGRvbWFpbkNvbnN0cnVjdC5zaXRlRG9tYWluLFxuICAgICAgICAgICAgY29ubmVjdGlvblRhYmxlOiBkeW5hbW9UYWJsZXNDb25zdHJ1Y3QuY29ubmVjdGlvblRhYmxlLFxuICAgICAgICAgICAgbWVzc2FnZXNUYWJsZTogZHluYW1vVGFibGVzQ29uc3RydWN0Lm1lc3NhZ2VzVGFibGVcbiAgICAgICAgfSlcbiAgICAgICAgbmV3IERpc3RyaWJ1dGlvbkNvbnN0cnVjdCh0aGlzLCAnRGlzdHJpYnV0aW9uJywge1xuICAgICAgICAgICAgc2l0ZURvbWFpbjogZG9tYWluQ29uc3RydWN0LnNpdGVEb21haW4sXG4gICAgICAgICAgICB6b25lOiBkb21haW5Db25zdHJ1Y3QuaG9zdGVkWm9uZSxcbiAgICAgICAgICAgIGNlcnRpZmljYXRlOiBkb21haW5Db25zdHJ1Y3QudXNDZXJ0aWZpY2F0ZVxuICAgICAgICB9KVxuICAgIH1cbn1cbiJdfQ==