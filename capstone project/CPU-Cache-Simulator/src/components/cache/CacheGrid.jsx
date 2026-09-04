import React from 'react';
import { Database, CheckCircle, XCircle } from 'lucide-react';
import { toHex } from '../../utils/binaryUtils.js';

export default function CacheGrid({ sets = [], policy = 'LRU', lastAccess }) {
  return (
    <div className="card cache-grid-card">
      <div className="card-header">
        <div className="card-title">
          <Database className="card-icon text-cyan" /> Cache Set & Line Grid View
        </div>
        <div className="policy-badge">Policy: {policy}</div>
      </div>

      <div className="cache-table-wrapper">
        <table className="cache-table">
          <thead>
            <tr>
              <th>Set #</th>
              <th>Line #</th>
              <th>Valid</th>
              <th>Dirty</th>
              <th>Tag (Hex)</th>
              <th>Data Block Bytes</th>
              <th>{policy === 'FIFO' ? 'Arrival Counter' : 'Last Access'}</th>
            </tr>
          </thead>
          <tbody>
            {sets.map((setLines, setIdx) => (
              <React.Fragment key={setIdx}>
                {setLines.length === 0 ? (
                  <tr className="empty-set-row">
                    <td className="set-cell font-bold text-amber">Set {setIdx}</td>
                    <td colSpan={6} className="text-gray-400 text-center italic">
                      Empty Set (No blocks cached)
                    </td>
                  </tr>
                ) : (
                  setLines.map((line, lineIdx) => {
                    const isHitLine =
                      lastAccess &&
                      lastAccess.setIndex === setIdx &&
                      lastAccess.lineIndex === lineIdx;
                    const isHit = isHitLine && lastAccess.status === 'HIT';
                    const isMiss = isHitLine && lastAccess.status === 'MISS';

                    return (
                      <tr
                        key={lineIdx}
                        className={`cache-row ${isHit ? 'row-hit' : ''} ${
                          isMiss ? 'row-miss' : ''
                        }`}
                      >
                        {lineIdx === 0 && (
                          <td
                            rowSpan={setLines.length}
                            className="set-cell font-bold text-cyan"
                          >
                            Set {setIdx}
                          </td>
                        )}
                        <td>Line {lineIdx}</td>
                        <td>
                          {line.valid ? (
                            <span className="badge badge-success">
                              <CheckCircle className="badge-icon-sm" /> 1
                            </span>
                          ) : (
                            <span className="badge badge-secondary">
                              <XCircle className="badge-icon-sm" /> 0
                            </span>
                          )}
                        </td>
                        <td>
                          {line.dirty ? (
                            <span className="badge badge-warning">1 (Dirty)</span>
                          ) : (
                            <span className="badge badge-dim">0</span>
                          )}
                        </td>
                        <td className="font-mono font-bold text-amber">
                          {line.valid ? toHex(line.tag, 3) : '-'}
                        </td>
                        <td>
                          <div className="data-block-cells">
                            {line.data.map((byteVal, bIdx) => (
                              <span key={bIdx} className="byte-chip">
                                {toHex(byteVal, 2)}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="font-mono text-purple">
                          {policy === 'FIFO' ? line.arrivalTime : line.lastAccessed}
                        </td>
                      </tr>
                    );
                  })
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
