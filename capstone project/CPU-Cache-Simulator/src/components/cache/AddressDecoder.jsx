import React, { useState } from 'react';
import { Binary, ArrowDown, Send } from 'lucide-react';
import { AddressParser } from '../../engine/cache/AddressParser.js';

export default function AddressDecoder({ numSets, blockSize, onAccessAddress }) {
  const [inputAddr, setInputAddr] = useState('0x001C');
  const [accessType, setAccessType] = useState('READ');
  const [writeData, setWriteData] = useState(42);

  const parsed = AddressParser.parse(inputAddr, numSets, blockSize);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAccessAddress(inputAddr, accessType, writeData);
  };

  return (
    <div className="card address-decoder-card">
      <div className="card-header">
        <div className="card-title">
          <Binary className="card-icon text-cyan" /> 16-Bit Memory Address Decoder & Access Tester
        </div>
      </div>

      <form onSubmit={handleSubmit} className="address-input-bar">
        <div className="input-group">
          <label className="input-label">Memory Address (Hex/Dec)</label>
          <input
            type="text"
            className="input-field"
            value={inputAddr}
            onChange={(e) => setInputAddr(e.target.value)}
            placeholder="0x001C or 28"
          />
        </div>

        <div className="input-group">
          <label className="input-label">Access Type</label>
          <select
            className="input-field"
            value={accessType}
            onChange={(e) => setAccessType(e.target.value)}
          >
            <option value="READ">Memory READ (LW)</option>
            <option value="WRITE">Memory WRITE (SW)</option>
          </select>
        </div>

        {accessType === 'WRITE' && (
          <div className="input-group">
            <label className="input-label">Data Value</label>
            <input
              type="number"
              className="input-field"
              value={writeData}
              onChange={(e) => setWriteData(Number(e.target.value))}
            />
          </div>
        )}

        <button type="submit" className="btn btn-emerald submit-access-btn">
          <Send className="btn-icon-sm" /> Execute Memory Access
        </button>
      </form>

      <div className="address-breakdown-wrapper">
        <div className="binary-strip-header">
          <span>Binary Bit Partitioning: {parsed.hexAddress}</span>
        </div>

        <div className="binary-partition-grid">
          {/* TAG BITS */}
          <div className="bit-box bit-box-tag">
            <div className="bit-box-header">Tag ({parsed.tagBits} bits)</div>
            <div className="bit-binary-str">{parsed.tagBin}</div>
            <div className="bit-decimal-val">Value: {parsed.tag}</div>
          </div>

          {/* INDEX BITS */}
          <div className="bit-box bit-box-index">
            <div className="bit-box-header">Index ({parsed.indexBits} bits)</div>
            <div className="bit-binary-str">{parsed.indexBin}</div>
            <div className="bit-decimal-val">Set: {parsed.index}</div>
          </div>

          {/* OFFSET BITS */}
          <div className="bit-box bit-box-offset">
            <div className="bit-box-header">Offset ({parsed.offsetBits} bits)</div>
            <div className="bit-binary-str">{parsed.offsetBin}</div>
            <div className="bit-decimal-val">Byte: {parsed.offset}</div>
          </div>
        </div>

        <div className="decoder-explanation">
          <ArrowDown className="inline-icon text-cyan" /> Maps to Cache <strong>Set {parsed.index}</strong> with <strong>Tag {parsed.tag}</strong> at block offset <strong>{parsed.offset}</strong>.
        </div>
      </div>
    </div>
  );
}
