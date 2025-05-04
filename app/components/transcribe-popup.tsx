import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ReactNode } from "react";

interface TranscribePopupProps {
  trigger: ReactNode;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  transcribedText: string;
  onApply: () => void;
  contentClassname?: string;
}

export function TranscriptionPopup({
  trigger,
  isOpen,
  onOpenChange,
  transcribedText,
  onApply,
  contentClassname = "w-auto p-3 z-50",
}: TranscribePopupProps) {
  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        className={contentClassname}
        side="bottom"
        align="start"
        sideOffset={5}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex items-center gap-2">
          <p className="text-base flex-grow p-2 border rounded-md bg-background min-h-[30px] w-50">
            {transcribedText || (
              <span className="text-muted-foreground text-sm font-normal">
                Hiragana
              </span>
            )}
          </p>
          <Button
            size="sm"
            variant="outline"
            onClick={onApply}
            disabled={!transcribedText}
          >
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
