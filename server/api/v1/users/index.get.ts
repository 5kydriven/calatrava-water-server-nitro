import { getAuth } from "firebase-admin/auth";


export default defineEventHandler(async (event) => {
    const auth = getAuth();
    const users = await auth.listUsers();
    return users.users.map(user => ({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        role: user.customClaims?.role || null,
    }));
})