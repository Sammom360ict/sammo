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
  check_code?: string;
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

export interface IGetAPIAirlinesParams {
  api_id?: number;
  airline?: string;
  status?: boolean;
  api_status?: boolean;
}

export interface IInsertAPIAirlinesCommission {
  api_id: number;
  airline: string;
  com_domestic: number;
  com_international: number;
  com_type: 'PER' | 'FLAT';
  com_mode: 'INCREASE' | 'DECREASE';
}
export interface IUpdateAPIAirlinesCommission {
  api_id?: number;
  airline?: string;
  com_domestic?: number;
  com_international?: number;
  status?: boolean;
  com_type?: 'PER' | 'FLAT';
  com_mode?: 'INCREASE' | 'DECREASE';
}

export interface IInsertRoutesCommissionPayload {
  departure: string;
  arrival: string;
  commission: number;
  com_type: 'PER' | 'FLAT';
  com_mode: 'INCREASE' | 'DECREASE';
  one_way: boolean;
  round_trip: boolean;
}

export interface IUpdateRoutesCommissionPayload {
  departure?: string;
  arrival?: string;
  commission?: number;
  com_type?: 'PER' | 'FLAT';
  com_mode?: 'INCREASE' | 'DECREASE';
  one_way?: boolean;
  round_trip?: boolean;
  status?: boolean;
}

export interface IGetRoutesCommissionParams {
  departure?: string;
  arrival?: string;
  commission?: number;
  com_type?: 'PER' | 'FLAT';
  com_mode?: 'INCREASE' | 'DECREASE';
  one_way?: boolean;
  round_trip?: boolean;
  status?: boolean;
}
