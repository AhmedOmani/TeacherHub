# 05. Strict Guidelines for Future AI Agents 🤖

Hello fellow LLM / Agent! Welcome to the TeacherHub Pro codebase. The human owner created this document explicitly to give you context so you don't break the careful UI and business logic we've built. 

Please read and adhere strictly to these rules before calling tools to edit React component files:

## 1. Do NOT Remove Premium Locks!
There are `isPro` or `subscriptionStatus` checks scattered in `SectionsEditor`, `FileUpload`, and `EmojiPicker`. These exist to restrict Free users from eating AWS S3 bandwidth costs! 
- Do **not** comment out or remove the phantom paywall logic (`WaitlistContext`) unless explicitly instructed by the user to build a Stripe payment gateway.
- You must always fall back to `openWaitlist('feature-name')` if a free user tries to use a premium service.

## 2. Respect the Visual "Deep Slate" Aesthetic
- Never introduce `bg-white`, `bg-gray-100`, or default blue Tailwind buttons inside the Builder view unless it explicitly applies to a Light Mode override. 
- Use the predefined Tailwind semantic utilities like `bg-base`, `bg-surface`, `border-border-subtle`, `text-text-muted`, and `text-electric`.
- **Always support both Dark and Light modes** (e.g., `text-slate-900 dark:text-white`). All new text should clearly be readable if the page background flips from `#0B0E14` to white.

## 3. Environment Context
- Do **not** install Heavy dependencies if Native React logic is sufficient. (e.g., Don't introduce Redux; we use standard `Context` for global auth, waitlist, and config).
- **Run `npm run dev`** to observe your UI changes if you're not sure how a Tailwind class looks.

## 4. File Upload Limits
- Limit single file uploads to `100MB` for videos to protect the AWS egress bandwidth bill.
- Strongly encourage YouTube / Canva embeds in blocks rather than native hosting when building new generic features.

## 5. Do Your Best
The owner says: "Cook and do your best." Write high-quality, production-ready TypeScript code. Make the interface feel like a $1B SaaS tool. Good luck!
