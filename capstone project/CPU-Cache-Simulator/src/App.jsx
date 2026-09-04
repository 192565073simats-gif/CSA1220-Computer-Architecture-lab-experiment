import React, { useState } from 'react';
import Header from './components/common/Header.jsx';
import ControlPanel from './components/common/ControlPanel.jsx';
import InstructionInput from './components/cpu/InstructionInput.jsx';
import PipelineView from './components/cpu/PipelineView.jsx';
import DataHazardAlert from './components/cpu/DataHazardAlert.jsx';
import RegisterFileView from './components/cpu/RegisterFileView.jsx';
import CacheConfigForm from './components/cache/CacheConfigForm.jsx';
import AddressDecoder from './components/cache/AddressDecoder.jsx';
import CacheGrid from './components/cache/CacheGrid.jsx';
import MemoryAccessLog from './components/cache/MemoryAccessLog.jsx';
import MetricsDashboard from './components/dashboard/MetricsDashboard.jsx';

import { useCpuSimulator } from './hooks/useCpuSimulator.js';
import { useCacheSimulator } from './hooks/useCacheSimulator.js';
import { MetricsCalculator } from './engine/MetricsCalculator.js';
import { SAMPLE_PROGRAMS } from './utils/constants.js';
import './App.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('unified');
  const [selectedSample, setSelectedSample] = useState(SAMPLE_PROGRAMS[0].id);

  // Initialize Cache Simulator
  const cacheSim = useCacheSimulator({
    totalSize: 64,
    blockSize: 4,
    associativity: 2,
    policy: 'LRU',
  });

  // Initialize CPU Simulator with current sample code & Cache engine
  const currentSampleObj = SAMPLE_PROGRAMS.find((s) => s.id === selectedSample) || SAMPLE_PROGRAMS[0];
  const cpuSim = useCpuSimulator(currentSampleObj.code, cacheSim.cacheEngine);

  const handleSelectSample = (sampleId) => {
    setSelectedSample(sampleId);
    const targetSample = SAMPLE_PROGRAMS.find((s) => s.id === sampleId);
    if (targetSample) {
      cpuSim.setCode(targetSample.code);
      cpuSim.loadCode(targetSample.code);
      cacheSim.reset();
    }
  };

  const handleReset = () => {
    cpuSim.reset();
    cacheSim.reset();
  };

  // Compute live architectural performance metrics
  const metrics = MetricsCalculator.compute(cpuSim.pipelineEngine, cacheSim.cacheEngine);

  return (
    <div className="app-container">
      {/* Header with Navigation */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Global Controls Panel */}
      <ControlPanel
        isRunning={cpuSim.isRunning}
        onRun={cpuSim.run}
        onPause={cpuSim.pause}
        onStep={cpuSim.step}
        onReset={handleReset}
        speed={cpuSim.speed}
        setSpeed={cpuSim.setSpeed}
        selectedSample={selectedSample}
        onSelectSample={handleSelectSample}
        isCompleted={cpuSim.isCompleted}
      />

      {/* Hazard Notification Banner */}
      <DataHazardAlert hazard={cpuSim.lastHazard} />

      {/* UNIFIED VIEW */}
      {activeTab === 'unified' && (
        <div className="flex flex-col gap-6">
          <div className="grid-2col">
            <InstructionInput
              code={cpuSim.code}
              setCode={cpuSim.setCode}
              onCompile={() => cpuSim.loadCode(cpuSim.code)}
              activeSample={currentSampleObj}
            />
            <RegisterFileView registers={cpuSim.registers} />
          </div>

          <PipelineView pipelineState={cpuSim.pipelineState} hazardInfo={cpuSim.lastHazard} />

          <div className="grid-2col">
            <AddressDecoder
              numSets={cacheSim.cacheEngine.numSets}
              blockSize={cacheSim.cacheEngine.blockSize}
              onAccessAddress={cacheSim.accessAddress}
            />
            <CacheConfigForm
              config={cacheSim.config}
              setConfig={cacheSim.setConfig}
              onApply={() => cacheSim.reconfigure(cacheSim.config)}
            />
          </div>

          <CacheGrid
            sets={cacheSim.cacheSets}
            policy={cacheSim.config.policy}
            lastAccess={cacheSim.lastAccess}
          />
        </div>
      )}

      {/* CPU PIPELINE TAB */}
      {activeTab === 'pipeline' && (
        <div className="flex flex-col gap-6">
          <div className="grid-2col">
            <InstructionInput
              code={cpuSim.code}
              setCode={cpuSim.setCode}
              onCompile={() => cpuSim.loadCode(cpuSim.code)}
              activeSample={currentSampleObj}
            />
            <RegisterFileView registers={cpuSim.registers} />
          </div>
          <PipelineView pipelineState={cpuSim.pipelineState} hazardInfo={cpuSim.lastHazard} />
        </div>
      )}

      {/* CACHE MEMORY TAB */}
      {activeTab === 'cache' && (
        <div className="flex flex-col gap-6">
          <CacheConfigForm
            config={cacheSim.config}
            setConfig={cacheSim.setConfig}
            onApply={() => cacheSim.reconfigure(cacheSim.config)}
          />
          <AddressDecoder
            numSets={cacheSim.cacheEngine.numSets}
            blockSize={cacheSim.cacheEngine.blockSize}
            onAccessAddress={cacheSim.accessAddress}
          />
          <CacheGrid
            sets={cacheSim.cacheSets}
            policy={cacheSim.config.policy}
            lastAccess={cacheSim.lastAccess}
          />
          <MemoryAccessLog logs={cacheSim.accessLogs} />
        </div>
      )}

      {/* DASHBOARD TAB */}
      {activeTab === 'dashboard' && <MetricsDashboard metrics={metrics} />}
    </div>
  );
}
