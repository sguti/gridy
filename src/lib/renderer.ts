import {
  getAvailableEmptyBlockRange,
  getNearestBlock,
  moveBlocks,
  getCollisionData,
  shiftBlockRange,
  updateBlockRange
} from "./block";
import { styleValue } from "./utils";
import { TileAttribute, DropTargetAttribute } from "./lib.enums";
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
    if (blockRange && blockRange.isComplete) {
      tile.style.left = blockRange.blocks[0].x + "px";
      tile.style.top = blockRange.blocks[0].y + "px";
      blockRange.blocks.forEach((block, index) => {
        if (index === 0) {
          block.isStartOfATile = true;
        }
        block.isEmpty = false;
        block.tileId = tile.getAttribute(TileAttribute.uniqueId);
      });
    }
    updateBlockRange(tile.getAttribute(TileAttribute.uniqueId), blockRange);
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
    styleValue(gridyEvent.dragSource.style.width),
    gridyEvent.dragSource.getAttribute(TileAttribute.uniqueId)
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
  temporaryDropTarget.style.left = collision.entryBlock.x + "px";
  temporaryDropTarget.style.top = collision.entryBlock.y + "px";
  temporaryDropTarget.style.border = `2px dashed ${
    collision.entryBlock.isEmpty ? "Green" : "Red"
  }`;
}
export function createTemporaryDropLocationV2(
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
  const blockHeight = styleValue(gridyEvent.dragSource.style.height);
  const blockWidth = styleValue(gridyEvent.dragSource.style.width);
  const collision = getCollisionData(
    offsetX,
    offsetY,
    blockHeight,
    blockWidth,
    gridyEvent.dragSource.getAttribute(TileAttribute.uniqueId)
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
  if (collision.isCollision) {
    shiftBlockRange(collision.entryBlock, blockHeight, blockWidth);
  }
  temporaryDropTarget.style.height = gridyEvent.dragSource.style.height;
  temporaryDropTarget.style.width = gridyEvent.dragSource.style.width;
  temporaryDropTarget.style.left = collision.entryBlock.x + "px";
  temporaryDropTarget.style.top = collision.entryBlock.y + "px";
  temporaryDropTarget.style.border = `2px dashed ${
    !collision.isCollision ? "Green" : "Red"
  }`;
  temporaryDropTarget.setAttribute(
    DropTargetAttribute.isValid,
    "" + !collision.isCollision
  );
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
  if (
    temporaryDropLocation.getAttribute(DropTargetAttribute.isValid) !== "true"
  ) {
    return alert("collision");
  }
  const from = getNearestBlock(
    styleValue((<HTMLElement>gridyEvent.event.srcElement).style.left),
    styleValue((<HTMLElement>gridyEvent.event.srcElement).style.top)
  );
  const to = getNearestBlock(
    styleValue(temporaryDropLocation.style.left),
    styleValue(temporaryDropLocation.style.top)
  );
  const blockHeight = styleValue(
    (<HTMLElement>gridyEvent.event.srcElement).style.height
  );
  const blockWidth = styleValue(
    (<HTMLElement>gridyEvent.event.srcElement).style.width
  );
  moveBlocks(from, to, blockHeight, blockWidth);
  if (temporaryDropLocation) {
    (<HTMLElement>gridyEvent.event.srcElement).style.left =
      temporaryDropLocation.style.left;
    (<HTMLElement>gridyEvent.event.srcElement).style.top =
      temporaryDropLocation.style.top;
  }
}
