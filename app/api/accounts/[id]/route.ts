import { NextResponse } from "next/server";

import Account, { IAccountDoc } from "@/database/account.model";
import handleError from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/http-errors";
import dbconnect from "@/lib/mongoose";
import { AccountSchema } from "@/lib/validations";
import { APIErrorResponse } from "@/types/global";

// GET /api/accounts/[id]
export async function GET(
  _: Request,
  { params }: { params: Promise<IAccountDoc["id"]> },
) {
  const { id } = await params;

  if (!id) throw new NotFoundError("Account");

  try {
    await dbconnect();
    const account = await Account.findById(id);
    if (!account) throw new NotFoundError("Account");

    return NextResponse.json({ success: true, data: account }, { status: 200 });
  } catch (err) {
    return handleError(err, "api") as APIErrorResponse;
  }
}

// DELETE /api/accounts/[id]
export async function DELETE(
  _: Request,
  { params }: { params: Promise<IAccountDoc["id"]> },
) {
  const { id } = await params;

  if (!id) throw new NotFoundError("Account");

  try {
    await dbconnect();
    const account = await Account.findByIdAndDelete(id);
    if (!account) throw new NotFoundError("Account");

    return NextResponse.json({ success: true, data: account }, { status: 200 });
  } catch (err) {
    return handleError(err, "api") as APIErrorResponse;
  }
}

// PUT /api/accounts/[id]
export async function PUT(
  request: Request,
  { params }: { params: Promise<IAccountDoc["id"]> },
) {
  const { id } = await params;

  if (!id) throw new NotFoundError("Account");

  try {
    await dbconnect();
    const body = await request.json();

    // .partial() 方法會讓 schema 裡的所有欄位變成 可選 (optional)
    // parse - 驗證失敗會直接拋出錯誤，進入 catch
    // safeParse - 不會 throw error，而是回傳一個物件 { success: true, data } 或 { success: false, error }
    const validatedData = AccountSchema.partial().safeParse(body);

    if (!validatedData.success)
      throw new ValidationError(validatedData.error.flatten().fieldErrors);

    // 因為默認會是舊的物件，設定成 true 是新的
    const updatedAccount = await Account.findByIdAndUpdate(id, validatedData, {
      new: true,
    });

    if (!updatedAccount) throw new NotFoundError("Account");

    return NextResponse.json(
      { success: true, data: updatedAccount },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
