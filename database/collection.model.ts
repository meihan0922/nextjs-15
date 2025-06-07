import { model, models, Schema, Types, Document } from "mongoose";

// 用於使用者收藏問題，因此標記 User 和 Question
// 避免放入 User 當中，避免隨著時間增長數量變超多
export interface ICollection {
  author: Types.ObjectId;
  question: Types.ObjectId;
}

export interface ICollectionDoc extends ICollection, Document {}

const CollectionSchema = new Schema<ICollection>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
  },
  { timestamps: true },
);

const Collection =
  models?.Collection || model<ICollection>("Collection", CollectionSchema);

export default Collection;
