import { NextResponse } from "next/server";

import Account from "@/database/account.model";
import handleError from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/http-errors";
import dbconnect from "@/lib/mongoose";
import { AccountSchema } from "@/lib/validations";
import { APIErrorResponse } from "@/types/global";

// 使用 POST 獲取用戶資訊，避免 email 這種私人的資料，出現在 url 上
// GET 請求常常會被瀏覽器、CDN、代理快取

// GET account by providerAccountId
export async function POST(request: Request) {
  try {
    await dbconnect();
    const { providerAccountId } = await request.json();

    const validatedData = AccountSchema.pick({
      providerAccountId: true,
    }).safeParse({ providerAccountId });
    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    const account = await Account.findOne({ providerAccountId });

    if (!account) throw new NotFoundError("Account");

    return NextResponse.json({ success: true, data: account }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
