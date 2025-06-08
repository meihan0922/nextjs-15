import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { RequestError, ValidationError } from "../http-errors";
import logger from "../logger";

export type ResponseType = "api" | "server";

// 包裝 success 進 response 當中，另外看是不是 api route 的錯誤，就 NextResponse 包裹
const formatResponse = (
  responseType: ResponseType,
  status: number,
  message: string,
  errors?: Record<string, string[]> | undefined,
) => {
  const responseContent = {
    success: false,
    error: {
      message,
      details: errors,
    },
  };

  return responseType === "api"
    ? NextResponse.json(responseContent, { status })
    : { status, ...responseContent };
};

// API Route 時，回傳 HTTP Response 物件，可以使用 next 當中的方法，因此 使用 NextResponse.json
// 不在 API Route 時，可能在 SSR Fn 當中，或是某個後端的邏輯 log 當中調用，或是只是想要個錯誤物件，就是單純的 JS 物件
const handleError = (err: unknown, responseType: ResponseType = "server") => {
  if (err instanceof RequestError) {
    logger.error(
      { err },
      `${responseType.toUpperCase()} Error: ${err.message}`,
    );

    return formatResponse(
      responseType,
      err.statusCode,
      err.message,
      err.errors,
    );
  }

  // Zod 最大的特點之一：完全以 TypeScript 為導向、運作於 runtime，並且「環境無關」（即不依賴 Node.js 或瀏覽器 API）。
  // 可以「共用一份 schema」在 client 和 server 做驗證。
  if (err instanceof ZodError) {
    /**
     * ZodError {
        issues: [
            {
            code: "too_small",
            minimum: 2,
            type: "string",
            inclusive: true,
            message: "名字太短",
            path: ["name"]
            },
            {
            code: "too_small",
            minimum: 18,
            type: "number",
            inclusive: true,
            message: "年齡不能低於 18 歲",
            path: ["age"]
            }
        ]
        }
        
     * flatten 之後
        {
            formErrors: [], // 如果是整體 schema 失敗（非某個欄位）才會有
            fieldErrors: {
                name: ["名字太短"],
                age: ["年齡不能低於 18 歲"]
            }
        }
     */
    const validationError = new ValidationError(
      err.flatten().fieldErrors as Record<string, string[]>,
    );

    logger.error({ err }, `Validation Error: ${validationError.message}`);

    return formatResponse(
      responseType,
      validationError.statusCode,
      validationError.message,
      validationError.errors,
    );
  }

  if (err instanceof Error) {
    logger.error(err.message);

    return formatResponse(responseType, 500, err.message);
  }

  logger.error({ err }, "An unexpected error occurred");
  return formatResponse(responseType, 500, "An unexpected error occurred");
};

export default handleError;
