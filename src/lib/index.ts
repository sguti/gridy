import { setTileSize } from "./size";
import { draggable } from "./draggable";
import { droppable } from "./droppable";
import { setUniqueId } from "./utils";
import { on, GridyEventType, GridyEvent } from "./gridy.event";
import { createLogicalBlocks, geAllBlocks } from "./block";
import {
  autoAlignItems,
  createTemporaryDropLocation,
  removeTemporaryDropLocation,
  moveElementToTemporaryDropLocation
} from "./renderer";

export enum LayoutType {
  Smart,
  Manual,
  Auto
}
export interface GridyConfig {
  container: HTMLElement;
  tiles: Array<HTMLElement>;
  containerWidth: number;
  containerHeight: number;
  blockSize: number;
  autoAlign: boolean;
}
export function gridy(config: GridyConfig) {
  config.tiles.forEach((tile: HTMLElement) => {
    setUniqueId(tile);
    setTileSize(tile, config.blockSize);
    draggable(tile);
    droppable(tile);
    tile.style.visibility = "Visible";
  });
  droppable(config.container);
  createLogicalBlocks(
    config.containerWidth,
    config.containerHeight,
    config.blockSize
  );

  config.autoAlign && autoAlignItems(config.container, config.tiles);
  on(GridyEventType.DragOver, (eventModel: GridyEvent) => {
    console.log("Drag over");
    createTemporaryDropLocation(config.container, eventModel);
  });
  on(GridyEventType.DragStart, (eventModel: GridyEvent) => {
    // removeTemporaryDropLocation(config.container);
  });
  on(GridyEventType.DragEnd, (eventModel: GridyEvent) => {
    moveElementToTemporaryDropLocation(eventModel);
    removeTemporaryDropLocation(config.container);
  });
}
