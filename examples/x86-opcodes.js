// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
(function() {
  const rootEl = document.getElementById("svg");
  const svg = new albert.Svg(rootEl, { allowResize: true });

  const CHARS = "0123456789ABCDEF".split("");
  const UNIT = 16;
  const FRAME_PADDING = UNIT;
  const HORIZONTAL_SPACING = UNIT / 2;
  const VERTICAL_SPACING = UNIT / 2;
  const OPCODE_SPACING = UNIT / 4;
  const OPCODE_OVERLAP = UNIT / 8;
  const NIBBLE_STYLE = { "font-family": "Input Mono, monospace" };
  const OPCODE_TEXT = {
    "font-family": "Roboto Condensed, sans-serif",
    "font-weight": 400
  };
  const OPCODES = [
    {
      label: "ADD",
      start: 0x00,
      end: 0x05,
      color: "#CDFE67"
    },
    {
      label: "ES\nPUSH\nSS",
      start: 0x06,
      end: 0x16,
      color: "#FFCD63"
    },
    {
      label: "ES\nPOP\nSS",
      start: 0x07,
      end: 0x17,
      color: "#FFCD63"
    },
    {
      label: "OR",
      start: 0x08,
      end: 0x0d,
      color: "#CDFE67"
    },
    {
      label: "CS\nPUSH\nDS",
      start: 0x0e,
      end: 0x1e,
      color: "#FFCD63"
    },
    {
      label: "TWO\nBYTE",
      start: 0x0f,
      end: 0x0f,
      color: "#DCDCDC"
    },
    {
      label: "ADC",
      start: 0x10,
      end: 0x15,
      color: "#CDFE67"
    },
    {
      label: "SBB",
      start: 0x18,
      end: 0x1d,
      color: "#CDFE67"
    },
    {
      label: "POP\nDS",
      start: 0x1f,
      end: 0x1f,
      color: "#FFCD63"
    },

    {
      label: "AND",
      start: 0x20,
      end: 0x25,
      color: "#CDFE67"
    },
    {
      label: "ES\nSEGMENT\nOVERRIDE\nSS",
      start: 0x26,
      end: 0x36,
      color: "#FFFF69"
    },
    {
      label: "DAA",
      start: 0x27,
      end: 0x27,
      color: "#CDFE67"
    },
    {
      label: "SUB",
      start: 0x28,
      end: 0x2d,
      color: "#CDFE67"
    },
    {
      label: "CS\nSEGMENT\nOVERRIDE\nDS",
      start: 0x2e,
      end: 0x3e,
      color: "#FFFF69"
    },
    {
      label: "DAS",
      start: 0x2f,
      end: 0x2f,
      color: "#CDFE67"
    },
    {
      label: "XOR",
      start: 0x30,
      end: 0x35,
      color: "#CDFE67"
    },
    {
      label: "AAA",
      start: 0x37,
      end: 0x37,
      color: "#CDFE67"
    },
    {
      label: "CMP",
      start: 0x38,
      end: 0x3d,
      color: "#AADBFB"
    },
    {
      label: "AAS",
      start: 0x3f,
      end: 0x3f,
      color: "#CDFE67"
    },
    {
      label: "INC",
      start: 0x40,
      end: 0x47,
      color: "#CDFE67"
    },
    {
      label: "DEC",
      start: 0x48,
      end: 0x4f,
      color: "#CDFE67"
    },
    {
      label: "PUSH",
      start: 0x50,
      end: 0x57,
      color: "#FFCC66"
    },
    {
      label: "POP",
      start: 0x58,
      end: 0x5f,
      color: "#FFCC66"
    },
    {
      label: "¯\\_(ツ)_/¯",
      start: 0x60,
      end: 0xff
    }
  ];

  const { align, eq, geq, leq } = albert;

  function generateFirstNibbles() {
    const table = new albert.TextTable(NIBBLE_STYLE);
    table.addColumn(CHARS.map(char => char + "x")).setSpacing(VERTICAL_SPACING);
    svg.append(table).constrain(eq(table.fontSize, UNIT), table.constraints());
    return table;
  }
  function generateSecondNibbles() {
    const table = new albert.TextTable(NIBBLE_STYLE);
    table.addRow(CHARS.map(char => "x" + char)).setSpacing(HORIZONTAL_SPACING);
    svg.append(table).constrain(eq(table.fontSize, UNIT), table.constraints());
    return table;
  }
  function makeOpcode(code, color = "#ccc") {
    const background = new albert.Rect({
      fill: color,
      rx: UNIT / 4,
      ry: UNIT / 4
    });
    const text = (() => {
      if (code.includes("\n")) {
        const table = new albert.TextTable(OPCODE_TEXT);
        table.addColumn(code.split("\n")).alignTo("center");
        svg.constrain(table.constraints());
        return table;
      } else {
        return new albert.Text(code, OPCODE_TEXT);
      }
    })();
    const group = new albert.Group([background, text]);

    svg
      .append(group)
      .constrain(
        eq(background.centerX, text.centerX),
        eq(background.centerY, text.centerY),
        geq(text.topEdge.minus(background.topEdge), OPCODE_SPACING),
        leq(text.bottomEdge.minus(background.bottomEdge), -OPCODE_SPACING),
        geq(text.leftEdge.minus(background.leftEdge), OPCODE_SPACING),
        leq(text.rightEdge.minus(background.rightEdge), -OPCODE_SPACING)
      );

    return {
      leftEdge: background.leftEdge,
      rightEdge: background.rightEdge,
      topEdge: background.topEdge,
      bottomEdge: background.bottomEdge,
      centerX: background.centerX,
      centerY: background.centerY,
      render() {
        return group.render();
      }
    };
  }

  const firstNibbles = generateFirstNibbles();
  const secondNibbles = generateSecondNibbles();

  function getOffsetEdges(offset) {
    const row = firstNibbles.getRow(offset >> 4);
    const column = secondNibbles.getColumn(offset & 0xf);
    return {
      top: row.topEdge,
      bottom: row.bottomEdge,
      left: column.leftEdge,
      right: column.rightEdge
    };
  }

  function alignOpcode(opcode, start, end) {
    const startEdges = getOffsetEdges(start);
    const endEdges = getOffsetEdges(end);

    return [
      align(opcode.leftEdge, startEdges.left, -OPCODE_OVERLAP),
      align(opcode.rightEdge, endEdges.right, OPCODE_OVERLAP),
      align(opcode.topEdge, startEdges.top, -OPCODE_OVERLAP),
      align(opcode.bottomEdge, endEdges.bottom, OPCODE_OVERLAP)
    ];
  }

  console.time("constraints");
  svg.constrain(
    align(firstNibbles.leftEdge, svg.leftEdge, FRAME_PADDING),
    align(firstNibbles.bottomEdge, svg.bottomEdge, -FRAME_PADDING),
    align(secondNibbles.topEdge, svg.topEdge, FRAME_PADDING),
    align(secondNibbles.rightEdge, svg.rightEdge, -FRAME_PADDING),

    align(secondNibbles.leftEdge, firstNibbles.rightEdge, HORIZONTAL_SPACING),
    align(firstNibbles.topEdge, secondNibbles.bottomEdge, VERTICAL_SPACING)
  );

  for (const opcodeDef of OPCODES) {
    const opcode = makeOpcode(opcodeDef.label, opcodeDef.color);
    svg.constrain(alignOpcode(opcode, opcodeDef.start, opcodeDef.end));
  }
  console.timeEnd("constraints");

  svg.render();
})();
