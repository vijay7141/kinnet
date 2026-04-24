"use client";
import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
} from "@hello-pangea/dnd";
import Link from "next/link";
export default function ReferralsSection() {
  const [open, setOpen] = useState(false);

  const [data, setData] = useState({
    incoming: [
      { id: "1", name: "Luna", owner: "Sarah Miller", time: "2h ago", priority: "red" },
      { id: "2", name: "Cooper", owner: "John Wick", time: "4h ago", priority: "red" },
    ],
    claimed: [
      { id: "3", name: "Bella", owner: "Maria Garcia", time: "6h ago", priority: "orange" },
    ],
    review: [
      { id: "4", name: "Oliver", owner: "David Chen", time: "1h ago", priority: "green" },
    ],
    accepted: [
      { id: "5", name: "Max", owner: "Emily Blunt", time: "Yesterday", priority: "blue" },
    ],
    confirmed: [
      { id: "6", name: "Milo", owner: "Chris Evans", time: "2d ago" },
    ],
  });

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceCol = [...data[source.droppableId]];
    const destCol = [...data[destination.droppableId]];
    const [movedItem] = sourceCol.splice(source.index, 1);

    destCol.splice(destination.index, 0, movedItem);

    setData({
      ...data,
      [source.droppableId]: sourceCol,
      [destination.droppableId]: destCol,
    });
  };

  return (
    <>
      <div className="col-xl-12">
        <div className="_referrals_list_wrap">

          {!open && (
            <div className="_referrals_list_wrap_inside">
              <div className="ref_summary_card" onClick={() => setOpen(true)}>
                <div className="image">
                  <img src="/icn/no_referrals.svg" alt="" />
                </div>
                <h4>No referrals available yet.</h4>
              </div>
            </div>
          )}

          {open && (
            <DragDropContext onDragEnd={onDragEnd}>
              <div className="_referrals_list">
                <div className="ref_scroll">

                  {/* COLUMN COMPONENT */}
                  {Object.keys(data).map((colKey) => (
                    <Droppable droppableId={colKey} key={colKey}>
                      {(provided) => (
                        <div
                          className="ref_col"
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          <h6>
                            {colKey === "incoming"
                              ? "Incoming"
                              : colKey === "claimed"
                              ? "Claimed"
                              : colKey === "review"
                              ? "In Review"
                              : colKey === "accepted"
                              ? "Accepted"
                              : "Confirmed"}
                          </h6>

                          {data[colKey].map((item, index) => (
                            <Draggable
                              key={item.id}
                              draggableId={item.id}
                              index={index}
                            >
                              {(provided) => (
                                <Link href="/user/referrals/referrals-details">
                                 <div
                                  className={`ref_card ${colKey === "confirmed" ? "muted" : ""}`}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                >
                                  <div className="ref_top">
                                    {item.priority && (
                                      <span className={`badge ${item.priority}`}>
                                        {item.priority === "red"
                                          ? "Priority 1-2"
                                          : item.priority === "orange"
                                          ? "Priority 2-3"
                                          : item.priority === "green"
                                          ? "Priority 4"
                                          : "Info Only"}
                                      </span>
                                    )}

                                    {/* DRAG HANDLE */}
                                    <span
                                      className="dots"
                                      {...provided.dragHandleProps}
                                    >
                                      <img src="/icn/drag_dot.svg" alt="" />
                                    </span>
                                  </div>

                                  <span className="time">{item.time}</span>
                                  <h5>{item.name}</h5>
                                  <p>{item.owner}</p>

                                  {/* CONDITIONAL UI SAME AS DESIGN */}
                                  {colKey === "incoming" && (
                                    <button className="btn claim_btn">
                                      <img src="/icn/clame_icn.svg" alt="" />
                                      Claim Case
                                    </button>
                                  )}

                                  {colKey === "claimed" && (
                                    <div className="extra">
                                      <img src="/icn/doc_img.svg" alt="" />
                                      Claimed by Dr. Aris
                                    </div>
                                  )}

                                  {colKey === "review" && (
                                    <div className="status review">
                                      Review in process
                                    </div>
                                  )}

                                  {colKey === "accepted" && (
                                    <div className="status accepted">
                                      Accepted
                                    </div>
                                  )}
                                </div>
                                </Link>
                               
                              )}
                            </Draggable>
                          ))}

                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  ))}

                </div>
              </div>
            </DragDropContext>
          )}
        </div>
      </div>
    </>
  );
}