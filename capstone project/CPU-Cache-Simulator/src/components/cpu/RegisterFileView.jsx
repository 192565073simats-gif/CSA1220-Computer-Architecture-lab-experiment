import React from 'react';
import { Database } from 'lucide-react';
import { toHex } from '../../utils/binaryUtils.js';

export default function RegisterFileView({ registers = [] }) {
  return (
    <div className="card register-file-card">
      <div className="card-header">
        <div className="card-title">
          <Database className="card-icon text-amber" /> CPU Register File (R0 - R15)
        </div>
      </div>

      <div className="register-grid">
        {registers.map((val, i) => (
          <div key={i} className={`register-item ${val !== 0 ? 'reg-modified' : ''}`}>
            <div className="reg-name">R{i}</div>
            <div className="reg-val-dec">{val}</div>
            <div className="reg-val-hex">{toHex(val, 4)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
