// Constants for CPU and Cache Simulation

export const DEFAULT_REGISTERS = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  name: `R${i}`,
  value: 0,
}));

export const SAMPLE_PROGRAMS = [
  {
    id: 'simple-r-type',
    name: '1. Basic Arithmetic (No Hazards)',
    description: 'Calculates R1 = R2 + R3, R4 = R5 - R6, R7 = R8 + R9',
    code: `// Initial setup
ADD R2, R0, 10
ADD R3, R0, 25
ADD R5, R0, 100
ADD R6, R0, 45
// Execution
ADD R1, R2, R3
SUB R4, R5, R6
AND R7, R2, R5`,
  },
  {
    id: 'data-hazard',
    name: '2. RAW Data Hazard & Stall Insertion',
    description: 'Demonstrates Read-After-Write dependence requiring stall cycles',
    code: `// Load word followed immediately by dependent instruction
LW R1, 4(R0)
ADD R3, R1, R2
SUB R5, R1, R3`,
  },
  {
    id: 'cache-locality',
    name: '3. Memory Access & Cache Locality',
    description: 'Executes LW and SW instructions to test Cache Hits, Misses & Eviction',
    code: `// Memory Read and Write Operations
ADD R1, R0, 0x0004
LW R2, 0(R1)
LW R3, 4(R1)
LW R4, 0(R1)   // Cache Hit expected
SW R2, 8(R1)   // Write operation
LW R5, 12(R1)  // Cache Miss & Eviction test`,
  },
];

export const CACHE_POLICIES = {
  FIFO: 'FIFO (First In, First Out)',
  LRU: 'LRU (Least Recently Used)',
};

export const ASSOCIATIVITY_TYPES = {
  1: 'Direct Mapped (1-Way)',
  2: '2-Way Set Associative',
  4: '4-Way Set Associative',
  8: '8-Way Set Associative',
};
