import React from "react";
import {
  Root,
  Trigger,
  Portal,
  Overlay,
  Content,
  Title,
  Close,
} from "@radix-ui/react-dialog";

type ModalProps = {
  isOpen: boolean;
  children: React.ReactNode;
  onOpenChange: (open: boolean) => void;
  disabled?: boolean;
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  children,
  onOpenChange,
  disabled,
}) => (
  <Root open={isOpen} onOpenChange={disabled ? undefined : onOpenChange}>
    {children}
  </Root>
);

export const ModalTrigger = Trigger;

type ModalContentProps = {
  className?: string;
  children: React.ReactNode;
  // Include other props as needed
};

export const ModalContent: React.FC<ModalContentProps> = ({
  className,
  ...props
}) => {
  const customSizeClass = "w-[300px] h-[400px]"; // Width and height of the modal

  return (
    <Portal>
      <Overlay className="fixed inset-0 overflow-y-auto " />
      <Content
        {...props}
        className={`fixed left-1/2 top-1/2 w-[300px] h-[400px] -translate-x-1/2 -translate-y-1/2 transform overflow-y-auto p-6 ${className}`}
      />
    </Portal>
  );
};

export const ModalTitle = Title;

export const ModalClose = Close;
