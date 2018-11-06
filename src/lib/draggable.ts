import { trigger, GridyEventType } from "./gridy.event";
import { TileAttribute } from "./lib.enums";

export function createDraggable(element: HTMLElement) {
  element.setAttribute("draggable", "true");
  element.addEventListener("mousedown", mouseDownHandler);
  element.addEventListener("dragstart", dragStartHandler);
  element.addEventListener("dragenter", dragEnterHandler);
  element.addEventListener("dragleave", dragLeaveHandler);
  element.addEventListener("dragend", dragEndHandler);
}

function dragStartHandler() {
  event.srcElement.setAttribute(TileAttribute.dragSource, "true");
  trigger(GridyEventType.DragStart, event);
}
function dragEnterHandler() {
  trigger(GridyEventType.DragEnter, event);
}
function dragLeaveHandler() {
  trigger(GridyEventType.DragLeave, event);
}
function dragEndHandler() {
  event.srcElement.setAttribute(TileAttribute.dragSource, "false");
  trigger(GridyEventType.DragEnd, event);
}
function mouseDownHandler(event: any) {
  event.srcElement.setAttribute(TileAttribute.cursorX, event.offsetX);
  event.srcElement.setAttribute(TileAttribute.cursorY, event.offsetY);
}
