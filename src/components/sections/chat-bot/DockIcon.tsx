"use client";

import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DockIconProps {
  onClick: () => void;
  isOpen: boolean;
}

export function DockIcon({ onClick, isOpen }: DockIconProps) {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg md:transition-transform md:hover:-translate-y-1"
      size="icon"
      variant="core"
    >
      {isOpen ? (
        <X className="h-6 w-6" />
      ) : (
        <MessageCircle className="h-6 w-6" />
      )}
    </Button>
  );
}
