import { deepCopy, unique } from "./utils";

export enum CollisionPoint {
  Top,
  Right,
  Bottom,
  Left
}

export abstract class GridyBlock {
  x: number;
  y: number;
  row: number;
  column: number;
  top?: GridyBlock;
  right?: GridyBlock;
  bottom?: GridyBlock;
  left?: GridyBlock;
  tileId?: string;
  isEmpty: boolean;
  isStartOfATile?: boolean;
}
export abstract class BlockRange {
  blocks: GridyBlock[];
  rows: Number[];
  rowCount: Number;
  columns: Number[];
  columnCount: Number;
  startX: Number;
  endX: Number;
  startY: Number;
  endY: Number;
  isEmpty: Boolean;
  isComplete: Boolean;
}
export abstract class Collision {
  block: GridyBlock;
  collisionPoints: CollisionPoint[];
  collidingTiles: string[];
}
const _blocks = new Array<GridyBlock>();
const _blocksObject = {};
let _containerHeight = 0;
let _containerWidth = 0;
let _blockSize = 0;
let _columnCount = 0;
let _rowCount = 0;
export function createLogicalBlocks(
  width: number,
  height: number,
  blockSize: number
) {
  _containerHeight = height = usable(height, blockSize);
  _containerWidth = width = usable(width, blockSize);
  _blockSize = blockSize;

  if (!width || !height) {
    console.error(
      `container ${!width ? "width" : "height"} is smaller than block size`
    );
    throw "Unable to create blocks";
  }
  const rowCount = (_rowCount = height / blockSize);
  const colCount = (_columnCount = width / blockSize);
  for (let rowIndex = 1; rowIndex <= rowCount; rowIndex++) {
    for (let colIndex = 1; colIndex <= colCount; colIndex++) {
      const block: GridyBlock = {
        row: rowIndex,
        column: colIndex,
        y: (rowIndex - 1) * blockSize,
        x: (colIndex - 1) * blockSize,
        isEmpty: true
      };
      _blocks.push(block);
      _blocksObject[key(block.x, block.y)] = block;
    }
  }
  updateBlockReferences(rowCount, colCount);
  console.log(_blocksObject);
}
function updateBlockReferences(rowCount: number, colCount: number) {
  _blocks.forEach(block => {
    if (block.column > 1) {
      block.left = _blocks.find(
        _block => _block.column == block.column - 1 && _block.row === block.row
      );
    }
    if (block.column < colCount) {
      block.right = _blocks.find(
        _block => _block.column == block.column + 1 && _block.row === block.row
      );
    }
    if (block.row > 1) {
      block.top = _blocks.find(
        _block => _block.column == block.column && _block.row === block.row - 1
      );
    }
    if (block.row < rowCount) {
      block.bottom = _blocks.find(
        _block => _block.column == block.column && _block.row === block.row + 1
      );
    }
  });
}
function usable(length: number, blockLength: number): number {
  return Math.ceil(length / blockLength) * blockLength;
}
export function geAllBlocks(): GridyBlock[] {
  return _blocks;
}
export function getAvailableEmptyBlockRange(
  height: number,
  width: number
): GridyBlock[] {
  for (const _block of _blocks) {
    if (_block.isEmpty) {
      const blockRange = _getEmptyBlockRange(
        height,
        width,
        _block,
        _block.row,
        _block.column
      );
      if (blockRange && blockRange.length) {
        return blockRange;
      }
    }
  }
  return new Array<GridyBlock>();
}
function _getEmptyBlockRange(
  height: number,
  width: number,
  currentBlock: GridyBlock,
  row?: number,
  column?: number
): GridyBlock[] {
  const blockRange = new Array<GridyBlock>();
  if (height > _containerHeight || width > _containerWidth) {
    return blockRange;
  }
  let columnRequired = width / _blockSize;
  while (columnRequired > 0) {
    if (!currentBlock || !currentBlock.isEmpty) {
      return new Array<GridyBlock>();
    }
    blockRange.push(currentBlock);
    currentBlock = currentBlock.right;
    --columnRequired;
  }
  //columnrequired ===0 means space available in x axis
  if (columnRequired === 0) {
    const copy = blockRange.slice();
    for (let index = 0; index < copy.length; index++) {
      currentBlock = copy[index].bottom;
      let rowRequired = height / _blockSize - 1;
      while (rowRequired > 0) {
        if (!currentBlock || !currentBlock.isEmpty) {
          return new Array<GridyBlock>();
        }
        blockRange.push(currentBlock);
        currentBlock = currentBlock.bottom;
        --rowRequired;
      }
    }
  }
  return blockRange;
}

export function getBlockRange(
  currentBlock: GridyBlock,
  height: number,
  width: number
): BlockRange {
  const blockRange = new Array<GridyBlock>();
  let isEmptyBlock = false;
  let columnRequired = width / _blockSize;
  const columns = [];
  while (columnRequired > 0) {
    blockRange.push(currentBlock);
    isEmptyBlock = currentBlock.isEmpty;
    columns.push(currentBlock.column);
    currentBlock = currentBlock.right;
    --columnRequired;
    if (!currentBlock) {
      columnRequired = 0;
    }
  }
  const rows = [];
  if (columnRequired === 0) {
    const copy = blockRange.slice();
    for (let index = 0; index < copy.length; index++) {
      currentBlock = copy[index].bottom;
      let rowRequired = height / _blockSize - 1;
      while (rowRequired > 0) {
        blockRange.push(currentBlock);
        isEmptyBlock = currentBlock.isEmpty;
        rows.push(currentBlock.row);
        currentBlock = currentBlock.bottom;
        --rowRequired;
        if (!currentBlock) {
          rowRequired = 0;
        }
      }
    }
  }
  return {
    blocks: blockRange,
    columns: columns,
    columnCount: columns.length,
    rows: rows,
    rowCount: rows.length,
    isEmpty: isEmptyBlock,
    startX: blockRange[0].x,
    endX: blockRange[0].x + width,
    startY: blockRange[0].y,
    endY: blockRange[0].y + width,
    isComplete: rows.length * columns.length === blockRange.length
  };
}

export function getNearestBlock(x: number, y: number): GridyBlock {
  x = Math.floor(x / _blockSize) * _blockSize;
  y = Math.floor(y / _blockSize) * _blockSize;
  return _blocks.find(_block => _block.x === x && _block.y === y);
}
export function getCollisionData(
  x: number,
  y: number,
  height: number,
  width: number
): Collision {
  const nearestBlockX = Math.floor(x / _blockSize) * _blockSize;
  const nearestBlockY = Math.floor(y / _blockSize) * _blockSize;
  const collision: Collision = {
    block: _blocksObject[key(nearestBlockX, nearestBlockY)],
    collisionPoints: [
      x - nearestBlockX > _blockSize / 2
        ? CollisionPoint.Right
        : CollisionPoint.Left,
      y - nearestBlockY > _blockSize / 2
        ? CollisionPoint.Bottom
        : CollisionPoint.Top
    ],
    collidingTiles:
      unique(
        getBlockRange(
          _blocksObject[key(nearestBlockX, nearestBlockY)],
          height,
          width
        )
          .blocks.map(block => block.tileId)
          .filter(tileId => tileId),
        item => item
      ) || []
  };
  return collision;
}
export function moveElement(
  from: GridyBlock,
  to: GridyBlock,
  height: number = 50,
  width: number = 50
) {
  const fromBlockRange = getBlockRange(from, height, width);
  const toBlockRange = getBlockRange(to, height, width);
  toBlockRange.blocks.forEach(block => {
    block.isEmpty = false;
    block.tileId = from.tileId;
  });
  deleteBlockData(fromBlockRange.blocks);
}

export function deleteBlockData(blockRange: GridyBlock[]) {
  blockRange.forEach(block => {
    block.isEmpty = true;
    block.tileId = "";
    block.isStartOfATile = false;
  });
}
export function moveBlockRange(
  blockRange: GridyBlock[],
  to: GridyBlock
): boolean {
  const blockRangeCopy = deepCopy(blockRange);
  deleteBlockData(blockRange);
  const columns = blockRange
    .filter(block => block.row === blockRange[0].row)
    .map(block => block.column);
  const columnCount = columns.length;
  const rows = blockRange
    .filter(block => block.column === blockRange[0].column)
    .map(block => block.row);
  const rowCount = rows.length;
  const maxRowNumberWithBlock = Math.max(
    ..._blocks
      .filter(block => ~columns.indexOf(block.column))
      .map(block => block.row)
  );
  if (maxRowNumberWithBlock + rowCount > _rowCount) {
    console.log("not enough space to move the block");
    return false;
  }
  const oroginalBlockRange = getBlockRange(
    to,
    rowCount * _blockSize,
    columnCount * _blockSize
  );

  for (let rowNumber = to.row; rowNumber < to.row + rowCount; rowNumber++) {
    for (
      let columnNumber = 0;
      columnNumber < to.column + columnCount;
      columnNumber++
    ) {
      const originalBlock = oroginalBlockRange.blocks.find(
        block => block.row === rowNumber && block.column === columnNumber
      );
      const clipBoardBlock = blockRangeCopy.find(
        block => block.row === rowNumber && block.column === columnNumber
      );
      originalBlock.tileId = clipBoardBlock.tileId;
      originalBlock.isStartOfATile = clipBoardBlock.isStartOfATile;
      originalBlock.isEmpty = clipBoardBlock.isEmpty;
    }
  }
  return true;
}
export function shiftBlockRange(blockRange: BlockRange, collision: Collision) {
  const blockMoveGraph = [];
}

function key(x: number, y: number) {
  return `x${x}y${y}`;
}

export function isEmptyBlock(block: GridyBlock): boolean {
  return block.isEmpty;
}
