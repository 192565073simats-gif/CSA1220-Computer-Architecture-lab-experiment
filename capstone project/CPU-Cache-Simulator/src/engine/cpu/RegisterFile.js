// CPU Register File representation
export class RegisterFile {
  constructor(size = 16) {
    this.size = size;
    this.registers = new Array(size).fill(0);
  }

  read(regIndex) {
    if (regIndex === null || regIndex === undefined || regIndex < 0 || regIndex >= this.size) {
      return 0;
    }
    if (regIndex === 0) return 0; // Hardwired R0 = 0
    return this.registers[regIndex];
  }

  write(regIndex, value) {
    if (regIndex === null || regIndex === undefined || regIndex <= 0 || regIndex >= this.size) {
      return; // R0 cannot be modified
    }
    this.registers[regIndex] = value;
  }

  reset() {
    this.registers.fill(0);
  }

  getValues() {
    return [...this.registers];
  }
}
