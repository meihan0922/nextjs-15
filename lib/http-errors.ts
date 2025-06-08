// 自定義不同類型的錯誤

export class RequestError extends Error {
  statusCode: number;
  errors?: Record<string, string[]>;

  constructor(
    statusCode: number,
    message: string,
    errors?: Record<string, string[]>,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.name = "RequestError";
  }
}

export class ValidationError extends RequestError {
  constructor(fieldErrors: Record<string, string[]>) {
    /**
     *  {
          formErrors: [], // 如果是整體 schema 失敗（非某個欄位）才會有
          fieldErrors: {
              name: ["名字太短"],
              age: ["年齡不能低於 18 歲"]
          }
        }
     */
    const message = ValidationError.formatFieldErrors(fieldErrors);
    super(400, message, fieldErrors);
    this.name = "ValidationError";
    this.errors = fieldErrors;
  }

  // Zod 最大的特點之一：完全以 TypeScript 為導向、運作於 runtime，並且「環境無關」（即不依賴 Node.js 或瀏覽器 API）。
  // 可以「共用一份 schema」在 client 和 server 做驗證。
  static formatFieldErrors(errors: Record<string, string[]>): string {
    const formattedMessages = Object.entries(errors).map(
      ([field, messages]) => {
        const fieldName = field.charAt(0).toUpperCase() + field.slice(1);

        if (messages[0] === "Required") {
          return `${fieldName} is required`;
        } else {
          return messages.join(" and "); // 把這個欄位的所有錯誤串在一起回傳
        }
      },
    );

    // 把每個欄位 所有錯誤都串在一起
    return formattedMessages.join(", ");
  }
}

export class NotFoundError extends RequestError {
  constructor(resource: string) {
    super(404, `${resource} not found`);
    this.name = "NotFoundError";
  }
}

export class ForbiddenError extends RequestError {
  constructor(message: string = "Forbidden") {
    super(403, message);
    this.name = "ForbiddenError";
  }
}

export class UnauthorizedError extends RequestError {
  constructor(message: string = "Unauthorized") {
    super(401, message);
    this.name = "UnauthorizedError";
  }
}
