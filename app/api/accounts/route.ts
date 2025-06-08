import { NextResponse } from "next/server";

import Account from "@/database/account.model";
import User from "@/database/user.model";
import handleError from "@/lib/handlers/error";
import { ForbiddenError } from "@/lib/http-errors";
import dbconnect from "@/lib/mongoose";
import { AccountSchema } from "@/lib/validations";
import { APIErrorResponse } from "@/types/global";

// GET /api/accounts
export async function GET() {
  try {
    await dbconnect();
    const accounts = await Account.find();

    return NextResponse.json(
      { success: true, data: accounts },
      { status: 200 },
    );
  } catch (err) {
    return handleError(err, "api") as APIErrorResponse;
  }
}

// Create user
export async function POST(request: Request) {
  try {
    await dbconnect();
    const body = await request.json();

    const validatedData = AccountSchema.parse(body);

    const existingAccount = await User.findOne({
      provider: validatedData?.provider,
      providerAccountId: validatedData?.providerAccountId,
    });
    if (existingAccount)
      throw new ForbiddenError(
        "An Account with the same provider already exists",
      );

    const newAccount = await Account.create(validatedData);
    return NextResponse.json(
      { success: true, data: newAccount },
      { status: 201 },
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
