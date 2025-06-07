import { model, models, Schema, Types, Document } from "mongoose";

// 單個使用者可以有多個帳戶
export interface IAccount {
  userId: Types.ObjectId; // 對應到 User Model
  name: string;
  image?: string;
  password?: string; // 傳統的帳密登入，對於某些身份驗證不是必需的
  provider: string; // google, fb,  github, etc.
  providerAccountId: string;
}

export interface IAccountDoc extends IAccount, Document {}

const AccountSchema = new Schema<IAccount>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    image: { type: String },
    password: { type: String },
    provider: { type: String, required: true },
    providerAccountId: { type: String, required: true },
  },
  { timestamps: true },
);

const Account = models?.Account || model<IAccount>("Account", AccountSchema);

export default Account;
