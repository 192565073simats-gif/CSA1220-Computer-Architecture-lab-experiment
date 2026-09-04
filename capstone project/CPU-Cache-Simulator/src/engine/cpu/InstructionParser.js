// MIPS/RISC Instruction Parser
import { parseRegisterName, parseAddressInput } from '../../utils/binaryUtils.js';

export function parseAssemblyProgram(programText) {
  if (!programText) return [];

  const lines = programText.split('\n');
  const instructions = [];

  lines.forEach((line, index) => {
    let cleanLine = line.trim();
    // Remove comments
    if (cleanLine.includes('//')) {
      cleanLine = cleanLine.split('//')[0].trim();
    }
    if (cleanLine.includes('#')) {
      cleanLine = cleanLine.split('#')[0].trim();
    }
    if (!cleanLine) return;

    // Tokenize
    const parts = cleanLine.replace(/,/g, ' ').split(/\s+/).filter(Boolean);
    const opcode = parts[0].toUpperCase();

    let parsedInst = {
      id: index + 1,
      raw: cleanLine,
      opcode: opcode,
      rd: null,
      rs: null,
      rt: null,
      imm: 0,
      writesReg: false,
      isMemRead: false,
      isMemWrite: false,
    };

    if (opcode === 'ADD' || opcode === 'SUB' || opcode === 'AND' || opcode === 'OR') {
      // Format: ADD rd, rs, rt
      parsedInst.rd = parseRegisterName(parts[1]);
      parsedInst.rs = parseRegisterName(parts[2]);
      parsedInst.rt = parseRegisterName(parts[3]);
      parsedInst.writesReg = true;
    } else if (opcode === 'LW') {
      // Format: LW rt, offset(rs) OR LW rt, imm, rs
      parsedInst.rt = parseRegisterName(parts[1]);
      parsedInst.rd = parsedInst.rt;
      parsedInst.writesReg = true;
      parsedInst.isMemRead = true;

      const memArg = parts[2];
      if (memArg && memArg.includes('(') && memArg.includes(')')) {
        const match = memArg.match(/^(-?\d+|0x[0-9a-fA-F]+)?\((R\d+|\$ZERO)\)$/i);
        if (match) {
          parsedInst.imm = parseAddressInput(match[1] || '0');
          parsedInst.rs = parseRegisterName(match[2]);
        }
      } else {
        parsedInst.imm = parseAddressInput(parts[2] || '0');
        parsedInst.rs = parseRegisterName(parts[3]);
      }
    } else if (opcode === 'SW') {
      // Format: SW rt, offset(rs)
      parsedInst.rt = parseRegisterName(parts[1]);
      parsedInst.isMemWrite = true;

      const memArg = parts[2];
      if (memArg && memArg.includes('(') && memArg.includes(')')) {
        const match = memArg.match(/^(-?\d+|0x[0-9a-fA-F]+)?\((R\d+|\$ZERO)\)$/i);
        if (match) {
          parsedInst.imm = parseAddressInput(match[1] || '0');
          parsedInst.rs = parseRegisterName(match[2]);
        }
      } else {
        parsedInst.imm = parseAddressInput(parts[2] || '0');
        parsedInst.rs = parseRegisterName(parts[3]);
      }
    } else if (opcode === 'BEQ') {
      // Format: BEQ rs, rt, offset
      parsedInst.rs = parseRegisterName(parts[1]);
      parsedInst.rt = parseRegisterName(parts[2]);
      parsedInst.imm = parseAddressInput(parts[3] || '0');
    } else if (opcode === 'NOP') {
      // No operation
    }

    instructions.push(parsedInst);
  });

  return instructions;
}
