"use client";

import { useEffect, useId } from "react";

const instances = new Map<string, { locked: boolean }>();
let lockCount = 0;
let savedOverflow = "";
let savedPaddingRight = "";

export function useScrollLock(isLocked: boolean) {
  const id = useId();

  useEffect(() => {
    const prev = instances.get(id);
    if (prev) {
      prev.locked = isLocked;
    } else {
      instances.set(id, { locked: isLocked });
    }

    const wasLocked = lockCount > 0;

    if (isLocked && !wasLocked) {
      savedOverflow = document.body.style.overflow;
      savedPaddingRight = document.body.style.paddingRight;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
      }
    }

    if (isLocked) {
      lockCount++;
    }

    return () => {
      if (isLocked) {
        lockCount = Math.max(0, lockCount - 1);
        instances.delete(id);
        if (lockCount === 0) {
          document.body.style.overflow = savedOverflow;
          document.body.style.paddingRight = savedPaddingRight;
        }
      }
    };
  }, [isLocked, id]);
}
