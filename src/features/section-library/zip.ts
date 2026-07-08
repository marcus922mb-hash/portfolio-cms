type ZipFile = {
  name: string;
  content: string;
};

function crc32(input: Uint8Array) {
  let crc = ~0;
  for (let i = 0; i < input.length; i += 1) {
    crc ^= input[i];
    for (let j = 0; j < 8; j += 1) {
      crc = (crc >>> 1) ^ (0xEDB88320 & -(crc & 1));
    }
  }
  return ~crc >>> 0;
}

function encodeUtf8(value: string) {
  return new TextEncoder().encode(value);
}

function u16(value: number) {
  const buffer = new Uint8Array(2);
  new DataView(buffer.buffer).setUint16(0, value, true);
  return buffer;
}

function u32(value: number) {
  const buffer = new Uint8Array(4);
  new DataView(buffer.buffer).setUint32(0, value >>> 0, true);
  return buffer;
}

function concat(parts: Uint8Array[]) {
  const total = parts.reduce((sum, part) => sum + part.length, 0);
  const result = new Uint8Array(total);
  let offset = 0;
  for (const part of parts) {
    result.set(part, offset);
    offset += part.length;
  }
  return result;
}

export function createZip(files: ZipFile[]) {
  const localParts: Uint8Array[] = [];
  const centralParts: Uint8Array[] = [];
  let offset = 0;

  for (const file of files) {
    const nameBytes = encodeUtf8(file.name);
    const contentBytes = encodeUtf8(file.content);
    const crc = crc32(contentBytes);

    const localHeader = concat([
      u32(0x04034b50),
      u16(20),
      u16(0),
      u16(0),
      u16(0),
      u16(0),
      u32(crc),
      u32(contentBytes.length),
      u32(contentBytes.length),
      u16(nameBytes.length),
      u16(0),
      nameBytes,
      contentBytes,
    ]);
    localParts.push(localHeader);

    const centralHeader = concat([
      u32(0x02014b50),
      u16(20),
      u16(20),
      u16(0),
      u16(0),
      u16(0),
      u16(0),
      u32(crc),
      u32(contentBytes.length),
      u32(contentBytes.length),
      u16(nameBytes.length),
      u16(0),
      u16(0),
      u16(0),
      u16(0),
      u32(0),
      u32(offset),
      nameBytes,
    ]);
    centralParts.push(centralHeader);
    offset += localHeader.length;
  }

  const centralDirectory = concat(centralParts);
  const endRecord = concat([
    u32(0x06054b50),
    u16(0),
    u16(0),
    u16(files.length),
    u16(files.length),
    u32(centralDirectory.length),
    u32(localParts.reduce((sum, part) => sum + part.length, 0)),
    u16(0),
  ]);

  return concat([...localParts, centralDirectory, endRecord]);
}

