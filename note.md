- edge runtime 的特點：
  - ✅ 非常像 CDN！
  - CDN 是「靜態內容」（圖片、HTML、影片）快取的全球節點；
  - Edge Runtime 則是「執行程式邏輯」的全球節點，全球分散式的迷你資料中心（節點） → 請求時直接在最近的節點執行
- Edge Runtime 是一種非常輕量的 JavaScript 執行環境，可以在「全球各地」的節點快速執行程式碼，不需要 Node.js、也不需要自己維護伺服器。
  - 但沒有 Node 的能力，使用 Web API。
  - 可快速啟動
  - 安全性高（被限制在 sandbox 不能亂存取系統資源）
  - 部署在全球（瀏覽器請求直接由最近節點處理）

---

- 符合 Serverless 特點:
  1. 不需要養伺服器，平台（如 Vercel、AWS Lambda）幫你處理
  2. 執行即收費，請求來了才啟動，執行完就結束
  3. 難以儲存狀態，每次都是「新的一次執行」（ 第一次啟動會延遲，但之後可快速啟動
  4. 很適合 API、邏輯，例如登入、寄信、送出表單處理等
     | 技術 | 舉例 |
     | ---- | ---- |
     | Serverless 平台 | Vercel, AWS Lambda, Netlify Functions |
     | Serverless 框架 | Next.js, Remix, SvelteKit（都有內建支援）
     | Serverless 實踐方式 | API Routes, Server Actions, Edge Functions

---

- 適用的 5 大場景: Edge Runtime 很適合做「進入應用之前」的第一層邏輯處理
  1. 登入驗證的檢查：在 Middleware 中先檢查使用者有沒有登入，沒有的話直接 redirect。
     就可以不用連到主要的後端才回應，節省 API 成本、加速使用者體驗
  2. 根據地區 / 語系導向頁面
     可根據地理位置、瀏覽器設定決定語系，延遲超低
  3. A/B 測試
     在進入應用前就分流，不會浪費後端或資源
  4. Header / Cookie 攔截與修改: 可於 Edge 階段就攔截所有請求／回應，例如加上自訂 header 或處理 CSP 安全性。
     有助於安全性檢測
  5. 快速輕量 API 回應
     - 回傳 JSON、簡單字串、小邏輯處理，非常適合用 Edge Function 實作。
- 回應速度超快沒有資料庫／不用複雜邏輯
- 不適合的場景
  1. 資料庫連線: 無 TCP、無連線池、無持久狀態
  2. 處理檔案上傳
  3. 無法使用 express, jsonwebtoken 等依賴 Node 的套件
  4. 大型運算: 每次執行資源受限（時間 / 記憶體）

---

```tsx
"use client";

async function requestUsername(formData) {
  "use server";
  const username = formData.get("username");
  // ...
}
/**
 * `use server` It means that it isn't just a function call. A request was actually made to the Next.js API to call that function. It's just we can't see them as Next.js hides it for us. It’s abstracted from us.
But under the hood, whatever we write inside the function labeled as "use server" is turned into an API with a POST method.
 **/

// In short, we’re doing this:
// async function requestUsername(formData) {
//   const response = await fetch("some_url", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       // Add other headers as needed
//     },
//     body: JSON.stringify({
//       username: formData.get("username"),
//       // Add other key-value pairs for your request payload
//     }), // data transfer into JSON
//   });
// }
// server runtime execute the action.
//   ↓
// Perform database operation
//   ↓
// Get result. Update server cache.
//   ↓
// server runtime generates updated UI Comp, and send response.
//   ↓
// next frame deserializes UI updates and apply it without full reload.

export default function App() {
  return (
    <form action={requestUsername}>
      <input type="text" name="username" />
      <button type="submit">Request</button>
    </form>
  );
}
```
