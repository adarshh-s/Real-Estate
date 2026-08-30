const u = (id: string, w = 1600, h = 1067) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

export const exteriors = [
  '1512453979798-5ea266f8880c',
  '1518684079-3c830dcef090',
  '1546412414-8035e1776c9a',
  '1518005020951-eccb494ad742',
  '1522083165195-3424ed129620',
  '1613977257363-707ba9348227',
  '1600210492486-724fe5c67fb0',
].map((id) => u(id));

export const interiors = [
  '1600585154340-be6161a56a0c',
  '1600607687939-ce8a6c25118c',
  '1600596542815-ffad4c1539a9',
  '1600585152915-d208bec867a1',
  '1600566753086-00f18fb6b3ea',
  '1567767292278-a4f21aa2d36e',
  '1512918728675-ed5a9ecdebfd',
  '1524230572899-a752b3835840',
  '1580587771525-78b9dba3b914',
  '1502672260266-1c1ef2d93688',
  '1560448204-e02f11c3d0e2',
  '1554995207-c18c203602cb',
  '1571939228382-b2f2b585ce15',
  '1560184897-ae75f418493e',
  '1571508601891-ca5e7a713859',
  '1523217582562-09d0def993a6',
  '1615873968403-89e068629265',
  '1523192193543-6e7296d960e4',
  '1522798514-97ceb8c4f1c8',
  '1615529182904-14819c35db37',
  '1600047509807-ba8f99d2cdde',
  '1487958449943-2429e8be8625',
].map((id) => u(id));

export const portraits = [
  '1573497019940-1c28c88b4f3e',
  '1580489944761-15a19d654956',
  '1494790108377-be9c29b29330',
  '1500648767791-00dcc994a43e',
  '1519085360753-af0119f7cbe7',
  '1544005313-94ddf0286df2',
  '1531123897727-8f129e1688ce',
  '1560250097-0b93528c311a',
  '1552058544-f2b08422138a',
  '1508214751196-bcfd4ca60f91',
  '1472099645785-5658abf4ff4e',
  '1517841905240-472988babdf9',
].map((id) => u(id, 800, 1000));

export function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

export function gallery(seed: number, count = 6, cover?: string): string[] {
  const imgs: string[] = [cover ?? pick(exteriors, seed)];
  for (let i = 0; i < count - 1; i++) {
    imgs.push(pick(interiors, seed + i * 3 + 1));
  }
  return imgs;
}
