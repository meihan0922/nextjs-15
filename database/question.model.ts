import { model, models, Schema, Types } from "mongoose";

export interface IQuestion {
  title: string;
  content: string;
  tags: Types.ObjectId[]; // 對應到 Tag Model
  views: number; // 瀏覽數
  answers: number; // 回應數
  upvotes: number;
  downvotes: number;
  author: Types.ObjectId; // 對應到 User Model，一個問題對應一個作者
}

const QuestionSchema = new Schema<IQuestion>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    views: { type: Number },
    answers: { type: Number },
    upvotes: { type: Number },
    downvotes: { type: Number },
    author: { type: Schema.Types.ObjectId, ref: "User", unique: true },
  },
  { timestamps: true },
);

const Question =
  models?.question || model<IQuestion>("Question", QuestionSchema);

export default Question;
