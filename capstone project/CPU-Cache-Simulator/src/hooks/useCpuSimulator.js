import { useState, useRef, useEffect, useCallback } from 'react';
import { PipelineEngine } from '../engine/cpu/PipelineEngine.js';
import { parseAssemblyProgram } from '../engine/cpu/InstructionParser.js';

export function useCpuSimulator(initialCode, cacheEngine) {
  const [code, setCode] = useState(initialCode);
  const [pipelineState, setPipelineState] = useState(null);
  const [registers, setRegisters] = useState(new Array(16).fill(0));
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [isCompleted, setIsCompleted] = useState(false);
  const [lastHazard, setLastHazard] = useState(null);

  const engineRef = useRef(new PipelineEngine());
  const timerRef = useRef(null);

  const loadCode = useCallback(
    (programText) => {
      const parsed = parseAssemblyProgram(programText);
      engineRef.current.loadProgram(parsed);
      setPipelineState(engineRef.current.getCurrentStateSnapshot());
      setRegisters(engineRef.current.registerFile.getValues());
      setIsCompleted(false);
      setLastHazard(null);
    },
    []
  );

  useEffect(() => {
    loadCode(code);
  }, [code, loadCode]);

  const step = useCallback(() => {
    if (engineRef.current.isCompleted) {
      setIsCompleted(true);
      setIsRunning(false);
      return false;
    }

    const stepped = engineRef.current.step(cacheEngine);
    setPipelineState(engineRef.current.getCurrentStateSnapshot());
    setRegisters(engineRef.current.registerFile.getValues());
    setLastHazard(engineRef.current.lastHazard);

    if (engineRef.current.isCompleted) {
      setIsCompleted(true);
      setIsRunning(false);
    }
    return stepped;
  }, [cacheEngine]);

  const run = useCallback(() => {
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => {
    setIsRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  const reset = useCallback(() => {
    pause();
    engineRef.current.reset();
    loadCode(code);
  }, [code, loadCode, pause]);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        const canContinue = step();
        if (!canContinue) {
          setIsRunning(false);
          clearInterval(timerRef.current);
        }
      }, speed);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, speed, step]);

  return {
    code,
    setCode,
    pipelineState,
    registers,
    isRunning,
    speed,
    setSpeed,
    isCompleted,
    lastHazard,
    step,
    run,
    pause,
    reset,
    loadCode,
    pipelineEngine: engineRef.current,
  };
}
