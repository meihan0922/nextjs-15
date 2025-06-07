import { model, models, Schema, Types, Document } from "mongoose";

export interface IQuestion {
  title: string;
  content: string;
  tags: Types.ObjectId[]; // 對應到 Tag Model，一個問題對應到多個標籤
  views: number; // 瀏覽數
  answers: number; // 是一對多的關係，所以不用存成陣列
  upvotes: number;
  downvotes: number;
  author: Types.ObjectId; // 對應到 User Model，一個問題對應一個作者
}

export interface IQuestionDoc extends IQuestion, Document {}

const QuestionSchema = new Schema<IQuestion>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    views: { type: Number, default: 0 },
    answers: { type: Number, default: 0 },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    author: { type: Schema.Types.ObjectId, ref: "User", unique: true },
  },
  { timestamps: true },
);

const Question =
  models?.Question || model<IQuestion>("Question", QuestionSchema);

export default Question;
