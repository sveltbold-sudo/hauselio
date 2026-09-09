"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import { logger } from "@/lib/logger";

interface DeleteArticleButtonProps {
  articleId: string;
  articleTitle: string;
}

export default function DeleteArticleButton({ articleId, articleTitle }: DeleteArticleButtonProps) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { success, error: toastError } = useToast();

  function handleDelete() {
    startTransition(async () => {
      try {
        const res = await fetch(`/api/ratgeber/${articleId}`, { method: "DELETE" });
        if (!res.ok) throw new Error("Fehler beim Löschen");
        success("Artikel gelöscht.");
        router.refresh();
      } catch (e) {
        logger.error("delete-article", e);
        toastError("Artikel konnte nicht gelöscht werden.");
      } finally {
        setShowConfirm(false);
      }
    });
  }

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        title="Löschen"
        disabled={isPending}
      >
        <Trash2 className="w-4 h-4" />
      </button>
      <ConfirmDialog
        open={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onConfirm={handleDelete}
        title="Artikel löschen?"
        message={`Möchten Sie „${articleTitle}" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.`}
        confirmLabel={isPending ? "Wird gelöscht..." : "Löschen"}
        cancelLabel="Abbrechen"
        danger
      />
    </>
  );
}
