import React from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

export default function DataHazardAlert({ hazard }) {
  if (!hazard || !hazard.hasHazard) return null;

  return (
    <div className="hazard-alert-banner">
      <div className="hazard-alert-content">
        <ShieldAlert className="hazard-icon" />
        <div>
          <h4 className="hazard-title">
            <AlertTriangle className="inline-icon" /> {hazard.type || 'PIPELINE DATA HAZARD'}
          </h4>
          <p className="hazard-desc">{hazard.reason}</p>
        </div>
      </div>
      <div className="hazard-badge">STALL BUBBLE INSERTED (+1 Cycle)</div>
    </div>
  );
}
