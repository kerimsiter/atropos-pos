export interface Table {
  id: string;
  number: string;
  capacity: number;
  areaId: string;
  branchId: string;
  positionX?: number;
  positionY?: number;
  status: 'EMPTY' | 'OCCUPIED' | 'RESERVED' | 'CLEANING' | 'UNAVAILABLE' | 'MERGED';
}

