import type { ComponentProps } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

type CancelButtonProps = ComponentProps<typeof Button> & {
  title: string;
  description: string;
  cancelText: string;
  confirmText: string;
  onConfirm: () => void;
};

export default function CancelButton({
  title,
  description,
  cancelText = "Continue writing",
  confirmText = "Discard",
  onConfirm,
  ...btnProps
}: CancelButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button {...btnProps} variant="secondary">
          Cancel
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
