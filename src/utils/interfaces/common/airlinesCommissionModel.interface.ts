export interface IInsertAirlinesCommissionPayload {
  airline_code: string;
  capping?: 0 | 1;
  soto_commission: number;
  from_dac_commission: number;
  to_dac_commission: number;
  soto_allowed: 0 | 1;
  updated_by: number;
  domestic_commission?: number;
}

export interface IGetAirlinesCommissionQuery {
  code?: string;
  last_update?: string;
  limit?: string;
  skip?: string;
  check_code?:string;
  name?: string;
}

export interface IUpdateAirlinesCommissionPayload {
  capping?: 0 | 1;
  soto_commission?: number;
  from_dac_commission?: number;
  to_dac_commission?: number;
  soto_allowed?: 0 | 1;
  last_updated?: string;
  updated_by?: number;
  domestic_commission?: number;
}
