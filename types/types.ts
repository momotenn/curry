import { type } from "os";

export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  zipcode: string;
  address: string;
  telephone: string;
  logined: boolean;
};

export type Order = {
  id: number;
  userid: number;
  totalPrice: number;
  orderDate: Date;
  distinationName: string;
  distinationEmail: string;
  distinationZipcode: string;
  distinationAddress: string;
  distinationTel: string;
  deliveryTime: Date;
  paymentMethod: number;
  user: User;
//   orderItemList: ;
};

export type OrderItem = {
  id: number;
  itemId: number;
  orderId: number;
  quantity: number;
  size: string;
  item: Item;
//   orderToppingList: ;
};

export type Item = {
  id: number;
  type: string;
  name: string;
  description: string;
  price: number;
  imagePath: string;
  delete: boolean;
//   toppingList: ?;
};


export type Topping={
    id:number,
    type:string,
    name:string,
    price: number
}

export type OrderTopping={
    id:number,
    toppingId:number,
    orderItemId:number,
    topping:Topping,
}
