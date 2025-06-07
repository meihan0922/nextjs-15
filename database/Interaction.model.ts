import { model, models, Schema, Types, Document } from "mongoose";

// 用於跟蹤使用者作，例如投票、查看或提問。
// 此模型對於了解使用者如何與平臺互動至關重要，並有助於構建推薦演算法以提供個人化體驗。
// 包含做了什麼？是贊成票、反對票、流覽量，還是發佈新問題？
export interface IInteraction {
  user: Types.ObjectId;
  action: string; // 可以是 upVote | downVote | askQuestion | 或任何互動內容
  actionId: Types.ObjectId; // 可以是 question 的 ID | answer 的 ID
  actionType: "question" | "answer";
}

export interface IInteractionDoc extends IInteraction, Document {}

const InteractionSchema = new Schema<IInteraction>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true },
    actionId: { type: Schema.Types.ObjectId, required: true },
    actionType: { type: String, enum: ["question", "answer"], required: true },
  },
  { timestamps: true },
);

const Interaction =
  models?.Interaction || model<IInteraction>("Interaction", InteractionSchema);

export default Interaction;
