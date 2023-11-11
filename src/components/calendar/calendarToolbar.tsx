import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import React, { useState } from "react";
import { Navigate, type View, type ToolbarProps } from "react-big-calendar";

const CustomToolbar: React.FC<ToolbarProps> = (toolbar) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [showEventModal, setShowEventModal] = useState(false);
  const goToBack = () => {
    toolbar.onNavigate(Navigate.PREVIOUS);
  };

  const goToNext = () => {
    toolbar.onNavigate(Navigate.NEXT);
  };

  const goToCurrent = () => {
    toolbar.onNavigate(Navigate.TODAY);
  };
  const goToWeek = () => {
    //todo
  };

  const handleAddEvent = () => {
    // todo
  };
  const viewButtons = (
    Array.isArray(toolbar.views) ? toolbar.views : Object.keys(toolbar.views)
  ).map((view) => (
    <button
      key={view}
      onClick={() => toolbar.onView(view as View)}
      className={toolbar.view === view ? "active" : ""}
    >
      {view.charAt(0).toUpperCase() + view.slice(1)}
    </button>
  ));
  return (
    <>
      <div className="rbc-toolbar">
        <span className="rbc-btn-group">
          <button type="button" onClick={goToBack}>
            Back
          </button>
          <button type="button" onClick={goToCurrent}>
            Today
          </button>
          <button type="button" onClick={goToNext}>
            Next
          </button>
        </span>
        <span className="rbc-toolbar-label">{toolbar.label}</span>
        <span className="rbc-btn-group">
          {viewButtons}
          <button type="button" onClick={handleAddEvent}>
            Add Event
          </button>
        </span>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add Event
              </ModalHeader>
              <ModalBody>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
                <p>
                  Magna exercitation reprehenderit magna aute tempor cupidatat
                  consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex
                  incididunt cillum quis. Velit duis sit officia eiusmod Lorem
                  aliqua enim laboris do dolor eiusmod. Et mollit incididunt
                  nisi consectetur esse laborum eiusmod pariatur proident Lorem
                  eiusmod et. Culpa deserunt nostrud ad veniam.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default CustomToolbar;
