import { model, models, Schema, Document } from "mongoose";

export interface IUser {
  name: string;
  username: string;
  email: string;
  bio?: string;
  image?: string;
  location?: string;
  portfolio?: string;
  reputation?: number;
}

// https://github.com/Automattic/mongoose/issues/11615
// 這樣做才可以使用到特定於 Mongoose 的欄位 <ex: _id || methods>
// 但如果 export interface IUser extends Document {...} 這樣寫 會影響性能
// 可以寫成 export type IUserDoc = IUser & Document; | export interface IUserDoc extends IUser, Document {}
export interface IUserDoc extends IUser, Document {}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    bio: { type: String },
    image: { type: String },
    location: { type: String },
    portfolio: { type: String },
    reputation: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const User = models?.User || model<IUser>("User", UserSchema);

export default User;
