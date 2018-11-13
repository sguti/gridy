import { trigger, GridyEventType } from "./gridy.event";
import { debounce } from "./utils";

export function droppable(element: HTMLElement) {
  element.addEventListener("dragover", debounce(dragOverHandler, 50));
  element.addEventListener("dragenter", dragEnterHandler);
  element.addEventListener("dragleave", dragLeaveHandler);
  element.addEventListener("drop", dropHandler);
}
function dragOverHandler(event) {
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";
  trigger(
    GridyEventType.DragOver,
    event,
    document.querySelector("[gridy-drag-source=true]")
  );
}
function dropHandler() {
  event.preventDefault();
  trigger(GridyEventType.Drop, event);
}
function dragEnterHandler() {
  trigger(GridyEventType.DragEnter, event);
}
function dragLeaveHandler() {
  trigger(GridyEventType.DragLeave, event);
}
