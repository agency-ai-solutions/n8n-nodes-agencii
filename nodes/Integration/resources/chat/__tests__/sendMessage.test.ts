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
    it("should define message/prompt parameter as required", () => {
      const promptField = chatDescription.find((prop) => prop.name === "prompt");

      expect(promptField).toBeDefined();
      expect(promptField?.required).toBe(true);
      expect(promptField?.type).toBe("string");
    });

    it("should send message in request body", () => {
      const promptField = chatDescription.find((prop) => prop.name === "prompt");

      expect(promptField?.routing?.send?.type).toBe("body");
      expect(promptField?.routing?.send?.property).toBe("prompt");
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

      expect(integrationIdField?.default).toBe("={{$credentials.integrationId}}");
    });
  });

  describe("Optional Parameters", () => {
    it("should define sessionId/chatId parameter as optional", () => {
      const chatIdField = chatDescription.find((prop) => prop.name === "chatId");

      expect(chatIdField).toBeDefined();
      expect(chatIdField?.required).toBeUndefined();
      expect(chatIdField?.type).toBe("string");
    });

    it("should send sessionId in request body when provided", () => {
      const chatIdField = chatDescription.find((prop) => prop.name === "chatId");

      expect(chatIdField?.routing?.send?.type).toBe("body");
      expect(chatIdField?.routing?.send?.property).toBe("chatId");
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
        { json: { chatId: "session-123" } },
        { json: { id: "session-456" } },
        { json: { chat_id: "session-789" } },
        { json: { sessionId: "session-abc" } },
      ];

      for (const item of testCases) {
        const result = await postReceive?.call({}, [item], {});
        expect(result[0].json.chatId).toBeDefined();
      }
    });

    it("should normalize agency response text from various field names", async () => {
      const options = (sendMessageOperation?.options as any[]) || [];
      const sendMessageOption = options.find((opt) => opt.value === "sendMessage");
      const postReceive = sendMessageOption?.routing?.output?.postReceive?.[0];

      // Mock items with different response text field names
      const testCases = [
        { json: { text: "Agency response 1", chatId: "session-1" } },
        { json: { response: "Agency response 2", chatId: "session-2" } },
        { json: { content: "Agency response 3", chatId: "session-3" } },
        { json: { message: "Agency response 4", chatId: "session-4" } },
      ];

      for (const item of testCases) {
        const result = await postReceive?.call({}, [item], {});
        expect(result[0].json.text).toBeDefined();
      }
    });
  });

  describe("Display Options", () => {
    it("should only show message field for sendMessage operation", () => {
      const promptField = chatDescription.find((prop) => prop.name === "prompt");

      expect(promptField?.displayOptions?.show?.operation).toEqual(["sendMessage"]);
      expect(promptField?.displayOptions?.show?.resource).toEqual(["chat"]);
    });

    it("should only show sessionId field for sendMessage operation", () => {
      const chatIdField = chatDescription.find((prop) => prop.name === "chatId");

      expect(chatIdField?.displayOptions?.show?.operation).toEqual(["sendMessage"]);
      expect(chatIdField?.displayOptions?.show?.resource).toEqual(["chat"]);
    });
  });
});
