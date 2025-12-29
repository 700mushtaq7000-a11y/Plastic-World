
export type UnitType = 'باله' | 'كونية' | 'كارتونة' | 'سيت' | 'درزن' | 'ربطة' | 'قطعة';

export interface Product {
  id: string;
  name: string;
  price: number;
  wholesalePrice: number;
  quantity: number;
  unitType: UnitType;
  image: string;
}

export interface CartItem extends Product {
  cartQuantity: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  items: CartItem[];
  total: number;
  date: string;
  status: 'جديد' | 'قيد التنفيذ' | 'مكتمل' | 'ملغي';
}
