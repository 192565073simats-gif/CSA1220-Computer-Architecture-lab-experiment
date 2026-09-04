// Binary utilities for bitwise conversion and address breakdown

export function toHex(val, width = 4) {
  if (val === undefined || val === null) return '0x0000';
  const num = typeof val === 'string' ? parseInt(val, 16) || parseInt(val, 10) || 0 : val;
  const hex = Math.abs(num).toString(16).toUpperCase().padStart(width, '0');
  return `0x${hex}`;
}

export function toBinary(val, width = 16) {
  if (val === undefined || val === null) return '0'.repeat(width);
  const num = typeof val === 'string' ? parseInt(val, 16) || parseInt(val, 10) || 0 : val;
  return (num >>> 0).toString(2).padStart(width, '0').slice(-width);
}

export function parseRegisterName(regStr) {
  if (!regStr) return null;
  const cleaned = regStr.trim().toUpperCase().replace(',', '');
  if (cleaned.startsWith('R')) {
    const num = parseInt(cleaned.slice(1), 10);
    return isNaN(num) ? null : num;
  }
  if (cleaned === '$ZERO' || cleaned === 'R0') return 0;
  return null;
}

export function parseAddressInput(addrStr) {
  if (addrStr === undefined || addrStr === null || addrStr === '') return 0;
  const cleaned = addrStr.toString().trim();
  if (cleaned.toLowerCase().startsWith('0x')) {
    return parseInt(cleaned, 16) || 0;
  }
  return parseInt(cleaned, 10) || 0;
}
