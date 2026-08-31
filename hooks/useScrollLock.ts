"use client";

import { useEffect, useId } from "react";

let lockCount = 0;
let savedOverflow = "";
let savedPaddingRight = "";

export function useScrollLock(isLocked: boolean) {
  useId();

  useEffect(() => {
    if (isLocked) {
      if (lockCount === 0) {
        savedOverflow = document.body.style.overflow;
        savedPaddingRight = document.body.style.paddingRight;
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.overflow = "hidden";
        if (scrollbarWidth > 0) {
          document.body.style.paddingRight = `${scrollbarWidth}px`;
        }
      }
      lockCount++;
    }

    return () => {
      if (isLocked) {
        lockCount = Math.max(0, lockCount - 1);
        if (lockCount === 0) {
          document.body.style.overflow = savedOverflow;
          document.body.style.paddingRight = savedPaddingRight;
        }
      }
    };
  }, [isLocked]);
}
