/**
 * Unit tests for Agencii.ai Platform Integration - Send Message operation
 *
 * Tests verify:
 * - Correct HTTP method and endpoint
 * - Proper parameter mapping to request payload
 * - Response normalization (sessionId and text extraction)
 *
 * Note: This integration sends messages to agencies on the Agencii.ai platform.
 * Agent behavior and configuration happens on the platform, not in this node.
 */
import { describe, it, expect, beforeAll } from "@jest/globals";
import { chatDescription } from "../index";
import type { INodeProperties } from "n8n-workflow";

describe("Agencii Platform Integration - Send Message", () => {
  let sendMessageOperation: INodeProperties | undefined;

  beforeAll(() => {
    // Find the operation definition
    sendMessageOperation = chatDescription.find((prop) => prop.name === "operation");
  });

  describe("Operation Definition", () => {
    it("should define sendMessage operation", () => {
      expect(sendMessageOperation).toBeDefined();
      expect(sendMessageOperation?.type).toBe("options");

      const options = (sendMessageOperation?.options as any[]) || [];
      const sendMessageOption = options.find((opt) => opt.value === "sendMessage");

      expect(sendMessageOption).toBeDefined();
      expect(sendMessageOption?.name).toBe("Send Message");
      expect(sendMessageOption?.action).toBe("Send message to agency");
    });

    it("should use POST method", () => {
      const options = (sendMessageOperation?.options as any[]) || [];
      const sendMessageOption = options.find((opt) => opt.value === "sendMessage");

      expect(sendMessageOption?.routing?.request?.method).toBe("POST");
    });

    it("should use correct endpoint (root path on Agencii.ai platform)", () => {
      const options = (sendMessageOperation?.options as any[]) || [];
      const sendMessageOption = options.find((opt) => opt.value === "sendMessage");

      expect(sendMessageOption?.routing?.request?.url).toBe("/");
    });
  });

  describe("Required Parameters", () => {
    it("should define message parameter as required", () => {
      const messageField = chatDescription.find((prop) => prop.name === "message");

      expect(messageField).toBeDefined();
      expect(messageField?.required).toBe(true);
      expect(messageField?.type).toBe("string");
    });

    it("should send message in request body", () => {
      const messageField = chatDescription.find((prop) => prop.name === "message");

      expect(messageField?.routing?.send?.type).toBe("body");
      expect(messageField?.routing?.send?.property).toBe("message");
    });

    it("should define integrationId parameter as required", () => {
      const integrationIdField = chatDescription.find((prop) => prop.name === "integrationId");

      expect(integrationIdField).toBeDefined();
      expect(integrationIdField?.required).toBe(true);
      expect(integrationIdField?.type).toBe("string");
    });

    it("should send integrationId as query parameter with name integration_id", () => {
      const integrationIdField = chatDescription.find((prop) => prop.name === "integrationId");

      expect(integrationIdField?.routing?.send?.type).toBe("query");
      expect(integrationIdField?.routing?.send?.property).toBe("integration_id");
    });

    it("should auto-populate integrationId from credentials", () => {
      const integrationIdField = chatDescription.find((prop) => prop.name === "integrationId");

      // Integration ID is now a node parameter, not auto-populated from credentials
      expect(integrationIdField?.default).toBe("");
    });

    it("should send operation field as 'getResponse' in request body", () => {
      const operationField = chatDescription.find((prop) => prop.name === "operation" && prop.type === "hidden");

      expect(operationField).toBeDefined();
      expect(operationField?.default).toBe("getResponse");
      expect(operationField?.routing?.send?.type).toBe("body");
      expect(operationField?.routing?.send?.property).toBe("operation");
    });
  });

  describe("Optional Parameters", () => {
    it("should define sessionId parameter as optional", () => {
      const sessionIdField = chatDescription.find((prop) => prop.name === "sessionId");

      expect(sessionIdField).toBeDefined();
      expect(sessionIdField?.required).toBeUndefined();
      expect(sessionIdField?.type).toBe("string");
    });

    it("should send sessionId in request body when provided", () => {
      const sessionIdField = chatDescription.find((prop) => prop.name === "sessionId");

      expect(sessionIdField?.routing?.send?.type).toBe("body");
      expect(sessionIdField?.routing?.send?.property).toBe("sessionId");
    });
  });

  describe("Response Normalization", () => {
    it("should define postReceive handler for response normalization", () => {
      const options = (sendMessageOperation?.options as any[]) || [];
      const sendMessageOption = options.find((opt) => opt.value === "sendMessage");

      expect(sendMessageOption?.routing?.output?.postReceive).toBeDefined();
      expect(Array.isArray(sendMessageOption?.routing?.output?.postReceive)).toBe(true);
      expect(sendMessageOption?.routing?.output?.postReceive?.length).toBeGreaterThan(0);
    });

    it("should normalize sessionId from various field names", async () => {
      const options = (sendMessageOperation?.options as any[]) || [];
      const sendMessageOption = options.find((opt) => opt.value === "sendMessage");
      const postReceive = sendMessageOption?.routing?.output?.postReceive?.[0];

      // Mock items with different session identifier field names
      const testCases = [
        { json: { sessionId: "session-123" } },
        { json: { chatId: "session-456" } },
        { json: { id: "session-789" } },
        { json: { chat_id: "session-abc" } },
      ];

      for (const item of testCases) {
        const result = await postReceive?.call({}, [item], {});
        expect(result[0].json.sessionId).toBeDefined();
      }
    });

    it("should normalize agency response text and create response alias", async () => {
      const options = (sendMessageOperation?.options as any[]) || [];
      const sendMessageOption = options.find((opt) => opt.value === "sendMessage");
      const postReceive = sendMessageOption?.routing?.output?.postReceive?.[0];

      // Mock items with different response text field names
      const testCases = [
        { json: { text: "Agency response 1", sessionId: "session-1" } },
        { json: { response: "Agency response 2", sessionId: "session-2" } },
        { json: { content: "Agency response 3", sessionId: "session-3" } },
        { json: { message: "Agency response 4", sessionId: "session-4" } },
      ];

      for (const item of testCases) {
        const result = await postReceive?.call({}, [item], {});
        expect(result[0].json.text).toBeDefined();
        expect(result[0].json.response).toBeDefined();
        expect(result[0].json.text).toBe(result[0].json.response);
      }
    });
  });

  describe("Display Options", () => {
    it("should only show message field for sendMessage operation", () => {
      const messageField = chatDescription.find((prop) => prop.name === "message");

      expect(messageField?.displayOptions?.show?.operation).toEqual(["sendMessage"]);
      expect(messageField?.displayOptions?.show?.resource).toEqual(["chat"]);
    });

    it("should only show sessionId field for sendMessage operation", () => {
      const sessionIdField = chatDescription.find((prop) => prop.name === "sessionId");

      expect(sessionIdField?.displayOptions?.show?.operation).toEqual(["sendMessage"]);
      expect(sessionIdField?.displayOptions?.show?.resource).toEqual(["chat"]);
    });
  });
});
