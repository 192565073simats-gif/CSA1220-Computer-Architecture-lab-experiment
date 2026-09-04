import React from 'react';
import { Play, Pause, SkipForward, RotateCcw, Zap, BookOpen } from 'lucide-react';
import { SAMPLE_PROGRAMS } from '../../utils/constants.js';

export default function ControlPanel({
  isRunning,
  onRun,
  onPause,
  onStep,
  onReset,
  speed,
  setSpeed,
  selectedSample,
  onSelectSample,
  isCompleted,
}) {
  return (
    <div className="control-panel-card">
      <div className="controls-left">
        <div className="sample-selector-wrapper">
          <BookOpen className="control-icon-label" />
          <select
            className="sample-select"
            value={selectedSample}
            onChange={(e) => onSelectSample(e.target.value)}
          >
            {SAMPLE_PROGRAMS.map((sample) => (
              <option key={sample.id} value={sample.id}>
                {sample.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="controls-center">
        {isRunning ? (
          <button className="btn btn-warning" onClick={onPause}>
            <Pause className="btn-icon" /> Pause
          </button>
        ) : (
          <button className="btn btn-primary" onClick={onRun} disabled={isCompleted}>
            <Play className="btn-icon" /> Run Simulation
          </button>
        )}

        <button className="btn btn-secondary" onClick={onStep} disabled={isRunning || isCompleted}>
          <SkipForward className="btn-icon" /> Step Stage
        </button>

        <button className="btn btn-danger" onClick={onReset}>
          <RotateCcw className="btn-icon" /> Reset
        </button>
      </div>

      <div className="controls-right">
        <div className="speed-slider-wrapper">
          <Zap className="speed-icon" />
          <span className="speed-label">Speed: {speed}ms</span>
          <input
            type="range"
            min="200"
            max="2000"
            step="100"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="speed-range"
          />
        </div>
      </div>
    </div>
  );
}
