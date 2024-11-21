import { Token } from '@/types/swap.ts';

export interface LendingAsset {
  id: string;
  token: Token;
  max_ltv: string;
  liq_penalty: string;
  max_lending_amount_inrim: string;
  best_lending_ratio: string;
  lending_mode_num: string;
  homogeneous_mode_ltv: string;
  best_deposit_interest_rate: string;
  depositAmount?: number;
  depositTotalPrice?: number;
  depositInterest?: number;
  lendingAmount?: number;
  lendingTotalPrice?: number;
  lendingInterest?: number;
  erc20TotalPrice?: number;
  erc20Balance?: number;
  availableAmount?: number;
  availableTotalPrice?: number;
  canCollateral?: boolean;
  canBorrow?: boolean;
  oraclePrice?: number;
  unitPrice?: number;
}

export interface LendingAssetInterest {
  date: string;
  deposit_interest: string;
  loan_interest: string;
  token: Token;
}

export interface EstimatedHealthFactor {
  healthFactor: string;
  borrowInterest: string;
  supplyInterest: string;
}
