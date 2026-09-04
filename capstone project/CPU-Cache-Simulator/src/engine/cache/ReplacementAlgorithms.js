// Replacement algorithms implementation (FIFO and LRU)
export class ReplacementAlgorithms {
  static selectVictim(targetSet, policy) {
    if (!targetSet || targetSet.length === 0) return 0;

    if (policy === 'FIFO') {
      // Find block with minimum arrival time
      let victimIdx = 0;
      let minArrival = targetSet[0].arrivalTime;

      for (let i = 1; i < targetSet.length; i++) {
        if (targetSet[i].arrivalTime < minArrival) {
          minArrival = targetSet[i].arrivalTime;
          victimIdx = i;
        }
      }
      return victimIdx;
    } else {
      // Default: LRU (Find block with minimum lastAccessed timestamp)
      let victimIdx = 0;
      let minAccess = targetSet[0].lastAccessed;

      for (let i = 1; i < targetSet.length; i++) {
        if (targetSet[i].lastAccessed < minAccess) {
          minAccess = targetSet[i].lastAccessed;
          victimIdx = i;
        }
      }
      return victimIdx;
    }
  }
}
