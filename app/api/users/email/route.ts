import { NextResponse } from "next/server";

import User from "@/database/user.model";
import handleError from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/http-errors";
import dbconnect from "@/lib/mongoose";
import { UserSchema } from "@/lib/validations";
import { APIErrorResponse } from "@/types/global";

// 使用 POST 獲取用戶資訊，避免 email 這種私人的資料，出現在 url 上
// GET 請求常常會被瀏覽器、CDN、代理快取

// GET user by email
export async function POST(request: Request) {
  try {
    await dbconnect();
    const { email } = await request.json();

    const validatedData = UserSchema.pick({ email: true }).safeParse({ email });
    if (!validatedData.success) {
      throw new ValidationError(validatedData.error.flatten().fieldErrors);
    }

    const user = await User.findOne({ email });

    if (!user) throw new NotFoundError("User");

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
