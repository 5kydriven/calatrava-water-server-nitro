import { getAuth } from "firebase-admin/auth";
import { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  const auth = getAuth();
  const uid = getRouterParam(event, "uid");

  if (!auth) {
    throw new Error("Firebase Auth not initialized");
  }

  try {
    await auth.deleteUser(uid);
    return successResponse({ message: "Successfully deleted user" });
  } catch (error) {
    return errorResponse({ error, event });
  }
});
