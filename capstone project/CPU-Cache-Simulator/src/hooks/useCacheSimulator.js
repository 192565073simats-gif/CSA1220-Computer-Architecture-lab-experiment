import { useState, useRef, useCallback } from 'react';
import { CacheEngine } from '../engine/cache/CacheEngine.js';

export function useCacheSimulator(
  initialConfig = { totalSize: 64, blockSize: 4, associativity: 2, policy: 'LRU' }
) {
  const [config, setConfig] = useState(initialConfig);
  const engineRef = useRef(
    new CacheEngine(
      initialConfig.totalSize,
      initialConfig.blockSize,
      initialConfig.associativity,
      initialConfig.policy
    )
  );

  const [cacheSets, setCacheSets] = useState([...engineRef.current.sets]);
  const [accessLogs, setAccessLogs] = useState([]);
  const [lastAccess, setLastAccess] = useState(null);

  const updateState = useCallback(() => {
    setCacheSets(engineRef.current.sets.map((set) => [...set]));
    setAccessLogs([...engineRef.current.accessLogs]);
  }, []);

  const reconfigure = useCallback((newConfig) => {
    setConfig(newConfig);
    engineRef.current.reconfigure(
      newConfig.totalSize,
      newConfig.blockSize,
      newConfig.associativity,
      newConfig.policy
    );
    setCacheSets(engineRef.current.sets.map((set) => [...set]));
    setAccessLogs([]);
    setLastAccess(null);
  }, []);

  const accessAddress = useCallback(
    (address, type = 'READ', writeData = null) => {
      const res = engineRef.current.access(address, type, writeData);
      setLastAccess(res);
      updateState();
      return res;
    },
    [updateState]
  );

  const reset = useCallback(() => {
    engineRef.current.reset();
    setCacheSets(engineRef.current.sets.map((set) => [...set]));
    setAccessLogs([]);
    setLastAccess(null);
  }, []);

  return {
    config,
    setConfig,
    reconfigure,
    cacheSets,
    accessLogs,
    lastAccess,
    accessAddress,
    reset,
    cacheEngine: engineRef.current,
  };
}
