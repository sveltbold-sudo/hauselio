"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  currentImage?: string;
  folder?: string;
  onUpload: (url: string, publicId: string) => void;
  onRemove?: () => void;
  className?: string;
}

export default function ImageUpload({
  currentImage,
  folder = "hauselio/products",
  onUpload,
  onRemove,
  className = "",
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Nur Bilddateien erlaubt");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Max. 5MB");
      return;
    }

    // Cancel any in-progress upload
    if (abortRef.current) {
      abortRef.current.abort();
    }
    const controller = new AbortController();
    abortRef.current = controller;

    // Preview
    const reader = new FileReader();
    reader.onload = (ev) => setPreview(ev.target?.result as string);
    reader.readAsDataURL(file);

    // Upload
    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Upload fehlgeschlagen");
      }

      onUpload(data.url, data.publicId);
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setError(err instanceof Error ? err.message : "Upload fehlgeschlagen");
      setPreview(currentImage || null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) await uploadFile(file);
  };

  const handleRemove = () => {
    if (abortRef.current) {
      abortRef.current.abort();
    }
    setPreview(null);
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onRemove?.();
  };

  return (
    <div className={`relative ${className}`}>
      {preview ? (
        <div className="relative group">
          <Image
            src={preview}
            alt="Vorschau"
            width={400}
            height={192}
            className="w-full h-48 object-cover rounded-xl border border-[var(--color-border-light)]"
          />
          <div className="absolute inset-0 bg-black/50 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-3 py-1.5 bg-white text-[var(--color-text-primary)] rounded-lg text-sm font-medium hover:bg-[var(--color-bg-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
            >
              Ändern
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="px-3 py-1.5 bg-[var(--color-danger)] text-white rounded-lg text-sm font-medium hover:bg-[var(--color-danger-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2"
            >
              Entfernen
            </button>
          </div>
          {isUploading && (
            <div className="absolute inset-0 bg-white/80 rounded-xl flex items-center justify-center">
              <div className="animate-spin w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full" />
            </div>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          aria-label="Produktbild hochladen"
          className={`w-full h-48 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 transition-colors ${
            isDragging
              ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10 scale-[1.01]"
              : "border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary)]/5"
          }`}
        >
          <ImageIcon className="w-10 h-10 text-[var(--color-text-muted)]" />
          <span className="text-sm text-[var(--color-text-muted)]">
            {isDragging
              ? "Bild hier ablegen…"
              : isUploading
                ? "Wird hochgeladen…"
                : "Bild hochladen oder hierher ziehen"}
          </span>
          <span className="text-xs text-[var(--color-text-muted)]">JPG, PNG, WebP (max. 5MB)</span>
        </button>
      )}

      {error && (
        <p className="text-xs text-[var(--color-danger)] mt-1">{error}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}
