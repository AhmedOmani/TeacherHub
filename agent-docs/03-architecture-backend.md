# 03. Backend & DevOps Architecture

## Tech Stack Overview
1. **Frontend:** React 18 
2. **Build Tool:** Vite ⚡️ (extremely fast HMR)
3. **Styling:** Tailwind CSS v4 (configured purely via CSS variables in `index.css`)
4. **Icons:** `lucide-react`
5. **Routing:** `react-router-dom` (HashRouter/BrowserRouter combo)
6. **Backend/Database:** Firebase Firestore
7. **Authentication:** Firebase Auth (Email/Password & Google)
8. **Object Storage:** AWS S3 (for premium user video/pdf uploads)

## DevOps / Environment Variables
To run properly, the following `.env` variables *must* be correctly established:
- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_AWS_REGION`
- `VITE_AWS_ACCESS_KEY_ID`
- `VITE_AWS_SECRET_ACCESS_KEY`
- `VITE_AWS_BUCKET_NAME`

## The S3 Upload Paradigm
We use `@aws-sdk/client-s3` directly on the frontend. 
When a PRO user clicks to upload a background image or a PDF out of `SectionsEditor`, we push a `PutObjectCommand` directly to the bucket. The files must be inherently `public-read` via AWS Bucket policies, as they need to be displayed instantly on the public student-view pages.

## Payment / External APIs
- **Waitlist Hooks:** No backend endpoints are written. We use an AJAX POST to `https://formsubmit.co/ajax/ahmedschwifty@gmail.com` using native browser `fetch`.
- **Payment Gateway:** (Pending in future roadmap) Should connect to Stripe/KNET once market demand is validated from the waitlist leads.
