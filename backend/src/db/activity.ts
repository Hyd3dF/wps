import { query } from "./client";
import { logger } from "../lib/logger";

export async function logUserActivity(
  userId: string,
  activityType: string,
  targetId?: string,
  targetTitle?: string,
): Promise<void> {
  try {
    await query(
      "INSERT INTO user_activity_log (user_id, activity_type, target_id, target_title) VALUES ($1, $2, $3, $4)",
      [userId, activityType, targetId || null, targetTitle || null],
    );
  } catch (err) {
    logger.error("Aktivite loglanirken hata", {
      userId,
      activityType,
      message: err instanceof Error ? err.message : String(err),
    });
  }
}
