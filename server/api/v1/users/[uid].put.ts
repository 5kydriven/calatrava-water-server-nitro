import { getAuth } from "firebase-admin/auth";

export default defineEventHandler(async (event) => {
  const auth = getAuth();

  try {
    const { uid } = event.context.params as { uid: string };
    const { customClaims, ...updates } = await readBody(event);
    const userRecord = await auth.updateUser(uid, updates);

    if (customClaims) {
      await auth.setCustomUserClaims(uid, customClaims);
    }

    return successResponse({ data: userRecord });
  } catch (error) {
    return errorResponse({ error, event });
  }
});
