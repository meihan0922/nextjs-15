import { ActionResponse } from "@/types/global";

import { RequestError } from "../http-errors";
import logger from "../logger";
import handleError from "./error";

interface FetchOptions extends RequestInit {
  timeout?: number;
}

/**
 * JavaScript 容許你 throw 任何東西
 * throw "something went wrong"; throw 123; throw { message: "出錯了" };
 */
// 讓錯誤處理更有保障：保證 error 一定是 Error 物件，後續可以安全使用 error.message 等屬性。
function isError(error: unknown): error is Error {
  return error instanceof Error;
}

// 封裝 超時邏輯(AbortController) 錯誤機制 headers
export async function fetchHandler<T>(
  url: string,
  options: FetchOptions = {},
): Promise<ActionResponse<T>> {
  const {
    timeout = 500,
    headers: customHeaders = {},
    ...restOptions
  } = options;

  const controller = new AbortController();
  // 超時停止請求
  const id = setTimeout(() => controller.abort(), timeout);

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const headers: HeadersInit = {
    ...defaultHeaders,
    ...customHeaders,
  };

  const config: RequestInit = {
    ...restOptions,
    headers,
    signal: controller.signal,
  };

  try {
    const response = await fetch(url, config);

    clearTimeout(id);

    if (!response.ok)
      throw new RequestError(response.status, `HTTP error: ${response.status}`);
    return await response.json();
  } catch (err) {
    // 如果不是（例如是字串、物件等），就建立一個新的 Error("Unknown error") 作為保底錯誤處理。
    const error = isError(err) ? err : new Error("Unknown error");

    if (error.name === "AbortError") {
      logger.warn(`Request to ${url} timed out`);
    } else {
      logger.error(`Error fetching ${url}: ${error.message}`);
    }

    return handleError(error) as ActionResponse<T>;
  }
}
