// 5-Stage CPU Pipeline Simulation Engine
import { RegisterFile } from './RegisterFile.js';
import { HazardDetector } from './HazardDetector.js';

export class PipelineEngine {
  constructor() {
    this.registerFile = new RegisterFile();
    this.instructions = [];
    this.pc = 0;
    this.cycleCount = 0;
    this.stallsCount = 0;
    this.executedInstructionsCount = 0;
    this.isCompleted = false;

    // Pipeline Stage Registers
    this.IF_ID = { inst: null, pc: 0 };
    this.ID_EX = { inst: null, valA: 0, valB: 0, rs: null, rt: null, rd: null, imm: 0 };
    this.EX_MEM = { inst: null, aluResult: 0, valB: 0, rd: null, isMemRead: false, isMemWrite: false };
    this.MEM_WB = { inst: null, finalVal: 0, rd: null, isRegWrite: false };

    // Hazard Status Log
    this.lastHazard = null;
    this.pipelineHistory = [];
  }

  loadProgram(instructions) {
    this.reset();
    this.instructions = instructions;
  }

  reset() {
    this.registerFile.reset();
    this.pc = 0;
    this.cycleCount = 0;
    this.stallsCount = 0;
    this.executedInstructionsCount = 0;
    this.isCompleted = false;
    this.lastHazard = null;

    this.IF_ID = { inst: null, pc: 0 };
    this.ID_EX = { inst: null, valA: 0, valB: 0, rs: null, rt: null, rd: null, imm: 0 };
    this.EX_MEM = { inst: null, aluResult: 0, valB: 0, rd: null, isMemRead: false, isMemWrite: false };
    this.MEM_WB = { inst: null, finalVal: 0, rd: null, isRegWrite: false };
    this.pipelineHistory = [];
  }

  step(cacheEngine = null) {
    if (this.isCompleted) return false;

    this.cycleCount++;
    this.lastHazard = null;

    // --- STAGE 5: WRITE BACK (WB) ---
    if (this.MEM_WB.inst && this.MEM_WB.isRegWrite && this.MEM_WB.rd !== null && this.MEM_WB.rd !== 0) {
      this.registerFile.write(this.MEM_WB.rd, this.MEM_WB.finalVal);
      this.executedInstructionsCount++;
    }

    // --- STAGE 4: MEMORY ACCESS (MEM) ---
    let memOutput = 0;
    let cacheResult = null;

    if (this.EX_MEM.inst) {
      const address = this.EX_MEM.aluResult;
      if (this.EX_MEM.isMemRead) {
        if (cacheEngine) {
          cacheResult = cacheEngine.access(address, 'READ');
          memOutput = cacheResult.data;
        } else {
          memOutput = address;
        }
      } else if (this.EX_MEM.isMemWrite) {
        if (cacheEngine) {
          cacheResult = cacheEngine.access(address, 'WRITE', this.EX_MEM.valB);
        }
        memOutput = this.EX_MEM.aluResult;
      } else {
        memOutput = this.EX_MEM.aluResult;
      }
    }

    this.MEM_WB = {
      inst: this.EX_MEM.inst,
      finalVal: memOutput,
      rd: this.EX_MEM.rd,
      isRegWrite: this.EX_MEM.inst ? this.EX_MEM.inst.writesReg : false,
      cacheResult: cacheResult,
    };

    // --- STAGE 3: EXECUTE (EX) ---
    let aluOut = 0;
    if (this.ID_EX.inst) {
      const op = this.ID_EX.inst.opcode;
      if (op === 'ADD') aluOut = this.ID_EX.valA + this.ID_EX.valB;
      else if (op === 'SUB') aluOut = this.ID_EX.valA - this.ID_EX.valB;
      else if (op === 'AND') aluOut = this.ID_EX.valA & this.ID_EX.valB;
      else if (op === 'OR') aluOut = this.ID_EX.valA | this.ID_EX.valB;
      else if (op === 'LW' || op === 'SW') aluOut = this.ID_EX.valA + this.ID_EX.imm;
    }

    this.EX_MEM = {
      inst: this.ID_EX.inst,
      aluResult: aluOut,
      valB: this.ID_EX.valB,
      rd: this.ID_EX.rd,
      isMemRead: this.ID_EX.inst?.opcode === 'LW',
      isMemWrite: this.ID_EX.inst?.opcode === 'SW',
    };

    // --- STAGE 2: INSTRUCTION DECODE (ID) & HAZARD DETECTION ---
    const hazardInfo = HazardDetector.detectDataHazard(this.IF_ID.inst, this.ID_EX, this.EX_MEM);

    if (hazardInfo.hasHazard) {
      this.stallsCount++;
      this.lastHazard = hazardInfo;

      // Insert Bubble into EX stage, hold IF_ID and PC
      this.ID_EX = { inst: null, isStall: true };
    } else {
      if (this.IF_ID.inst) {
        const inst = this.IF_ID.inst;
        this.ID_EX = {
          inst: inst,
          valA: this.registerFile.read(inst.rs),
          valB: this.registerFile.read(inst.rt),
          rs: inst.rs,
          rt: inst.rt,
          rd: inst.rd || inst.rt,
          imm: inst.imm || 0,
        };
        this.IF_ID = { inst: null };
      } else {
        this.ID_EX = { inst: null };
      }
    }

    // --- STAGE 1: INSTRUCTION FETCH (IF) ---
    if (!hazardInfo.hasHazard) {
      if (this.pc < this.instructions.length) {
        this.IF_ID = { inst: this.instructions[this.pc], pc: this.pc };
        this.pc++;
      } else {
        this.IF_ID = { inst: null };
      }
    }

    // Check pipeline completion
    if (
      this.pc >= this.instructions.length &&
      !this.IF_ID.inst &&
      !this.ID_EX.inst &&
      !this.EX_MEM.inst &&
      !this.MEM_WB.inst
    ) {
      this.isCompleted = true;
    }

    // Log current state to history
    this.pipelineHistory.push(this.getCurrentStateSnapshot());

    return true;
  }

  getCurrentStateSnapshot() {
    return {
      cycle: this.cycleCount,
      pc: this.pc,
      stalls: this.stallsCount,
      registers: this.registerFile.getValues(),
      stages: {
        IF: this.IF_ID.inst ? this.IF_ID.inst.raw : 'EMPTY',
        ID: this.ID_EX.inst ? this.ID_EX.inst.raw : (this.ID_EX.isStall ? 'STALL (BUBBLE)' : 'EMPTY'),
        EX: this.EX_MEM.inst ? this.EX_MEM.inst.raw : 'EMPTY',
        MEM: this.MEM_WB.inst ? this.MEM_WB.inst.raw : 'EMPTY',
        WB: this.MEM_WB.isRegWrite && this.MEM_WB.inst ? `${this.MEM_WB.inst.raw} -> R${this.MEM_WB.rd}` : 'EMPTY',
      },
    };
  }
}
