// Address bit decomposition logic (Tag, Index, Offset)
export class AddressParser {
  static parse(address, numSets, blockSize) {
    const addr = typeof address === 'string' ? parseInt(address, 16) || parseInt(address, 10) || 0 : address;

    const offsetBits = Math.log2(blockSize);
    const indexBits = Math.log2(numSets);
    const tagBits = 16 - (offsetBits + indexBits);

    const offsetMask = (1 << offsetBits) - 1;
    const indexMask = (1 << indexBits) - 1;

    const offset = addr & offsetMask;
    const index = (addr >> offsetBits) & indexMask;
    const tag = addr >> (offsetBits + indexBits);

    const binaryString = (addr >>> 0).toString(2).padStart(16, '0');
    const tagBin = binaryString.slice(0, tagBits);
    const indexBin = binaryString.slice(tagBits, tagBits + indexBits);
    const offsetBin = binaryString.slice(tagBits + indexBits);

    return {
      rawAddress: addr,
      hexAddress: `0x${addr.toString(16).toUpperCase().padStart(4, '0')}`,
      tag,
      index,
      offset,
      tagBin,
      indexBin,
      offsetBin,
      tagBits,
      indexBits,
      offsetBits,
    };
  }
}
