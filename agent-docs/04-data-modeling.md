# 04. Data Modeling (Firestore)

TeacherHub relies heavily on Firestore for its NoSQL database. 

## 1. The `users` Collection
Contains user metadata and strict subscription boundaries.
**Path:** `/users/{uid}`

**Schema:**
```json
{
  "email": "teacher@school.com",
  "subscriptionStatus": "free" | "pro" | "elite",
  "maxPages": 1 | 5 | 9999,
  "globalAvatar": "url-to-s3-or-firebase-storage",
  "createdAt": "timestamp"
}
```

*Note on Rules:* 
`maxPages` combined with `subscriptionStatus` acts as our enforcement mechanism. A Pro user has a hard limit of `5`. The frontend explicitly limits deleting old apps to free up slots to prevent abuse of the Pro tier.

## 2. The `pages` Collection
The core resource that acts as a teacher's "Class Website".
**Path:** `/pages/{pageId}`

**Schema:**
```json
{
  "authorId": "uid",
  "slug": "mrahmed-math-2026",
  "internalTitle": "Math 101",
  "isPublished": false,
  "config": {
    "title": "Mr Ahmed Hub",
    "theme": "glassmorphism params",
    "backgroundType": "color" | "gradient" | "image",
    "backgroundValue": "#000000" | "url(aws.com...)",
    "profileAvatar": "url",
    "sections": [
       // See Block Schema below
    ]
  },
  "createdAt": "timestamp",
  "updatedAt": "timestamp"
}
```

## 3. The Block Schema (Inside `sections`)
The editor dynamically renders blocks inside a page based on an array of `Block` objects.

**Block Object:**
```json
{
  "id": "uuid",
  "type": "heading" | "link" | "embed" | "text" | "video" | "document" | "form",
  "content": {
    "text": "Link Title",
    "url": "https://...",
    // For premium blocks like 'video' or 'document'
    "fileUrl": "s3-url",
    "fileName": "lecture1.pdf",
    "fileSize": 1048576,
    // Emotes
    "emoji": "🐼"
  }
}
```

### Security Considerations (Future Tasks)
Firestore Security Rules must restrict `write` access to `pages` where `request.auth.uid == resource.data.authorId`. Pages where `isPublished == true` are open to public `read`.
