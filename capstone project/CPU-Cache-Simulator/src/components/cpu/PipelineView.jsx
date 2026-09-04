import React from 'react';
import { ArrowRight, Cpu } from 'lucide-react';

export default function PipelineView({ pipelineState, hazardInfo }) {
  const stages = [
    {
      id: 'IF',
      name: '1. Instruction Fetch',
      short: 'IF',
      color: 'cyan',
      inst: pipelineState?.IF_ID?.inst,
      desc: 'Fetches raw instruction from memory at PC index.',
    },
    {
      id: 'ID',
      name: '2. Instruction Decode',
      short: 'ID',
      color: 'amber',
      inst: pipelineState?.ID_EX?.inst,
      isStall: pipelineState?.ID_EX?.isStall,
      desc: 'Decodes opcode, reads source registers (Rs, Rt), and checks hazards.',
    },
    {
      id: 'EX',
      name: '3. Execute / ALU',
      short: 'EX',
      color: 'emerald',
      inst: pipelineState?.EX_MEM?.inst,
      desc: 'Executes ALU logic, branch calculations, or memory address math.',
    },
    {
      id: 'MEM',
      name: '4. Memory Access',
      short: 'MEM',
      color: 'purple',
      inst: pipelineState?.MEM_WB?.inst,
      cacheResult: pipelineState?.MEM_WB?.cacheResult,
      desc: 'Interfaces with Cache Memory for LW/SW instructions.',
    },
    {
      id: 'WB',
      name: '5. Write Back',
      short: 'WB',
      color: 'rose',
      inst: pipelineState?.MEM_WB?.isRegWrite ? pipelineState?.MEM_WB?.inst : null,
      regWritten: pipelineState?.MEM_WB?.rd,
      valWritten: pipelineState?.MEM_WB?.finalVal,
      desc: 'Writes calculated result back into Destination Register File.',
    },
  ];

  return (
    <div className="card pipeline-view-card">
      <div className="card-header">
        <div className="card-title">
          <Cpu className="card-icon text-cyan" /> 5-Stage CPU Pipeline Execution Engine
        </div>
        <div className="cycle-badge">
          Cycle: <span className="text-cyan font-bold">{pipelineState?.cycleCount || 0}</span> | PC:{' '}
          <span className="text-amber font-bold">{pipelineState?.pc || 0}</span>
        </div>
      </div>

      <div className="pipeline-stages-grid">
        {stages.map((stage, idx) => (
          <React.Fragment key={stage.id}>
            <div
              className={`stage-card stage-card-${stage.color} ${
                stage.inst || stage.isStall ? 'stage-active' : ''
              }`}
            >
              <div className="stage-header">
                <span className="stage-tag">{stage.short}</span>
                <span className="stage-name">{stage.name}</span>
              </div>

              <div className="stage-content">
                {stage.isStall ? (
                  <div className="stall-bubble">
                    <span className="bubble-text">STALL (BUBBLE)</span>
                  </div>
                ) : stage.inst ? (
                  <div className="stage-instruction-box">
                    <div className="raw-inst-text">{stage.inst.raw}</div>
                    <div className="inst-details">
                      <span className="opcode-badge">{stage.inst.opcode}</span>
                      {stage.inst.rd !== null && (
                        <span className="reg-badge">Target: R{stage.inst.rd}</span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="stage-idle-text">Stage Idle</div>
                )}
              </div>

              {stage.id === 'MEM' && stage.cacheResult && (
                <div
                  className={`stage-cache-badge ${
                    stage.cacheResult.status === 'HIT' ? 'badge-hit' : 'badge-miss'
                  }`}
                >
                  Cache {stage.cacheResult.status} (Set {stage.cacheResult.setIndex})
                </div>
              )}

              {stage.id === 'WB' && stage.regWritten !== null && stage.valWritten !== undefined && (
                <div className="stage-wb-badge">
                  Written: R{stage.regWritten} = {stage.valWritten}
                </div>
              )}

              <div className="stage-footer">{stage.desc}</div>
            </div>

            {idx < stages.length - 1 && (
              <div className="stage-arrow">
                <ArrowRight className="arrow-icon" />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
