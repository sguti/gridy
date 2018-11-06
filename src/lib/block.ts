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
}
const _blocks = new Array<GridyBlock>();
let _containerHeight = 0;
let _containerWidth = 0;
let _blockSize = 0;
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
  const rowCount = height / blockSize;
  const colCount = width / blockSize;
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
    }
  }
  updateBlockReferences(rowCount, colCount);
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
export function getEmptyBlockRange(
  height: number,
  width: number
): GridyBlock[] {
  for (const _block of _blocks) {
    if (_block.isEmpty) {
      const blockRange = _getBlockRange(
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
function _getBlockRange(
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
): GridyBlock[] {
  const blockRange = new Array<GridyBlock>();

  let columnRequired = width / _blockSize;
  while (columnRequired > 0) {
    blockRange.push(currentBlock);
    currentBlock = currentBlock.right;
    --columnRequired;
    if (!currentBlock) {
      columnRequired = 0;
    }
  }
  if (columnRequired === 0) {
    const copy = blockRange.slice();
    for (let index = 0; index < copy.length; index++) {
      currentBlock = copy[index].bottom;
      let rowRequired = height / _blockSize - 1;
      while (rowRequired > 0) {
        blockRange.push(currentBlock);
        currentBlock = currentBlock.bottom;
        --rowRequired;
        if (!currentBlock) {
          rowRequired = 0;
        }
      }
    }
  }
  return blockRange;
}

export function getNearestBlock(x: number, y: number): GridyBlock {
  x = Math.floor(x / _blockSize) * _blockSize;
  y = Math.floor(y / _blockSize) * _blockSize;
  return _blocks.find(_block => _block.x === x && _block.y === y);
}
export function moveElement(
  from: GridyBlock,
  to: GridyBlock,
  height: number = 50,
  width: number = 50
) {
  const fromBlockRange = getBlockRange(from, height, width);
  const toBlockRange = getBlockRange(to, height, width);
  toBlockRange.forEach(block => {
    block.isEmpty = false;
    block.tileId = from.tileId;
  });
  fromBlockRange.forEach(block => {
    block.isEmpty = true;
    block.tileId = "";
  });
}
export function updateBlock() {}
export function isEmptyBlock() {}
