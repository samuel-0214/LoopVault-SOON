// components/ui/Modal.tsx
"use client";

import { ReactNode } from "react";

export default function Modal({
  show,
  onClose,
  children,
}: {
  show: boolean;
  onClose: () => void;
  children: ReactNode;
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg max-w-sm w-full">
        {children}
        <button
          className="absolute top-2 right-2 text-black dark:text-white"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
    </div>
  );
}
