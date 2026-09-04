export interface ICreateTariff {
  minUnit: number;
  maxUnit?: number;
  pricePerUnit: number;
  isActive?: boolean;
}

export interface IUpdateTariff {
  minUnit?: number;
  maxUnit?: number;
  pricePerUnit?: number;
  isActive?: boolean;
}