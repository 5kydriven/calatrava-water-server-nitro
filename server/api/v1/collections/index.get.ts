// server nitro api
import { getFirestore } from "firebase-admin/firestore";
import { H3Event } from "h3";

export default defineEventHandler(async (event: H3Event) => {
  const db = getFirestore();
  const {
    q,
    month,
    offset = 0,
  } = getQuery(event);

  if (!month) {
    throw createError({
      statusCode: 404,
      statusMessage: "bad request",
      message: "Month is required",
    });
  }
  try {
    let collectionsQuery = db
      .collection("collections")
      .orderBy("accountno", "asc");

    if (month) {
      const [year, monthStr] = (month as string).split("-"); // Split "2025-03" into ["2025", "03"]

      // Calculate start and end dates in MM/DD/YYYY format
      const startDate = `${monthStr}/01/${year}`; // e.g., "03/01/2025"
      const lastDay = new Date(Number(year), Number(monthStr), 0).getDate(); // Get last day of the month
      const endDate = `${monthStr}/${lastDay}/${year}`; // e.g., "03/31/2025"

      // Add date range filter (assuming 'pymtdate' is the field in your DB storing "MM/DD/YYYY")
      collectionsQuery = collectionsQuery
        .where("pymtdate", ">=", startDate)
        .where("pymtdate", "<=", endDate);
    }

    if (q) {
      collectionsQuery = collectionsQuery.startAt(q).endAt(q + "\uf8ff");
    }

    const countSnap = await collectionsQuery.count().get();

    collectionsQuery = collectionsQuery.limit(10);

    if (offset) {
      collectionsQuery = collectionsQuery.offset(Number(offset));
    }

    const collectionsSnap = await collectionsQuery.get();

    const collections = collectionsSnap.docs.map((doc, index) => ({
      uid: doc.id,
      ...doc.data(),
      id: index + (Number(offset) + 1),
    }));

    return successResponse({
      data: collections,
      total: countSnap.data().count,
    });
  } catch (error: any) {
    console.log("collections.get", error);
    return errorResponse({ error, event });
  }
});