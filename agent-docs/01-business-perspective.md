# 01. Business Perspective & Product Strategy

## Core Product
**TeacherHub Pro** is a SaaS platform designed specifically for educators to build digital hubs (mini-websites) for their classrooms. The primary value proposition is offering an ultra-simple block-style editor (text, links, videos, PDFs) with premium visual aesthetics (glassmorphism/dark mode) that look professional.

## Monetization Strategy
The business is designed natively to push Free users towards a Pro ($9.99/mo) and Elite ($19.99/mo) tier while ruthlessly protecting AWS cloud architecture costs, specifically preventing Free users from consuming S3 Egress bandwidth.

### Free Tier Limits
- Maximum 1 website (class page).
- Hosted entirely on a subdomain.
- **Strictly 0 GB of S3 Uploads:** S3-dependent "Private Video" and "Document (PPTX/DOCX)" blocks are completely locked. Free users must embed videos via YouTube or use external linking.
- Premium Emojis (70+) and Custom Background Image uploading are locked.
- Forced TeacherHub branding at the bottom of public pages.

### "Phantom Paywall" (Waitlist Strategy)
We utilize a "Phantom Paywall" for validation before heavily investing in Stripe APIs. 
- When a free user clicks an emoji, a disabled FileUpload area, or a locked BlockType, they trigger `WaitlistContext`.
- A glassmorphic modal opens informing them the feature is Premium, offering 50% off if they join the waitlist.
- Emails are submitted via an AJAX POST request using `FormSubmit` natively to `ahmedschwifty@gmail.com`.

### The Pro & Elite Upsell
- **Pro ($9.99/mo):** strict limit of 5 undeletable websites (prevents recycling slots), 5 GB AWS S3 hard-limit, custom domain integration, full aesthetics unlocked.
- **Elite ($19.99/mo):** unlimited websites, 50 GB AWS S3 quota, detailed analytics, meta pixel injection.
