"use client";

import Link from "next/link";
import { Home, ArrowLeft } from "lucide-react";
import Button from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="container-hauselio py-24 text-center max-w-2xl mx-auto">
      <div className="relative mb-8">
        <p className="text-[10rem] font-black leading-none text-gray-100 select-none">
          404
        </p>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-[var(--color-primary)]/10 flex items-center justify-center">
            <span className="text-4xl">🔍</span>
          </div>
        </div>
      </div>

      <h1 className="heading-2 mb-4">Seite nicht gefunden</h1>

      <p className="body-large mb-10">
        Die angeforderte Seite existiert leider nicht oder wurde verschoben.
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link href="/">
          <Button variant="primary">
            <Home className="w-5 h-5 mr-2" />
            Zurück zur Startseite
          </Button>
        </Link>
        <Button
          variant="outline"
          onClick={() => window.history.back()}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Zurück
        </Button>
      </div>
    </div>
  );
}
