import { NextResponse } from "next/server";

import User, { IUserDoc } from "@/database/user.model";
import handleError from "@/lib/handlers/error";
import { NotFoundError } from "@/lib/http-errors";
import dbconnect from "@/lib/mongoose";
import { UserSchema } from "@/lib/validations";
import { APIErrorResponse } from "@/types/global";

// GET /api/users/[id]
export async function GET(
  _: Request,
  { params }: { params: Promise<IUserDoc["id"]> },
) {
  const { id } = await params;

  if (!id) throw new NotFoundError("User");

  try {
    await dbconnect();
    const user = await User.findById(id); // = findOne({_id: id})
    if (!user) throw new NotFoundError("User");

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (err) {
    return handleError(err, "api") as APIErrorResponse;
  }
}

// DELETE /api/users/[id]
export async function DELETE(
  _: Request,
  { params }: { params: Promise<IUserDoc["id"]> },
) {
  const { id } = await params;

  if (!id) throw new NotFoundError("User");

  try {
    await dbconnect();
    const user = await User.findByIdAndDelete(id);
    if (!user) throw new NotFoundError("User");

    return NextResponse.json({ success: true, data: user }, { status: 200 });
  } catch (err) {
    return handleError(err, "api") as APIErrorResponse;
  }
}

// PUT /api/users/[id]
export async function PUT(
  request: Request,
  { params }: { params: Promise<IUserDoc["id"]> },
) {
  const { id } = await params;

  if (!id) throw new NotFoundError("User");

  try {
    await dbconnect();
    const body = await request.json();

    // .partial() 方法會讓 schema 裡的所有欄位變成 可選 (optional)
    // parse - 驗證失敗會直接拋出錯誤，進入 catch
    // safeParse - 不會 throw error，而是回傳一個物件 { success: true, data } 或 { success: false, error }
    const validatedData = UserSchema.partial().parse(body);

    // 因為默認會是舊的物件，設定成 true 是新的
    const updatedUser = await User.findByIdAndUpdate(id, validatedData, {
      new: true,
    });

    if (!updatedUser) throw new NotFoundError("User");

    return NextResponse.json(
      { success: true, data: updatedUser },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
