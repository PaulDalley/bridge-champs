# Revoke Sean's access (Firebase & site)

Code changes are done: Sean's UID was removed from the admin allowlist in the app and in Cloud Functions. **If the removed UID was actually yours**, add it back in both places:
- `src/store/actions/authActions.js` → `adminUidAllowList`
- `functions/index.js` → `ADMIN_UID_ALLOWLIST`  
Removed UID: `8vNtPo121PZmzbfivs7xInxu2a62`

You still need to do the following in Firebase so Sean has no access:

## 1. Firebase Console – remove Sean from the project

1. Go to [Firebase Console](https://console.firebase.google.com/) → project **bridgechampions**.
2. Click the **gear** next to "Project Overview" → **Project settings**.
3. Open the **Users and permissions** tab (or **IAM** if using Google Cloud).
4. Find Sean in the list and **remove** him (or set his role to none).

## 2. Firebase Authentication – disable/delete his account

1. In Firebase Console → **Authentication** → **Users**.
2. Find Sean (by email).
3. Click the **⋮** menu → **Delete user** (or disable the account if you prefer).

## 3. Firestore – remove his admin flag

Admin can also be granted by a document `users/{uid}` with `OK: true`.

1. In Firebase Console → **Firestore** → **Data**.
2. Open the **users** collection.
3. Find the document whose ID is **Sean’s UID** (same UID as in Auth; you can match by checking who’s left after step 2).
4. Either **delete** that document or **edit** it and set `OK` to `false` (or remove the field).

After this, Sean will have no Firebase access and no admin rights on the site.  
Redeploy **hosting** (and **functions** if you changed `index.js`) after any code changes.
