import { getAuth } from "firebase-admin/auth"

export default defineEventHandler(async (event) => {
    const auth = getAuth();
    
    try {
        const {customClaims, ...userData} = await readBody(event);
        const userRecord = await auth.createUser(userData);
        if (customClaims && Object.keys(customClaims).length > 0) {
            await auth.setCustomUserClaims(userRecord.uid, customClaims);
        }

        return userRecord;
    } catch (error) {
        console.error(error);
    }
})