import React from 'react';
import { Activity, Percent, Clock, Zap, Calculator } from 'lucide-react';
import StatCard from '../common/StatCard.jsx';

export default function MetricsDashboard({ metrics }) {
  const hitRatioNum = parseFloat(metrics.hitRatio) || 0;
  const missRatioNum = parseFloat(metrics.missRatio) || 0;

  return (
    <div className="metrics-dashboard-container">
      <h2 className="dashboard-section-title">
        <Activity className="card-icon text-cyan" /> Architectural Performance Analytics & Metrics
      </h2>

      <div className="stat-cards-grid">
        <StatCard
          title="Cycles Per Instruction (CPI)"
          value={metrics.cpi}
          subtitle={`Total Cycles: ${metrics.totalCycles} | Stalls: ${metrics.stallsCount}`}
          icon={Zap}
          color="cyan"
        />
        <StatCard
          title="Cache Hit Ratio"
          value={metrics.hitRatio}
          subtitle={`Hits: ${metrics.hits} / ${metrics.totalAccesses} Accesses`}
          icon={Percent}
          color="emerald"
        />
        <StatCard
          title="Cache Miss Ratio"
          value={metrics.missRatio}
          subtitle={`Misses: ${metrics.misses} / ${metrics.totalAccesses} Accesses`}
          icon={Percent}
          color="rose"
        />
        <StatCard
          title="Avg Access Time (AMAT)"
          value={metrics.amat}
          subtitle="Hit Time (1 cycle) + Miss Rate × Penalty (10 cycles)"
          icon={Clock}
          color="purple"
        />
      </div>

      <div className="dashboard-charts-grid">
        {/* Hit vs Miss Progress Distribution */}
        <div className="card dashboard-card">
          <div className="card-header">
            <div className="card-title">
              <Percent className="card-icon text-emerald" /> Cache Hit vs. Miss Ratio Distribution
            </div>
          </div>
          <div className="ratio-bar-wrapper">
            <div className="ratio-bar-labels">
              <span className="text-emerald font-bold">Hit Ratio: {metrics.hitRatio}</span>
              <span className="text-rose font-bold">Miss Ratio: {metrics.missRatio}</span>
            </div>
            <div className="ratio-progress-bar">
              <div
                className="progress-fill fill-hit"
                style={{ width: `${hitRatioNum}%` }}
                title={`Hit: ${metrics.hitRatio}`}
              />
              <div
                className="progress-fill fill-miss"
                style={{ width: `${missRatioNum}%` }}
                title={`Miss: ${metrics.missRatio}`}
              />
            </div>
          </div>
        </div>

        {/* Formula Explanations */}
        <div className="card dashboard-card">
          <div className="card-header">
            <div className="card-title">
              <Calculator className="card-icon text-amber" /> Mathematical Formula Reference
            </div>
          </div>

          <div className="formula-list">
            <div className="formula-item">
              <span className="formula-name">CPI Equation:</span>
              <code>CPI = Total Execution Cycles / Executed Instructions</code>
            </div>
            <div className="formula-item">
              <span className="formula-name">Hit Ratio Equation:</span>
              <code>Hit Ratio = (Hits / Total Accesses) × 100%</code>
            </div>
            <div className="formula-item">
              <span className="formula-name">AMAT Equation:</span>
              <code>AMAT = Hit Time + (Miss Rate × Miss Penalty)</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
