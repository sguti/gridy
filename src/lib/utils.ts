import { TileAttribute } from "./lib.enums";

let _ID: number = 0;
export function setUniqueId(element: HTMLElement) {
  element.setAttribute(TileAttribute.uniqueId, `__draggble_tile${++_ID}`);
}
export function styleValue(value: string) {
  return +value.replace("%", "").replace("px", "");
}

export function debounce(func: Function, wait: number): any {
  let timeout;
  return function() {
    let _this = this,
      _arguments = arguments;
    timeout && clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      func.apply(_this, _arguments);
    }, wait);
  };
}
///This is not the proper way to do a deep copy
export function deepCopy<T>(object: T) {
  return JSON.parse(JSON.stringify(object)) as T;
}
