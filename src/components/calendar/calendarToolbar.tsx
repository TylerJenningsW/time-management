
import React, { useState } from "react";
import { Navigate, type View, type ToolbarProps, type SlotInfo } from "react-big-calendar";
import { z } from "zod";
import EventModal from "./eventModal";

const CustomToolbar: React.FC<ToolbarProps> = (toolbar) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [slotInfo, setSlotInfo] = useState<SlotInfo>();
  const goToBack = () => {
    toolbar.onNavigate(Navigate.PREVIOUS);
  };

  const goToNext = () => {
    toolbar.onNavigate(Navigate.NEXT);
  };

  const goToCurrent = () => {
    toolbar.onNavigate(Navigate.TODAY);
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

          <button type="button" onClick={() => setIsModalOpen(true)}>
            Add Event
          </button>
        </span>
      </div>
      <EventModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        slotInfo={slotInfo} />
    </>
  );
};

export default CustomToolbar;
