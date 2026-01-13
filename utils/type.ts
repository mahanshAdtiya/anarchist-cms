export interface Category {
  id: string;
  name: string;
  billboard: {
    label: string;
  };
  createdAt: string;
}

  
export interface BillBoard{
  id: string;
  label: string;
  imageUrl: string;
  createdAt: string;
}

export interface Image{
  id: string;
  url: string;
}
export interface Color{
  id: string;
  name: string;
  value: string;
  createdAt: string;
}

export interface Size{
  id: string;
  name: string;
  value: string;
  createdAt: string;
}

export interface Product{
  id: string;
  name: string;
  price: string;
  stock: number;
  description: string;
  isFeatured: boolean;
  isArchived: boolean;
  category: {
    id: string;
    name: string
  }
  sizes: {
    size: Size; 
  }[];
  images: Image[];
  color: {
    id: string;

    name: string;
    value: string;
  }
  createdAt: string;
}

export interface GetProductsDto{
  categoryId: string;
  colorId: string;
  sizeIds: string;
  isFeatured: boolean;
  isArchived: boolean
}

export interface Order {
  id: string;

  userId?: string | null;
  user?: User;

  guestEmail?: string | null;
  guestPhone?: string | null;

  status: "PENDING" | "SHIPPED" | "DELIVERED" | "CANCELED";
  shippingAddress: Record<string, any>;
  billingAddress: Record<string, any>;
  isShippingSameAsBilling: boolean;

  price: string; 
  
  orderItems: OrderItem[];
  isPaid: boolean;

  createdAt: Date; 
  updatedAt: string;
}

export interface OrderItem {
  id: string;

  orderId: string;
  order: Order;

  productId: string;
  product: Product;

  createdAt: string; 
  updatedAt: string;
}
export interface User {
  id: string;

  name: string;
  email: string;
  phoneNumber?: string;

  type: "CUSTOMER" | "ADMIN" ;

  isMember: boolean;
  
  authentications: Authentication[];
  orders: Order[];
  
  createdAt: Date;
  updatedAt: Date;

}

export interface Authentication {
  id: string;

  userId: string;
  credential: string;

  createdAt: Date;
  updatedAt: Date;
}