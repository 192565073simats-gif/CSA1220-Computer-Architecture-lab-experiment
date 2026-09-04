import React from 'react';
import { Code, Play } from 'lucide-react';

export default function InstructionInput({ code, setCode, onCompile, activeSample }) {
  return (
    <div className="card instruction-editor-card">
      <div className="card-header">
        <div className="card-title">
          <Code className="card-icon text-cyan" /> Assembly Code Input
        </div>
        <button className="btn btn-sm btn-cyan" onClick={onCompile}>
          <Play className="btn-icon-sm" /> Load Program
        </button>
      </div>

      {activeSample && (
        <div className="sample-desc-banner">
          <strong>{activeSample.name}:</strong> {activeSample.description}
        </div>
      )}

      <textarea
        className="assembly-textarea"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="// Enter MIPS/RISC Assembly code here...&#10;ADD R1, R2, R3&#10;LW R4, 4(R1)&#10;SW R4, 8(R1)"
        rows={8}
      />
    </div>
  );
}
