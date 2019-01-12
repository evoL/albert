import Text from "./Text";
import { appendTo, createElement, isPointLike, last, maxBy } from "./utils";
import { align, eq, expression, geq } from "./helpers";

const CENTER = "center";
const HORIZONTAL_ALIGNMENTS = {
  left: "leftEdge",
  center: "centerX",
  right: "rightEdge"
};
const VERTICAL_ALIGNMENTS = {
  top: "topEdge",
  baseline: "baseline",
  center: "centerY",
  bottom: "bottomEdge"
};

function findRowLeader(row) {
  return maxBy(row, cell => (cell ? cell.ratios.height : 0));
}

function findColumnLeader(column) {
  return maxBy(column, cell => (cell ? cell.ratios.width : 0));
}

function resolveAlignment(first, second) {
  let horizontal, vertical;
  if (first === CENTER && !second) {
    horizontal = CENTER;
    vertical = CENTER;
  } else if (HORIZONTAL_ALIGNMENTS[first]) {
    horizontal = first;
    if (VERTICAL_ALIGNMENTS[second]) {
      vertical = second;
    }
  } else if (VERTICAL_ALIGNMENTS[first]) {
    vertical = first;
    if (HORIZONTAL_ALIGNMENTS[second]) {
      horizontal = second;
    }
  }

  if (!horizontal && !vertical) {
    throw new Error(`Cannot align to ${first}` + second ? `, ${second}` : "");
  }

  return { horizontal, vertical };
}

class Cell extends Text {
  constructor(
    table,
    string,
    attributes,
    position,
    horizontalAlignment,
    verticalAlignment
  ) {
    super(string, attributes);
    this.table_ = table;
    this.position_ = position;
    this.horizontalAlignment = horizontalAlignment;
    this.verticalAlignment = verticalAlignment;
    this.suppressUpdates_ = false;
  }

  alignTo(first, second = undefined, updateTable = true) {
    const { horizontal, vertical } = resolveAlignment(first, second);

    if (horizontal) {
      this.horizontalAlignment = horizontal;
    }
    if (vertical) {
      this.verticalAlignment = vertical;
    }

    return this;
  }

  render() {
    const el = super.render();
    if (this.position_) {
      el.setAttributeNS(null, "data-row", this.position_.y);
      el.setAttributeNS(null, "data-column", this.position_.x);
    }
    return el;
  }

  adjustDimensions_() {
    super.adjustDimensions_();
    if (this.table_ && !this.suppressUpdates_) {
      this.table_.updateLeaders(this.position_);
    }
  }

  withUpdatesSuppressed(callback) {
    this.suppressUpdates_ = true;
    callback();
    this.suppressUpdates_ = false;
  }
}

class Slice {
  constructor(table, cells, position, edges) {
    this.table_ = table;
    this.cells_ = cells;
    this.position_ = position;

    this.leftEdge = edges.left;
    this.topEdge = edges.top;
    this.rightEdge = edges.right;
    this.bottomEdge = edges.bottom;
    this.x = this.leftEdge;
    this.y = this.topEdge;
    this.width = expression(this.rightEdge).minus(this.leftEdge);
    this.height = expression(this.bottomEdge).minus(this.topEdge);
    this.centerX = this.leftEdge.plus(this.rightEdge).divide(2);
    this.centerY = this.topEdge.plus(this.bottomEdge).divide(2);
  }

  contents() {
    return this.cells_;
  }

  alignTo(one, two) {
    for (const cell of this.cells_) {
      cell.alignTo(one, two);
    }
    return this;
  }

  setAttributes(attributes) {
    for (const cell of this.cells_) {
      cell.withUpdatesSuppressed(() => {
        cell.setAttributes(attributes);
      });
    }

    this.table_.updateLeaders(this.position_);
    return this;
  }

  format(start, end, attributes) {
    for (const cell of this.cells_) {
      cell.withUpdatesSuppressed(() => {
        cell.format(start, end, attributes);
      });
    }
    this.table_.updateLeaders(this.position_);
    return this;
  }

  formatRegexp(regexp, attributes) {
    for (const cell of this.cells_) {
      cell.withUpdatesSuppressed(() => {
        cell.formatRegexp(regexp, attributes);
      });
    }
    this.table_.updateLeaders(this.position_);
    return this;
  }
}

export default class TextTable {
  constructor(attributes = {}) {
    this.attributes_ = attributes;
    this.columnCount_ = 0;
    this.rows_ = [];
    this.headers_ = null;
    this.spacing_ = { x: 0, y: 0 };
    this.rowLeaders_ = [];
    this.columnLeaders_ = [];
    this.defaultAlignment_ = {
      horizontal: "left",
      vertical: "baseline"
    };

    this.fontSize = null;
    this.leftEdge = null;
    this.topEdge = null;
    this.rightEdge = null;
    this.bottomEdge = null;
    this.x = null;
    this.y = null;
    this.width = null;
    this.height = null;
    this.centerX = null;
    this.centerY = null;
  }

  addRow(row) {
    if (row.length > this.columnCount_) {
      this.setColumnCount_(row.length);
    } else if (row.length < this.columnCount_) {
      const rowCopy = row.slice();
      rowCopy.length = this.columnCount_;
      return this.addRow(rowCopy);
    }

    const y = this.rows_.length;
    this.rows_.push(
      row.map((string, x) => string && this.createCell_(string, { x, y }))
    );
    this.updateLeaders({ y });
    return this;
  }

  addColumn(column) {
    const insertionIndex = this.columnCount_;
    this.setColumnCount_(this.columnCount_ + 1);

    const rowCount = this.rows_.length;
    for (let y = 0; y < column.length; y++) {
      if (y < rowCount) {
        this.rows_[y][insertionIndex] = this.createCell_(column[y], {
          x: insertionIndex,
          y
        });
      } else {
        const row = new Array(this.columnCount_);
        row[insertionIndex] = this.createCell_(column[y], {
          x: insertionIndex,
          y
        });
        this.rows_.push(row);
      }
    }

    this.updateLeaders({ x: insertionIndex });
    return this;
  }

  addRows(...rows) {
    for (const row of rows) {
      this.addRow(row);
    }
    return this;
  }

  addColumns(...columns) {
    for (const column of columns) {
      this.addColumn(column);
    }
    return this;
  }

  getCell(x, y) {
    return this.rows_[y][x];
  }

  getRow(y) {
    return new Slice(
      this,
      this.rows_[y],
      { y },
      {
        left: this.leftEdge,
        top: this.rowLeaders_[y].topEdge,
        right: this.rightEdge,
        bottom: this.rowLeaders_[y].bottomEdge
      }
    );
  }

  getColumn(x) {
    return new Slice(
      this,
      this.column(x),
      { x },
      {
        left: this.columnLeaders_[x].leftEdge,
        top: this.topEdge,
        right: this.columnLeaders_[x].rightEdge,
        bottom: this.bottomEdge
      }
    );
  }

  getAllCells() {
    return new Slice(
      this,
      Array.from(this.cells()),
      {},
      {
        left: this.leftEdge,
        top: this.topEdge,
        right: this.rightEdge,
        bottom: this.bottomEdge
      }
    );
  }

  getRowCount() {
    return this.rows_.length;
  }

  getColumnCount() {
    return this.columnCount_;
  }

  lineHeight(multiplier = 1) {
    return new Expression(this.fontSize).times(multiplier);
  }

  column(x) {
    return this.rows_.reduce((column, row) => column.concat([row[x]]), []);
  }

  *cells() {
    for (const row of this.rows_) {
      for (const cell of row) {
        if (cell) {
          yield cell;
        }
      }
    }
  }

  alignTo(one, two) {
    this.getAllCells().alignTo(one, two);
    Object.assign(this.defaultAlignment_, resolveAlignment(one, two));
    return this;
  }

  setSpacing(xOrPoint, y = undefined) {
    if (isPointLike(xOrPoint)) {
      this.spacing_ = xOrPoint;
      return this;
    }
    if (y === undefined) {
      this.spacing_ = { x: xOrPoint, y: xOrPoint };
      return this;
    }

    this.spacing_ = { x: xOrPoint, y };
    return this;
  }

  setAttributes(attributes) {
    Object.assign(this.attributes_, attributes);
    this.getAllCells().setAttributes(attributes);
    return this;
  }

  render() {
    const el = createElement(
      "g",
      Object.assign({ "data-type": "texttable" }, this.attributes_)
    );
    for (const cell of this.cells()) {
      el.appendChild(cell.render());
    }

    return el;
  }

  constraints() {
    // All font sizes should be equal.
    const equalFontSizes = Array.from(this.cells())
      .slice(1)
      .map(cell => eq(this.fontSize, cell.fontSize));

    // The font size should be positive.
    const positiveFontSize = []; //[geq(this.fontSize, 1)];

    // Per-row constraints
    const rows = [];
    this.rows_.forEach((row, y) => {
      const leader = this.rowLeaders_[y];

      appendTo(
        rows,
        row.filter(cell => cell && cell !== leader).map(cell => {
          const field = VERTICAL_ALIGNMENTS[cell.verticalAlignment];
          return eq(leader[field], cell[field]);
        })
      );
    });

    // Per-column constraints
    const columns = [];
    for (let x = 0; x < this.columnCount_; x++) {
      const column = this.column(x);
      const leader = this.columnLeaders_[x];

      appendTo(
        columns,
        column.filter(cell => cell && cell !== leader).map(cell => {
          const field = HORIZONTAL_ALIGNMENTS[cell.horizontalAlignment];
          return eq(leader[field], cell[field]);
        })
      );
    }

    // Constraints between rows
    const betweenRows = [];
    for (let y = 1; y < this.rows_.length; y++) {
      betweenRows.push(
        align(
          this.rowLeaders_[y].topEdge,
          this.rowLeaders_[y - 1].bottomEdge,
          this.spacing_.y
        )
      );
    }

    // Constraints between columns
    const betweenColumns = [];
    for (let x = 1; x < this.columnCount_; x++) {
      betweenColumns.push(
        align(
          this.columnLeaders_[x].leftEdge,
          this.columnLeaders_[x - 1].rightEdge,
          this.spacing_.x
        )
      );
    }

    return equalFontSizes.concat(
      positiveFontSize,
      rows,
      columns,
      betweenRows,
      betweenColumns
    );
  }

  createCell_(string, position) {
    return new Cell(
      this,
      string,
      this.attributes_,
      position,
      this.defaultAlignment_.horizontal,
      this.defaultAlignment_.vertical
    );
  }

  setColumnCount_(count) {
    if (count === this.columnCount_) {
      return;
    }
    for (const row of this.rows_) {
      row.length = count;
    }
    this.columnCount_ = count;
  }

  updateLeaders(position) {
    // this assumes that all cells have an equal font size
    // TODO: support the case when a cell can have different font size
    if (!this.rows_.length) {
      return;
    }

    if (position === undefined) {
      position = {};
    }
    const { x, y } = position;

    if (x !== undefined && y !== undefined) {
      // The cell itself has changed
      const cell = this.getCell(x, y);

      this.tryUpdatingRowLeader_(y, cell);
      this.tryUpdatingColumnLeader_(x, cell);
    } else if (x !== undefined) {
      // The entire column has changed
      const column = this.column(x);
      this.columnLeaders_[x] = findColumnLeader(column);

      for (let y = 0; y < this.rows_.length; y++) {
        this.tryUpdatingRowLeader_(y, column[y]);
      }
    } else if (y !== undefined) {
      // The entire row has changed
      const row = this.rows_[y];
      this.rowLeaders_[y] = findRowLeader(row);

      for (let x = 0; x < this.columnCount_; x++) {
        this.tryUpdatingColumnLeader_(x, row[x]);
      }
    } else {
      // The entire table has changed
      for (let y = 0; y < this.rows_.length; y++) {
        this.rowLeaders_[y] = findRowLeader(this.rows_[y]);
      }
      for (let x = 0; x < this.columnCount_; x++) {
        this.columnLeaders_[x] = findColumnLeader(this.column(x));
      }
    }

    this.updateExpressions_();
  }

  tryUpdatingRowLeader_(index, cell) {
    if (!cell) {
      return;
    }

    if (!this.rowLeaders_[index]) {
      // There's no leader yet
      this.rowLeaders_[index] = cell;
      return;
    }

    if (this.rowLeaders_[index] === cell) {
      // The ratio might be invalid, find a new leader just in case
      this.rowLeaders_[index] = findRowLeader(this.rows_[index]);
      return;
    }

    if (this.rowLeaders_[index].ratios.height < cell.ratios.height) {
      // This cell is bigger than the leader
      this.rowLeaders_[index] = cell;
    }
  }

  tryUpdatingColumnLeader_(index, cell) {
    if (!cell) {
      return;
    }

    if (!this.columnLeaders_[index]) {
      // There's no leader yet
      this.columnLeaders_[index] = cell;
      return;
    }

    if (this.columnLeaders_[index] === cell) {
      // The ratio might be invalid, find a new leader just in case
      this.columnLeaders_[index] = findColumnLeader(this.column(index));
      return;
    }

    if (this.columnLeaders_[index].ratios.width < cell.ratios.width) {
      // This cell is bigger than the leader
      this.columnLeaders_[index] = cell;
    }
  }

  updateExpressions_() {
    if (!this.rows_.length) {
      this.fontSize = null;
      this.leftEdge = null;
      this.topEdge = null;
      this.rightEdge = null;
      this.bottomEdge = null;
      this.x = null;
      this.y = null;
      this.width = null;
      this.height = null;
      this.centerX = null;
      this.centerY = null;
      return;
    }

    const topMostCell = this.rowLeaders_[0];
    const bottomMostCell = last(this.rowLeaders_);
    const leftMostCell = this.columnLeaders_[0];
    const rightMostCell = last(this.columnLeaders_);

    this.fontSize = expression(this.getCell(0, 0).fontSize);
    this.leftEdge = expression(leftMostCell.leftEdge);
    this.topEdge = expression(topMostCell.topEdge);
    this.rightEdge = expression(rightMostCell.rightEdge);
    this.bottomEdge = expression(bottomMostCell.bottomEdge);
    this.x = this.leftEdge;
    this.y = this.topEdge;
    this.width = this.rightEdge.minus(this.leftEdge);
    this.height = this.bottomEdge.minus(this.topEdge);
    this.centerX = this.leftEdge.plus(this.rightEdge).divide(2);
    this.centerY = this.topEdge.plus(this.bottomEdge).divide(2);
  }
}
