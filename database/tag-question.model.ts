import { model, models, Schema, Types } from "mongoose";

// 考慮到兩個需求
// 1. 問題相關的標籤有幾個 2. 真正關聯tag的問題有哪些
// 所以在 tag 上去紀錄所有的問題 id 有哪些不太好，問題的數量只會變多
// 另外設定一個 model 來關聯 問題 與 tag，這樣篩選時，就會比較快，也不用每次使用 tag 時，都要去關心 2.
export interface ITagQuestion {
  tag: Types.ObjectId;
  question: Types.ObjectId;
}

const TagQuestionSchema = new Schema<ITagQuestion>(
  {
    tag: { type: Schema.Types.ObjectId, ref: "Tag", required: true },
    question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
  },
  { timestamps: true },
);

const TagQuestion =
  models?.tagQuestion || model<ITagQuestion>("TagQuestion", TagQuestionSchema);

export default TagQuestion;
