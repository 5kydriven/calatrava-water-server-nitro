import { getAuth } from "firebase-admin/auth";

export default defineEventHandler(async (event) => {
    const auth = getAuth();
    
    if (!auth) {
        throw new Error("Firebase Auth not initialized");
    }

   try {
     const users = await auth.listUsers();
    const userRecords = users.users.map(user => ({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role: user.customClaims?.role || null,
    }));

    return successResponse({data: userRecords});
   } catch (error) {
    return errorResponse({error, event});
   }
})