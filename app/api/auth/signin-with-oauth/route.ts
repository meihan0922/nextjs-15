import mongoose from "mongoose";
import { NextResponse } from "next/server";
import slugify from "slugify";

import Account from "@/database/account.model";
import User, { IUser } from "@/database/user.model";
import handleError from "@/lib/handlers/error";
import { ValidationError } from "@/lib/http-errors";
import dbconnect from "@/lib/mongoose";
import { SignInWithOAuthSchema } from "@/lib/validations";

// 確定此用戶已在資料庫中，是一對多的關係，一個用戶可以對應多個帳戶（有多種登入方式）
// 所以
// 如果沒有用戶要建立用戶與帳戶
// 如果有用戶，如果有帳戶，且用戶的 name || image 為空，則更新
// 如果有用戶，如果沒有帳戶，則建立帳戶
export async function POST(request: Request) {
  const { provider, providerAccountId, user } = await request.json();

  await dbconnect();

  // 好比拿了一張交易憑證
  // 這行會向 MongoDB 要求開一個 客戶端 Session。
  // Session 本身就是一個容器，你可以在它之下啟動 transaction，也可以在平常查詢時帶著它用來追蹤操作上下文。
  const session = await mongoose.startSession();
  // Transaction: 開始這組交易，要做的事都會先暫存。把多件事綁成一組，只要有一件失敗，就全部「撤銷」不做！
  session.startTransaction();

  try {
    const validatedData = SignInWithOAuthSchema.safeParse({
      provider,
      providerAccountId,
      user,
    });

    if (!validatedData.success)
      throw new ValidationError(validatedData.error.flatten().fieldErrors);

    const { name, username, email, image } = user;

    // 把使用者輸入的 username，轉成一個乾淨、適合當作網址或資料庫 key 的字串
    // ex: original: "Mei Huang" -> "mei-huang"
    const slugifiedUsername = slugify(username, {
      lower: true,
      strict: true,
      trim: true,
    });

    // 將這個操作納入交易中 保證這個操作會跟其他一起成功/失敗
    let existingUser = await User.findOne({ email }).session(session);

    if (!existingUser) {
      [existingUser] = await User.create(
        [
          {
            name,
            username: slugifiedUsername,
            email,
            image,
          },
        ],
        { session },
      );
    } else {
      const updatedData: Partial<Pick<IUser, "name" | "image">> = {};
      if (existingUser.name !== name) updatedData.name = name;
      if (existingUser.image !== image) updatedData.image = image;

      if (Object.keys(updatedData).length > 0) {
        await User.updateOne(
          { _id: existingUser._id },
          { $set: updatedData },
        ).session(session);
      }
    }

    const existingAccount = await Account.findOne({
      userId: existingUser._id,
    }).session(session);

    if (!existingAccount) {
      await Account.create(
        [
          {
            userId: existingUser._id,
            name,
            image,
            provider,
            providerAccountId,
          },
        ],
        { session },
      );
    }

    // 提交交易 所有操作正式寫入資料庫
    await session.commitTransaction();

    return NextResponse.json({ success: true });
  } catch (error) {
    // 中止交易 所有操作取消，資料不變
    await session.abortTransaction();
    return handleError(error, "api");
  } finally {
    // 結束這個 session，不管你是已經 commit 成功、或是 abort 了，都要把 session 結束掉，釋放伺服器端的資源
    session.endSession();
  }
}
