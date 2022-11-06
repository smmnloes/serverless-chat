"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// lib/api/api-construct.default-handler.ts
var api_construct_default_handler_exports = {};
__export(api_construct_default_handler_exports, {
  handler: () => handler
});
module.exports = __toCommonJS(api_construct_default_handler_exports);
var import_aws_sdk = require("aws-sdk");
var handler = async (event) => {
  console.log(JSON.stringify(event, null, 4));
  const callBackUrl = process.env.CALLBACK_URL;
  const callbackAPI = new import_aws_sdk.ApiGatewayManagementApi({
    apiVersion: "2018-11-29",
    endpoint: callBackUrl
  });
  await callbackAPI.postToConnection({ ConnectionId: event.requestContext.connectionId, Data: `Recieved number: ${event.body}` }).promise();
  return {
    statusCode: 200,
    body: "hello client"
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  handler
});
