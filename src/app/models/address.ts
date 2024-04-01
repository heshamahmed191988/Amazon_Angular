export interface Address {
    id?: number;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  userID: string;
  orderIds?: number[];
}
