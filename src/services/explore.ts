import { request } from '@/services/request.ts';
import { ResponseType, ListType } from '@/types/common.ts';
import {
  PairActivity,
  PairTVL,
  PairVolume,
  Recently,
  TokenPrice,
  TokenTrade,
  TokenTVL,
  TokenVolume,
} from '@/types/explore';
import { PoolType } from '@/types/pool';

export const getTokenTVLStatistics = async (params: {
  recently?: Recently;
}) => {
  return request
    .get<
      ResponseType<ListType<TokenTVL>>
    >('/lp/all/statistics', { params: { ...params, type: 0, pageNum: 1, pageSize: 100 } })
    .then((res) => res.data?.data);
};

export const getTokenVOLStatistics = async (params: {
  recently?: Recently;
}) => {
  return request
    .get<
      ResponseType<ListType<TokenVolume>>
    >('/lp/all/statistics', { params: { ...params, type: 1, pageNum: 1, pageSize: 100 } })
    .then((res) => res.data?.data);
};

export const getPairActivity = async (params: { address: string }) => {
  return request
    .get<
      ResponseType<ListType<PairActivity>>
    >('/pairs/liquidity/activity', { params })
    .then((res) => res.data?.data);
};

export const getTokenTradeList = async (params: {
  address: string;
  pageSize: number;
  pageNum: number;
}) => {
  return request
    .get<
      ResponseType<ListType<TokenTrade>>
    >('/tokens/swap/activity', { params })
    .then((res) => res.data?.data);
};

export const getPairTradeList = async (params: { address: string }) => {
  return request
    .get<ResponseType<ListType<TokenTrade>>>('/pairs/swap/activity', { params })
    .then((res) => res.data?.data);
};

export const getTokenTVL = async (params: {
  token: string;
  recently: Recently;
}) => {
  return request
    .get<ResponseType<ListType<TokenTVL>>>('/tokens/statistics/tvl', { params })
    .then((res) => res.data?.data);
};

export const getTokenVOL = async (params: {
  token: string;
  recently: Recently;
}) => {
  return request
    .get<
      ResponseType<ListType<TokenVolume>>
    >('/tokens/statistics/tvl', { params })
    .then((res) => res.data?.data);
};

export const getTokenPrice = async (params: {
  token: string;
  recently: Recently;
}) => {
  return request
    .get<
      ResponseType<ListType<TokenPrice>>
    >('/tokens/statistics/price', { params })
    .then((res) => res.data?.data);
};

export const getPairTVL = async (params: {
  token: string;
  recently: Recently;
}) => {
  return request
    .get<ResponseType<ListType<PairTVL>>>('/pairs/statistics/tvl', { params })
    .then((res) => res.data?.data);
};

export const getPairVOL = async (params: {
  token: string;
  recently: Recently;
}) => {
  return request
    .get<
      ResponseType<ListType<PairVolume>>
    >('/pairs/statistics/volume', { params })
    .then((res) => res.data?.data);
};
export const getTokenPairs = async (params: { token: string }) => {
  return request
    .get<ResponseType<ListType<PoolType>>>('/pairs/bytoken', { params })
    .then((res) => res.data?.data);
};

export const getPairTokens = async (params: { pairs: string }) => {
  return request
    .get<ResponseType<ListType<PoolType>>>('/tokens/bypair', { params })
    .then((res) => res.data?.data);
};
