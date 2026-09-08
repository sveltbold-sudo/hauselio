import { prisma } from "./prisma";
import { Prisma } from "@prisma/client";
import { logger } from "./logger";

interface LogActivityParams {
  action: string;
  entity: string;
  entityId?: string;
  adminId: string;
  adminEmail: string;
  details?: Record<string, unknown>;
}

export async function logActivity(params: LogActivityParams): Promise<void> {
  try {
    await prisma.activityLog.create({
      data: {
        action: params.action,
        entity: params.entity,
        entityId: params.entityId || null,
        adminId: params.adminId,
        adminEmail: params.adminEmail,
        details: params.details ? (params.details as Prisma.InputJsonValue) : Prisma.JsonNull,
      },
    });
  } catch (e) {
    logger.error("activity-log", e instanceof Error ? e : new Error(String(e)));
  }
}
