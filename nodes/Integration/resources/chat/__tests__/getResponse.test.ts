/**
 * Unit tests for Agencii.ai Platform Integration - Get Response operation
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

describe("Agencii Platform Integration - Get Response", () => {
  let getResponseOperation: INodeProperties | undefined;

  beforeAll(() => {
    // Find the operation definition
    getResponseOperation = chatDescription.find((prop) => prop.name === "operation");
  });

  describe("Operation Definition", () => {
    it("should define getResponse operation", () => {
      expect(getResponseOperation).toBeDefined();
      expect(getResponseOperation?.type).toBe("options");

      const options = (getResponseOperation?.options as any[]) || [];
      const getResponseOption = options.find((opt) => opt.value === "getResponse");

      expect(getResponseOption).toBeDefined();
      expect(getResponseOption?.name).toBe("Get Response");
      expect(getResponseOption?.action).toBe("Send message to agency");
    });

    it("should use POST method", () => {
      const options = (getResponseOperation?.options as any[]) || [];
      const getResponseOption = options.find((opt) => opt.value === "getResponse");

      expect(getResponseOption?.routing?.request?.method).toBe("POST");
    });

    it("should use correct endpoint (root path on Agencii.ai platform)", () => {
      const options = (getResponseOperation?.options as any[]) || [];
      const getResponseOption = options.find((opt) => opt.value === "getResponse");

      expect(getResponseOption?.routing?.request?.url).toBe("/");
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
      const options = (getResponseOperation?.options as any[]) || [];
      const getResponseOption = options.find((opt) => opt.value === "getResponse");

      expect(getResponseOption?.routing?.output?.postReceive).toBeDefined();
      expect(Array.isArray(getResponseOption?.routing?.output?.postReceive)).toBe(true);
      expect(getResponseOption?.routing?.output?.postReceive?.length).toBeGreaterThan(0);
    });

    it("should normalize sessionId from various field names", async () => {
      const options = (getResponseOperation?.options as any[]) || [];
      const getResponseOption = options.find((opt) => opt.value === "getResponse");
      const postReceive = getResponseOption?.routing?.output?.postReceive?.[0];

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
      const options = (getResponseOperation?.options as any[]) || [];
      const getResponseOption = options.find((opt) => opt.value === "getResponse");
      const postReceive = getResponseOption?.routing?.output?.postReceive?.[0];

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
    it("should only show message field for getResponse operation", () => {
      const promptField = chatDescription.find((prop) => prop.name === "prompt");

      expect(promptField?.displayOptions?.show?.operation).toEqual(["getResponse"]);
      expect(promptField?.displayOptions?.show?.resource).toEqual(["chat"]);
    });

    it("should only show sessionId field for getResponse operation", () => {
      const chatIdField = chatDescription.find((prop) => prop.name === "chatId");

      expect(chatIdField?.displayOptions?.show?.operation).toEqual(["getResponse"]);
      expect(chatIdField?.displayOptions?.show?.resource).toEqual(["chat"]);
    });
  });
});
