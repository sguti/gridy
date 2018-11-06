export enum GridyEventType {
  Any = "Any",
  DragStart = "DragStart",
  DragOver = "DragOver",
  DragEnter = "DragEnter",
  DragLeave = "DragLeave",
  DragEnd = "DragEnd",
  Drop = "Drop"
}
export class GridyEvent {
  constructor(
    public type: GridyEventType,
    public event: Event,
    public dragSource?: HTMLElement
  ) {}
}

const _listners = {};
export function on(
  gridyEvent: GridyEventType,
  callback: (eventModel: GridyEvent) => void
): void {
  _listners[gridyEvent] = _listners[gridyEvent] || [];
  _listners[gridyEvent].push(callback);
}
export function trigger(
  gridyEvent: GridyEventType,
  event: Event,
  dragSource?: HTMLElement
): void {
  []
    .concat(
      ...(_listners[gridyEvent] || []),
      ...(_listners[GridyEventType.Any] || [])
    )
    .forEach(callback => {
      callback(new GridyEvent(gridyEvent, event, dragSource));
    });
}
