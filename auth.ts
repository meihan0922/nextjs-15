import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import { api } from "./lib/api";

/**
1. 使用者點擊登入按鈕（signIn("github") 或 signIn("google")）
       ↓
2. 成功完成第三方 OAuth 認證
       ↓
3. NextAuth 呼叫 signIn callback
       ↓
4. 你自定義的 signIn() 被呼叫：
     - 可以打自己的 API
     - 可能創建 user、account 等資料庫資料
     - 決定是否 allow 登入（return true / false）
       ↓
5. NextAuth 呼叫 jwt callback（建立或更新 token）
       ↓
6. 你自定義的 jwt() 被呼叫：
     - 你查資料庫，把 MongoDB 的 userId 放進 token.sub
       （例如：token.sub = "6643db8f1a23c99a..."）
       ↓
7. NextAuth 呼叫 session callback（產生給前端看的 session）
       ↓
8. 自定義的 session() 被呼叫：
     - 你把 token.sub 塞進 session.user.id
       （讓前端拿到的 session 包含 Mongo 使用者 id）
       ↓
9. 前端 useSession() 拿到：
  他會在背後打 /api/auth/session 拿到 session 資料
  資料是從 cookie 裡的 jwt token 解出來的（ jwt callback 塞進去的
  除非『頁面刷新』或是『手動觸發更新』才會發 request
   {
     user: {
       id: "6643db8f1a23c99a...", ← 你自己補進來的
       name: "Mei Huang",
       email: "mei@example.com",
       image: "..."
     }
   }
 */

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [GitHub, Google],
  callbacks: {
    async signIn({ user, account, profile }) {
      // TODO: 帳號密碼登入
      if (account?.type === "credentials") {
        return true;
      }

      if (!account || !user) return false;

      const userInfo = {
        name: user.name!,
        email: user.email!,
        image: user.image!,
        username: (account.provider === "github"
          ? profile?.login
          : user.name?.toLowerCase()) as string,
      };

      const { success } = await api.auth.signInWithOAuth({
        provider: account.provider as "github" | "google",
        providerAccountId: account.providerAccountId,
        user: userInfo,
      });

      if (!success) return false;

      return true;
    },
    async jwt({ token, account }) {
      if (account) {
        const { data: existingAccount, success } =
          await api.accounts.getByProvider(
            account.type === "credentials"
              ? token.email!
              : account.providerAccountId,
          );

        if (!existingAccount || !success) return token;

        const userId = existingAccount.userId;
        if (userId) {
          token.sub = userId.toString();
        }

        return token;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
});
