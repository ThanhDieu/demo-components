import { QUERY_KEYS } from '@/common/queryKeys';
import { usePagination } from '@/hooks/usePagination';
import { useQueryCustom } from '@/hooks/useQueryCustom';
import { IGift } from '@/interfaces/mini-app/gift.interface';
import { ILuckyDraw } from '@/interfaces/mini-app/luckyDraw.interfaces';
import { luckyDrawService } from '@/services/mini-app/lucky-draw-config.api';
import { useMiniAppStore } from '@/stores/@miniApp/useMiniAppStore';
import { useZMPLuckyDrawStore } from '@/stores/@miniApp/useZMPLuckyDrawStore';

export const useLuckyDrawConfigListHook = () => {
  const { currentMiniApp } = useMiniAppStore();
  const pagination = usePagination<ILuckyDraw>();
  const { isLoading, data, isFetching, refetch } = useQueryCustom<ILuckyDraw[]>(
    [QUERY_KEYS.GET_LIST_MINIAPP, currentMiniApp?.id],
    async () => {
      const params = {
        miniappId: currentMiniApp?.id,
        page: pagination.currentPage || 1,
        size: pagination.pageSize || 10,
      };
      return luckyDrawService.getLuckyDrawList(params);
    },
    {
      onSuccess: (res) => {
        pagination.setApiData(res?.data);
        pagination.setTotalEvents(res?.meta?.total || 0);
      },
      onError: (err) => {
        console.log(err.message);
      },
      enabled: !!currentMiniApp?.id,
    },
  );

  return {
    list: data?.data,
    isLoading,
    pagination,
    isFetching,
    refetch,
  };
};
export const useLuckyDrawGiftListHook = () => {
  const { currentMiniApp } = useMiniAppStore();
  const { isLoading, data } = useQueryCustom<IGift[]>(
    [QUERY_KEYS.GET_LIST_MINIAPP, currentMiniApp?.id],
    async () => {
      const params = {
        miniappId: currentMiniApp?.id, // TODO
        page: 1,
        size: 99,
      };
      return luckyDrawService.getLuckyDrawGiftList(params);
    },
    {
      onError: (err) => {
        console.log(err.message);
      },
      enabled: !!currentMiniApp?.id,
    },
  );
  return {
    list: (data?.data || [])?.map((item) => ({
      ...item,
      value: item?.id,
      label: item?.name,
    })),
    isLoading,
  };
};
export const useLuckyDrawGiftDetailHook = (id?: string) => {
  if (!id)
    return {
      detail: undefined,
      isLoading: false,
    };
  const { setCurrentZMPLuckyDraw } = useZMPLuckyDrawStore();

  const { isLoading, data } = useQueryCustom<ILuckyDraw>(
    [QUERY_KEYS.GET_LIST_MINIAPP, id],
    async () => {
      return luckyDrawService.getLuckyDrawById(id);
    },
    {
      onSuccess(data) {
        setCurrentZMPLuckyDraw(data?.data);
      },
      onError: (err) => {
        console.log(err.message);
      },
      enabled: !!id,
    },
  );
  return {
    detail: data?.data,
    isLoading,
  };
};
