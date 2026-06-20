import { query } from "../../db/client";
import type { UserRow, PrivateUser } from "../../types";
import { toPrivateUser, toPublicUser } from "../../lib/mappers";
import { notFound } from "../../lib/errors";
import type { UpdateMeInput } from "./users.schema";
import type { PublicUser } from "../../types";

async function getById(userId: string): Promise<UserRow> {
  const { rows } = await query<UserRow>("SELECT * FROM users WHERE id = $1", [userId]);
  if (!rows[0]) throw notFound("Kullanici bulunamadi");
  return rows[0];
}

export async function updateMe(
  userId: string,
  input: UpdateMeInput,
): Promise<PrivateUser> {
  const fields: string[] = [];
  const values: unknown[] = [];
  const map: Record<string, string> = {
    displayName: "display_name",
    bio: "bio",
    websiteUrl: "website_url",
    githubUrl: "github_url",
    twitterUrl: "twitter_url",
  };

  for (const [key, value] of Object.entries(input)) {
    if (value === undefined) continue;
    fields.push(`${map[key]} = $${values.length + 1}`);
    values.push(value === "" ? null : value);
  }

  if (fields.length === 0) {
    return toPrivateUser(await getById(userId));
  }

  values.push(userId);
  const { rows } = await query<UserRow>(
    `UPDATE users SET ${fields.join(", ")} WHERE id = $${values.length} RETURNING *`,
    values,
  );
  return toPrivateUser(rows[0]);
}

export async function getProfile(username: string, viewerId?: string): Promise<PublicUser> {
  const { rows } = await query<any>(
    `SELECT u.*,
       (SELECT COUNT(*)::text FROM topics t WHERE t.user_id = u.id) AS topic_count,
       (SELECT COUNT(*)::text FROM comments c WHERE c.user_id = u.id) AS comment_count,
       (SELECT COUNT(*)::text FROM follows f WHERE f.following_id = u.id) AS followers_count,
       (SELECT COUNT(*)::text FROM follows f WHERE f.follower_id = u.id) AS following_count,
       (SELECT 1 FROM follows f WHERE f.follower_id = $2 AND f.following_id = u.id) IS NOT NULL AS is_following,
       (SELECT created_at FROM user_activity_log WHERE user_id = u.id ORDER BY created_at DESC LIMIT 1) AS last_active_at
     FROM users u WHERE lower(u.username) = lower($1) LIMIT 1`,
    [username, viewerId ?? null],
  );
  if (!rows[0]) throw notFound("Kullanici bulunamadi");
  return toPublicUser(rows[0]);
}

export async function setAvatarKey(userId: string, avatarKey: string): Promise<PrivateUser> {
  const { rows } = await query<UserRow>(
    "UPDATE users SET avatar_key = $1 WHERE id = $2 RETURNING *",
    [avatarKey, userId],
  );
  return toPrivateUser(rows[0]);
}

export async function getCurrent(userId: string): Promise<PrivateUser> {
  const { rows } = await query<any>(
    `SELECT u.*,
       (SELECT COUNT(*)::text FROM topics t WHERE t.user_id = u.id) AS topic_count,
       (SELECT COUNT(*)::text FROM comments c WHERE c.user_id = u.id) AS comment_count,
       (SELECT COUNT(*)::text FROM follows f WHERE f.following_id = u.id) AS followers_count,
       (SELECT COUNT(*)::text FROM follows f WHERE f.follower_id = u.id) AS following_count,
       (SELECT created_at FROM user_activity_log WHERE user_id = u.id ORDER BY created_at DESC LIMIT 1) AS last_active_at
     FROM users u WHERE u.id = $1`,
    [userId],
  );
  if (!rows[0]) throw notFound("Kullanici bulunamadi");
  return toPrivateUser(rows[0]);
}

export async function getContributions(userId: string): Promise<{ date: string; count: number }[]> {
  const { rows } = await query<any>(
    `WITH date_series AS (
       SELECT (CURRENT_DATE - i)::date AS date_val
       FROM generate_series(0, 364) AS i
     ),
     user_actions AS (
       SELECT created_at::date AS action_date, COUNT(*) AS count
       FROM topics
       WHERE user_id = $1 AND created_at >= CURRENT_DATE - 365
       GROUP BY 1
       
       UNION ALL
       
       SELECT created_at::date AS action_date, COUNT(*) AS count
       FROM comments
       WHERE user_id = $1 AND created_at >= CURRENT_DATE - 365
       GROUP BY 1
       
       UNION ALL
       
       SELECT created_at::date AS action_date, COUNT(*) AS count
       FROM user_activity_log
       WHERE user_id = $1 AND created_at >= CURRENT_DATE - 365
       GROUP BY 1
     ),
     action_totals AS (
       SELECT action_date, SUM(count)::int AS count
       FROM user_actions
       GROUP BY 1
     )
     SELECT 
       ds.date_val::text AS date,
       COALESCE(at.count, 0) AS count
     FROM date_series ds
     LEFT JOIN action_totals at ON at.action_date = ds.date_val
     ORDER BY ds.date_val ASC`,
    [userId],
  );
  return rows;
}

export async function getActivities(userId: string, limit = 20): Promise<any[]> {
  const { rows } = await query<any>(
    `SELECT id, user_id, activity_type, target_id, target_title, created_at
     FROM user_activity_log
     WHERE user_id = $1
     ORDER BY created_at DESC
     LIMIT $2`,
    [userId, limit],
  );
  return rows.map((row) => ({
    id: row.id,
    userId: row.user_id,
    activityType: row.activity_type,
    targetId: row.target_id,
    targetTitle: row.target_title,
    createdAt: row.created_at,
  }));
}


