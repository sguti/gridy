import { TileAttribute } from "./lib.enums";

export function setTileSize(element: HTMLElement, unit: number): void {
  element.style.height =
    +element.getAttribute(TileAttribute.height) * unit + "px";
  element.style.width =
    +element.getAttribute(TileAttribute.width) * unit + "px";
}
