"use client";

import { Keyboard } from "lucide-react";
import { memo } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Kbd } from "@/components/ui/kbd";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const shortcuts = [
  { command: "Open new chat", keys: ["Ctrl", "O"] },
  { command: "Focus message input", keys: ["Ctrl", "I"] },
  { command: "Open keyboard shortcuts", keys: ["Ctrl", "K"] },
  { command: "Toggle sidebar", keys: ["Ctrl", "B"] },
];

const UIKeyboardShortcuts = memo(() => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          aria-label="Open keyboard shortcuts"
          size="icon"
          variant="outline"
        >
          <Keyboard className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Use these shortcuts to navigate and interact with the application
            more efficiently.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Command</TableHead>
                <TableHead className="text-right">Keys</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shortcuts.map((shortcut) => (
                <TableRow key={shortcut.command}>
                  <TableCell>{shortcut.command}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {shortcut.keys.map((key) => (
                        <Kbd key={key}>{key}</Kbd>
                      ))}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
});

UIKeyboardShortcuts.displayName = "UIKeyboardShortcuts";

export { UIKeyboardShortcuts };
