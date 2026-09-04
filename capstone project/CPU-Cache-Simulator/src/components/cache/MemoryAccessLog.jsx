import React from 'react';
import { History, CheckCircle, XCircle } from 'lucide-react';

export default function MemoryAccessLog({ logs = [] }) {
  return (
    <div className="card access-log-card">
      <div className="card-header">
        <div className="card-title">
          <History className="card-icon text-purple" /> Recent Memory Access History Log
        </div>
      </div>

      <div className="log-table-wrapper">
        <table className="log-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Address (Hex)</th>
              <th>Tag</th>
              <th>Set</th>
              <th>Status</th>
              <th>Replaced Tag</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-gray-400 text-center italic py-4">
                  No memory access operations recorded yet.
                </td>
              </tr>
            ) : (
              logs.map((log, index) => (
                <tr key={index}>
                  <td>
                    <span
                      className={`badge ${
                        log.type === 'READ' ? 'badge-cyan' : 'badge-warning'
                      }`}
                    >
                      {log.type}
                    </span>
                  </td>
                  <td className="font-mono">{log.parsedAddr.hexAddress}</td>
                  <td className="font-mono">{log.parsedAddr.tag}</td>
                  <td>Set {log.setIndex}</td>
                  <td>
                    {log.status === 'HIT' ? (
                      <span className="badge badge-hit">
                        <CheckCircle className="badge-icon-sm" /> HIT
                      </span>
                    ) : (
                      <span className="badge badge-miss">
                        <XCircle className="badge-icon-sm" /> MISS
                      </span>
                    )}
                  </td>
                  <td className="font-mono text-rose">
                    {log.replacedTag !== null ? `Replaced Tag ${log.replacedTag}` : '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
