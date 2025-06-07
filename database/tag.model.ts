import { model, models, Schema } from "mongoose";

// 考慮到兩個需求
// 1. 問題相關的標籤有幾個 2. 真正關聯tag的問題有哪些
// 所以在 tag 上去紀錄所有的問題 id 有哪些不太好，問題的數量只會變多
// 另外設定一個 model 來關聯 問題 與 tag，這樣篩選時，就會比較快，也不用每次使用 tag 時，都要去關心 2.
export interface ITag {
  name: string;
  questions: number;
}

const TagSchema = new Schema<ITag>(
  {
    name: { type: String },
    questions: { type: Number },
  },
  { timestamps: true },
);

const Tag = models?.tag || model<ITag>("Tag", TagSchema);

export default Tag;
