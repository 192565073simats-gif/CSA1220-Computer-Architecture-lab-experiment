// Hazard Detection Unit for 5-Stage CPU Pipeline
export class HazardDetector {
  static detectDataHazard(if_id_inst, id_ex_stage, ex_mem_stage) {
    if (!if_id_inst) return { hasHazard: false, reason: null };

    const srcRs = if_id_inst.rs;
    const srcRt = if_id_inst.rt;

    // Check Load-Use Data Hazard (Requires Stall Bubble)
    if (id_ex_stage.inst && id_ex_stage.inst.opcode === 'LW') {
      const destReg = id_ex_stage.inst.rt;
      if (destReg !== null && destReg !== 0 && (destReg === srcRs || destReg === srcRt)) {
        return {
          hasHazard: true,
          type: 'LOAD_USE_HAZARD',
          reason: `Stall required: LW instruction in EX will write to R${destReg}, needed by R${srcRs === destReg ? 's' : 't'} of next instruction.`,
          stall: true,
        };
      }
    }

    // Check General RAW Hazard (No forwarding mode)
    if (id_ex_stage.inst && id_ex_stage.inst.writesReg) {
      const destReg = id_ex_stage.inst.rd || id_ex_stage.inst.rt;
      if (destReg !== null && destReg !== 0 && (destReg === srcRs || destReg === srcRt)) {
        return {
          hasHazard: true,
          type: 'RAW_DATA_HAZARD',
          reason: `RAW Hazard: Instruction in EX writes to R${destReg}, which is read by instruction in ID stage.`,
          stall: true,
        };
      }
    }

    return { hasHazard: false, reason: null, stall: false };
  }
}
