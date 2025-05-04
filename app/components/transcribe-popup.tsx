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
  HiraganaText: string;
  KatakanaText?: string;
  onHiraganaApply: () => void;
  onKatakanaApply: () => void;
  contentClassname?: string;
}

export function TranscriptionPopup({
  trigger,
  isOpen,
  onOpenChange,
  HiraganaText,
  KatakanaText,
  onHiraganaApply,
  onKatakanaApply,
  contentClassname = "w-auto p-3 z-50 space-y-2",
}: TranscribePopupProps) {
  return (
    <Popover open={isOpen} onOpenChange={onOpenChange}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent
        className={contentClassname}
        side="top"
        align="start"
        sideOffset={5}
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <div className="flex items-center gap-2">
          <p className="text-base flex-grow py-1 px-2 border rounded-md bg-background min-h-[30px] w-50">
            {HiraganaText || (
              <span className="text-muted-foreground text-sm font-normal">
                Hiragana
              </span>
            )}
          </p>
          <Button
            size="sm"
            variant="default"
            onClick={onHiraganaApply}
            disabled={!HiraganaText}
          >
            Apply
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <p className="text-base flex-grow py-1 px-2 border rounded-md bg-background min-h-[30px] w-50">
            {KatakanaText || (
              <span className="text-muted-foreground text-sm font-normal">
                Katakana
              </span>
            )}
          </p>
          <Button
            size="sm"
            variant="default"
            onClick={onKatakanaApply}
            disabled={!KatakanaText}
          >
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
