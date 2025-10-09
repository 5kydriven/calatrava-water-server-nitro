import { getAuth } from "firebase-admin/auth";

export default defineEventHandler(async (event) => {
  const auth = getAuth();

  try {
    const { uid } = event.context.params as { uid: string };
    const { customClaims, ...updates } = await readBody(event);

    return await auth.updateUser(uid, updates).then(async (userRecord) => {
      if (customClaims && Object.keys(customClaims).length > 0) {
        await auth.setCustomUserClaims(uid, customClaims);
      }
      return userRecord;
    });
  } catch (error) {
    console.error(error);
  }
});
