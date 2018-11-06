import { trigger, GridyEventType } from "./gridy.event";
import { debounce } from "./utils";

export function createDroppable(element: HTMLElement) {
  element.addEventListener("dragover", debounce(dragOverHandler, 50));
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
