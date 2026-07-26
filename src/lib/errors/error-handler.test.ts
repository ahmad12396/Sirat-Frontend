import { AxiosHeaders } from "axios";
import { describe, expect, it } from "vitest";
import { z } from "zod";

import { ERROR_CODES } from "@/lib/errors/ErrorCodes";
import { normalizeError } from "@/lib/errors/error-handler";

describe("normalizeError", () => {
  it("passes an AppError through unchanged", () => {
    const original = normalizeError(new Error("boom"));
    expect(normalizeError(original)).toBe(original);
  });

  it("converts a ZodError into a validation AppError with field errors", () => {
    const schema = z.object({ email: z.string().email() });
    const result = schema.safeParse({ email: "not-an-email" });
    expect(result.success).toBe(false);

    const appError = normalizeError(result.error);

    expect(appError.code).toBe(ERROR_CODES.VALIDATION_ERROR);
    expect(appError.fieldErrors?.[0]?.field).toBe("email");
  });

  it("converts a network-level Axios error (no response) into NETWORK_ERROR", () => {
    const axiosError = Object.assign(new Error("Network Error"), {
      isAxiosError: true,
      toJSON: () => ({}),
      config: { headers: new AxiosHeaders() },
    });

    const appError = normalizeError(axiosError);

    expect(appError.code).toBe(ERROR_CODES.NETWORK_ERROR);
  });

  it("converts a plain Error into an UNKNOWN_ERROR", () => {
    const appError = normalizeError(new Error("something broke"));
    expect(appError.code).toBe(ERROR_CODES.UNKNOWN_ERROR);
    expect(appError.message).toBe("something broke");
  });

  it("converts a non-Error thrown value into an UNKNOWN_ERROR", () => {
    const appError = normalizeError("just a string");
    expect(appError.code).toBe(ERROR_CODES.UNKNOWN_ERROR);
  });
});
