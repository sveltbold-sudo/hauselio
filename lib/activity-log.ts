import { prisma } from "./prisma";
import { Prisma } from "@prisma/client";

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
  } catch {
    // Silently fail — activity logging should never block operations
  }
}
