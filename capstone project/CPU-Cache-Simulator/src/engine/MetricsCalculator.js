// Performance Metrics Calculator Module
export class MetricsCalculator {
  static compute(pipelineEngine, cacheEngine, hitTime = 1, missPenalty = 10) {
    const totalAccesses = cacheEngine.hits + cacheEngine.misses;
    const hitRatioVal = totalAccesses > 0 ? (cacheEngine.hits / totalAccesses) * 100 : 0;
    const missRatioVal = totalAccesses > 0 ? (cacheEngine.misses / totalAccesses) * 100 : 0;
    const missRateDecimal = totalAccesses > 0 ? cacheEngine.misses / totalAccesses : 0;

    const amat = hitTime + missRateDecimal * missPenalty;

    const completedInsts = Math.max(1, pipelineEngine.executedInstructionsCount);
    const cpi = pipelineEngine.cycleCount / completedInsts;

    return {
      totalCycles: pipelineEngine.cycleCount,
      stallsCount: pipelineEngine.stallsCount,
      executedInsts: pipelineEngine.executedInstructionsCount,
      cpi: cpi.toFixed(2),
      hits: cacheEngine.hits,
      misses: cacheEngine.misses,
      totalAccesses,
      hitRatio: hitRatioVal.toFixed(1),
      missRatio: missRatioVal.toFixed(1),
      amat: amat.toFixed(2),
    };
  }
}
