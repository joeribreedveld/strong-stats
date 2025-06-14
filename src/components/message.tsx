import { InfoIcon, XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Message() {
  return (
    // To make the notification fixed, add classes like `fixed bottom-4 right-4` to the container element.
    <div className="bg-background z-50 max-w-[400px] rounded-md border px-4 py-3 shadow-lg">
      <div className="flex gap-2">
        <p className="grow text-sm">
          <InfoIcon
            className="me-3 -mt-0.5 inline-flex text-blue-500"
            size={16}
            aria-hidden="true"
          />
          Just a quick note!
        </p>
        <Button
          variant="ghost"
          className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
          aria-label="Close notification"
        >
          <XIcon
            size={16}
            className="opacity-60 transition-opacity group-hover:opacity-100"
            aria-hidden="true"
          />
        </Button>
      </div>
    </div>
  );
}
