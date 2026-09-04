import React from 'react';
import { Sliders, RefreshCw } from 'lucide-react';
import { ASSOCIATIVITY_TYPES, CACHE_POLICIES } from '../../utils/constants.js';

export default function CacheConfigForm({ config, setConfig, onApply }) {
  return (
    <div className="card cache-config-card">
      <div className="card-header">
        <div className="card-title">
          <Sliders className="card-icon text-cyan" /> Cache Configuration & Architecture
        </div>
        <button className="btn btn-sm btn-cyan" onClick={onApply}>
          <RefreshCw className="btn-icon-sm" /> Apply Parameters
        </button>
      </div>

      <div className="config-grid">
        <div className="config-group">
          <label className="config-label">Cache Size (Bytes)</label>
          <select
            className="config-select"
            value={config.totalSize}
            onChange={(e) => setConfig({ ...config, totalSize: Number(e.target.value) })}
          >
            <option value={32}>32 Bytes</option>
            <option value={64}>64 Bytes</option>
            <option value={128}>128 Bytes</option>
            <option value={256}>256 Bytes</option>
          </select>
        </div>

        <div className="config-group">
          <label className="config-label">Block Size (Bytes)</label>
          <select
            className="config-select"
            value={config.blockSize}
            onChange={(e) => setConfig({ ...config, blockSize: Number(e.target.value) })}
          >
            <option value={2}>2 Bytes</option>
            <option value={4}>4 Bytes</option>
            <option value={8}>8 Bytes</option>
            <option value={16}>16 Bytes</option>
          </select>
        </div>

        <div className="config-group">
          <label className="config-label">Associativity</label>
          <select
            className="config-select"
            value={config.associativity}
            onChange={(e) => setConfig({ ...config, associativity: Number(e.target.value) })}
          >
            {Object.entries(ASSOCIATIVITY_TYPES).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="config-group">
          <label className="config-label">Replacement Policy</label>
          <select
            className="config-select"
            value={config.policy}
            onChange={(e) => setConfig({ ...config, policy: e.target.value })}
          >
            {Object.entries(CACHE_POLICIES).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
