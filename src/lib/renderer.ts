import {
  getAvailableEmptyBlockRange,
  getNearestBlock,
  moveElement,
  getCollisionData
} from "./block";
import { styleValue } from "./utils";
import { TileAttribute } from "./lib.enums";
import { GridyEvent } from "./gridy.event";

export function autoAlignItems(
  container: HTMLElement,
  tiles: Array<HTMLElement>
) {
  tiles.forEach(tile => {
    tile.style.position = "absolute";
    const blockRange = getAvailableEmptyBlockRange(
      styleValue(tile.style.height),
      styleValue(tile.style.width)
    );
    if (Array.isArray(blockRange) && blockRange.length) {
      tile.style.left = blockRange[0].x + "px";
      tile.style.top = blockRange[0].y + "px";
      blockRange.forEach((block, index) => {
        if (index === 0) {
          block.isStartOfATile = true;
        }
        block.isEmpty = false;
        block.tileId = tile.getAttribute(TileAttribute.uniqueId);
      });
    }
  });
}

export function createTemporaryDropLocation(
  container: HTMLElement,
  gridyEvent: GridyEvent
) {
  if (!gridyEvent.dragSource) {
    return;
  }
  const offsetX =
    (<any>gridyEvent.event).pageX -
    (container.offsetLeft +
      +gridyEvent.dragSource.getAttribute(TileAttribute.cursorX));
  const offsetY =
    (<any>gridyEvent.event).pageY -
    (container.offsetTop +
      +gridyEvent.dragSource.getAttribute(TileAttribute.cursorY));
  const collision = getCollisionData(
    offsetX,
    offsetY,
    styleValue(gridyEvent.dragSource.style.height),
    styleValue(gridyEvent.dragSource.style.width)
  );
  let temporaryDropTarget: HTMLElement = document.querySelector(
    `[${TileAttribute.tempDropTarget}=true]`
  );
  if (!temporaryDropTarget) {
    temporaryDropTarget = document.createElement("div");
    temporaryDropTarget.style.position = "absolute";
    temporaryDropTarget.setAttribute(TileAttribute.tempDropTarget, "true");
    container.appendChild(temporaryDropTarget);
  }
  temporaryDropTarget.style.height = gridyEvent.dragSource.style.height;
  temporaryDropTarget.style.width = gridyEvent.dragSource.style.width;
  temporaryDropTarget.style.left = collision.block.x + "px";
  temporaryDropTarget.style.top = collision.block.y + "px";
  temporaryDropTarget.style.border = `2px dashed ${
    collision.block.isEmpty ? "Green" : "Red"
  }`;
}
export function removeTemporaryDropLocation(container: HTMLElement) {
  const tempDropTargets = document.querySelectorAll(
    `[${TileAttribute.tempDropTarget}=true]`
  );
  tempDropTargets &&
    tempDropTargets.length &&
    tempDropTargets.forEach(tempDropTarget => {
      tempDropTarget.remove();
    });
}

export function moveElementToTemporaryDropLocation(gridyEvent: GridyEvent) {
  const temporaryDropLocation: HTMLElement = document.querySelector(
    `[${TileAttribute.tempDropTarget}=true]`
  );
  moveElement(
    getNearestBlock(
      styleValue((<HTMLElement>gridyEvent.event.srcElement).style.left),
      styleValue((<HTMLElement>gridyEvent.event.srcElement).style.top)
    ),
    getNearestBlock(
      styleValue(temporaryDropLocation.style.left),
      styleValue(temporaryDropLocation.style.top)
    ),
    styleValue((<HTMLElement>gridyEvent.event.srcElement).style.height),
    styleValue((<HTMLElement>gridyEvent.event.srcElement).style.width)
  );
  if (temporaryDropLocation) {
    (<HTMLElement>gridyEvent.event.srcElement).style.left =
      temporaryDropLocation.style.left;
    (<HTMLElement>gridyEvent.event.srcElement).style.top =
      temporaryDropLocation.style.top;
  }
}
