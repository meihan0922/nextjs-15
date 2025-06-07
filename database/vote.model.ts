import { model, models, Schema, Types, Document } from "mongoose";

// 1. 防止使用者對同一項目進行多次投票
// 2. 可以輕鬆獲取使用者的所有投票
// 3. 易於查詢: 如查找對特定答案投贊成票的所有使用者，或檢查使用者是否對特定問題投了反對票
// 4. 不會在問題或是答案的 model 當中，出現大量的 使用者 ID，簡化檢索和更新
export interface IVote {
  author: Types.ObjectId;
  actionId: Types.ObjectId; // 正在投票的內容（問題或答案）的 ID。引用相關 Question 或 Answer 的 ObjectId
  type: "question" | "answer";
  voteType: "upvote" | "downvote";
}

export interface IVoteDoc extends IVote, Document {}

const VoteSchema = new Schema<IVote>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    actionId: { type: Schema.Types.ObjectId, required: true },
    type: { type: String, enum: ["question", "answer"], required: true },
    voteType: { type: String, enum: ["upvote", "downvote"], required: true },
  },
  { timestamps: true },
);

const Vote = models?.Vote || model<IVote>("Vote", VoteSchema);

export default Vote;
