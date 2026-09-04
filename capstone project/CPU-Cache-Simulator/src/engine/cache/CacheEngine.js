// Cache Memory Simulator Engine
import { AddressParser } from './AddressParser.js';
import { ReplacementAlgorithms } from './ReplacementAlgorithms.js';

export class CacheEngine {
  constructor(totalSize = 64, blockSize = 4, associativity = 2, policy = 'LRU') {
    this.reconfigure(totalSize, blockSize, associativity, policy);
  }

  reconfigure(totalSize = 64, blockSize = 4, associativity = 2, policy = 'LRU') {
    this.totalSize = totalSize;
    this.blockSize = blockSize;
    this.associativity = associativity; // 1 = Direct-Mapped, N = N-Way, TotalLines = Fully Associative
    this.policy = policy; // 'FIFO' or 'LRU'

    this.numLines = Math.floor(totalSize / blockSize);
    this.numSets = Math.max(1, Math.floor(this.numLines / associativity));

    this.hits = 0;
    this.misses = 0;
    this.accessCounter = 0;
    this.accessLogs = [];

    // Main Memory Mock (64KB memory map)
    this.mainMemory = new Array(1024).fill(0).map((_, i) => (i * 4) % 256);

    // Initialize Cache Sets
    // Each set is an array of cache lines up to associativity length
    this.sets = Array.from({ length: this.numSets }, () => []);
  }

  reset() {
    this.hits = 0;
    this.misses = 0;
    this.accessCounter = 0;
    this.accessLogs = [];
    this.sets = Array.from({ length: this.numSets }, () => []);
  }

  access(address, type = 'READ', writeData = null) {
    this.accessCounter++;
    const parsedAddr = AddressParser.parse(address, this.numSets, this.blockSize);
    const { tag, index, offset } = parsedAddr;

    const targetSet = this.sets[index];

    // Check HIT
    const lineIndex = targetSet.findIndex((line) => line.valid === 1 && line.tag === tag);
    let result = null;

    if (lineIndex !== -1) {
      // --- CACHE HIT ---
      this.hits++;
      const hitLine = targetSet[lineIndex];
      hitLine.lastAccessed = this.accessCounter; // Update LRU timestamp

      if (type === 'WRITE' && writeData !== null) {
        hitLine.data[offset] = writeData;
        hitLine.dirty = 1;
      }

      result = {
        type,
        status: 'HIT',
        address,
        parsedAddr,
        setIndex: index,
        lineIndex,
        data: hitLine.data[offset],
        replacedTag: null,
      };
    } else {
      // --- CACHE MISS ---
      this.misses++;

      // Simulate loading block from Main Memory
      const blockBaseAddress = address - offset;
      const loadedBlock = new Array(this.blockSize).fill(0).map((_, i) => {
        const memIdx = (blockBaseAddress + i) % this.mainMemory.length;
        return this.mainMemory[memIdx];
      });

      if (type === 'WRITE' && writeData !== null) {
        loadedBlock[offset] = writeData;
      }

      const newLine = {
        valid: 1,
        dirty: type === 'WRITE' ? 1 : 0,
        tag: tag,
        data: loadedBlock,
        arrivalTime: this.accessCounter,
        lastAccessed: this.accessCounter,
      };

      let victimIndex = -1;
      let replacedTag = null;

      if (targetSet.length < this.associativity) {
        // Set has available slot
        targetSet.push(newLine);
        victimIndex = targetSet.length - 1;
      } else {
        // Set is Full -> Eviction required
        victimIndex = ReplacementAlgorithms.selectVictim(targetSet, this.policy);
        replacedTag = targetSet[victimIndex].tag;
        targetSet[victimIndex] = newLine;
      }

      result = {
        type,
        status: 'MISS',
        address,
        parsedAddr,
        setIndex: index,
        lineIndex: victimIndex,
        data: newLine.data[offset],
        replacedTag,
      };
    }

    this.accessLogs.unshift(result);
    if (this.accessLogs.length > 50) this.accessLogs.pop(); // Keep last 50 logs

    return result;
  }
}
