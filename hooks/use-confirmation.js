"use client";

import { useState } from "react";
import { useToast } from "./use-toast";

export function useConfirmation() {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null);
  const { toast } = useToast();

  const confirm = ({ 
    title, 
    description, 
    confirmText = "Confirm", 
    cancelText = "Cancel",
    variant = "destructive" 
  }) => {
    return new Promise((resolve) => {
      setConfirmationData({
        title,
        description,
        confirmText,
        cancelText,
        variant,
        onConfirm: () => {
          setIsOpen(false);
          resolve(true);
        },
        onCancel: () => {
          setIsOpen(false);
          resolve(false);
        }
      });
      setIsOpen(true);
    });
  };

  const showDeleteConfirmation = (itemName, itemType = "item") => {
    return confirm({
      title: `Delete ${itemType}`,
      description: `Are you sure you want to delete "${itemName}"? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "destructive"
    });
  };

  const showBulkActionConfirmation = (action, count, itemType = "items") => {
    return confirm({
      title: `${action} ${count} ${itemType}`,
      description: `Are you sure you want to ${action.toLowerCase()} ${count} ${itemType}? This may take a few moments.`,
      confirmText: action,
      cancelText: "Cancel",
      variant: "default"
    });
  };

  return {
    isOpen,
    confirmationData,
    confirm,
    showDeleteConfirmation,
    showBulkActionConfirmation,
    setIsOpen
  };
}
