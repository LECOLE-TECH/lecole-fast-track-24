import React from "react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogHeader,
} from "~/components/ui/alert-dialog";

export const Alert = ({
  title,
  description,
  open,
  onOpenChange,
  children,
}: {
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  open: boolean;
  onOpenChange: () => void;
  children: React.ReactNode;
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        {children}
      </AlertDialogContent>
    </AlertDialog>
  );
};
