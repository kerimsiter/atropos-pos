export interface Table {
  id: string;
  number: string;
  capacity: number;
  areaId: string;
  branchId: string;
  positionX?: number;
  positionY?: number;
  status: 'EMPTY' | 'OCCUPIED' | 'RESERVED' | 'CLEANING' | 'UNAVAILABLE' | 'MERGED';
  // Latest active order (server returns orders: take:1)
  orders?: Array<{
    id: string;
    status: string;
    tableId?: string;
    orderNumber?: string;
  }>;
}

