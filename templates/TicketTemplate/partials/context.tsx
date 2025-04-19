import { EEventType, ETaskStatusByUserAction } from '@/common/enums';
import { QUERY_KEYS } from '@/common/queryKeys';
import { useSearchColumn } from '@/components/molecules';
import { useBreadcrumb } from '@/components/organisms/partials/Breadcrumb/context';
import { useMutationCustom } from '@/hooks/useMutationCustom';
import { Pagination, usePagination } from '@/hooks/usePagination';
import { useQueryCustom } from '@/hooks/useQueryCustom';
import { IActionTicket, IActionTicketComment, ITicket } from '@/interfaces/task.interfaces';
import { ROUTES_FE } from '@/routers';
import { myTaskService } from '@/services/task.api';
import StringUtils from '@/utils/StringUtils';
import { AnyObject } from 'antd/es/_util/type';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

interface TicketsContextType {
  ticketPage: Pagination<ITicket> & {
    refetch: any;
    isLoading: boolean;
    isFetching: boolean;
    showSearch?: any;
  };
  selectedDetail?: ITicket;
  onSelectedDetail: (value?: ITicket) => void;
  openModal?: EEventType;
  onOpenModal: (value?: EEventType) => void;
  isActionLoading?: boolean;
  onActionTicket?: (id?: string, params?: IActionTicket, type?: EEventType) => void;
  onActionTicketComment?: (id?: string, params?: IActionTicketComment, type?: EEventType) => void;
  paramsQuery?: AnyObject;
}

const TicketsContext = createContext<TicketsContextType | undefined>(undefined);

interface TicketsProviderProps {
  children: ReactNode;
  type: 'list' | 'detail';
  idDetail?: string;
}

export const TicketsProvider = ({ children, type, idDetail }: TicketsProviderProps) => {
  const t = useTranslations();
  const router = useRouter();
  const { data: session } = useSession();
  const paginationPage = usePagination<ITicket>();
  const {
    pageSize,
    totalEvents: total,
    setTotalEvents: setTotal,
    currentPage,
    apiData: listTicket,
    setApiData: setListTicket,
    onRefresh,
    filter,
  } = paginationPage;
  const [selectedDetail, setSelectedDetail] = useState<ITicket>();
  const [openModal, setOpenModal] = useState<EEventType>();
  const searchParams = useSearchParams();
  const paramsQuery = {
    conversationId: searchParams.get('conversationId'),
    message: searchParams.get('message'),
    messageId: searchParams.get('messageId'),
    zaloOAId: searchParams.get('zaloOAId'),
  };
  const { searchRequest, getColumnSearchPropsByInput } = useSearchColumn({
    refetch: () => onRefresh(refetch),
  });

  const { isLoading, refetch, isFetching } = useQueryCustom<ITicket[]>(
    [QUERY_KEYS.GET_LIST_STICKET, type],
    async () => {
      const listParam: AnyObject = {
        page: currentPage || 1,
        size: pageSize || 10,
        orderBy: filter?.orderBy || 'createdAt=desc',
      };
      if (searchRequest) listParam.title = searchRequest;
      if (selectedDetail?.id && type === 'detail') listParam.ticketId = selectedDetail.id;
      return type === 'detail'
        ? myTaskService.getTicketCommentList({
            ...listParam,
            size: 99,
          })
        : type === 'list'
        ? myTaskService.getTicketList(listParam)
        : null;
    },
    {
      onSuccess: (res) => {
        setListTicket(res?.data);
        setTotal(res.meta?.total || 0);
      },
      onError: (err) => {
        toast.error(err.message);
      },
      enabled: (selectedDetail?.id && type === 'detail') || type === 'list',
    },
  );

  const { isLoading: loadingDetail, isFetching: isFetchingDetail } = useQueryCustom<ITicket>(
    [QUERY_KEYS.GET_LIST_STICKET, idDetail],
    async () => !!idDetail && myTaskService.getTicketById(idDetail),
    {
      onSuccess(res) {
        onSelectedDetail(res.data);
        if (
          res?.data?.statusViewAssignee === ETaskStatusByUserAction.new &&
          res.data?.assignee?.id === session?.user?.id
        ) {
          handleActionTicket(
            res?.data?.id,
            { statusViewAssignee: ETaskStatusByUserAction.viewed } as any,
            EEventType.UPDATE,
          );
        }
      },
      onError: (error: any) => {
        toast.error(error.message);
      },
      enabled: !!idDetail && type === 'detail',
    },
  );

  //<=== start action ticket ===>
  const actionTicketMutation = useMutationCustom<
    ITicket,
    { id?: string; params?: IActionTicket; type?: EEventType }
  >(
    async ({ id, params, type }: { id?: string; params?: IActionTicket; type?: EEventType }) => {
      return myTaskService.actionTicket(id, params, type);
    },
    {
      onSuccess: (res) => {
        openModal &&
          type === 'list' &&
          toast.success(
            t('NOTI.ACTION_SUCCESS', {
              action: openModal
                ? StringUtils.capitalize(t(('GENERAL.' + openModal.toUpperCase()) as any))
                : '',
            }),
          );
        if (openModal !== EEventType.DELETE) {
          setSelectedDetail(res?.data);
        } else {
          setSelectedDetail(undefined);
        }
        setOpenModal(undefined);
        if (type === 'list') {
          refetch();
        }
      },
      onError: (err: any) => {
        toast.error(err.message);
      },
    },
  );

  const handleActionTicket = (id?: string, formData?: IActionTicket, type?: EEventType) => {
    const params =
      type === EEventType.UPDATE
        ? formData
        : {
            title: formData?.title || '',
            assigneeId: formData?.assigneeId || '',
            content: formData?.content || '',
            conversationId:
              paramsQuery?.conversationId || selectedDetail?.conversationId || undefined,
            messageId: paramsQuery?.messageId || selectedDetail?.messageId || undefined,
            zaloOAId: paramsQuery?.zaloOAId || selectedDetail?.zaloOAId || undefined,
            attachments: formData?.attachments || [],
            status: formData?.status,
            priority: formData?.priority,
          };
    actionTicketMutation.mutate({
      id,
      params,
      type,
    });
  };
  //<=== end action ticket ===>

  //<=== start action ticket comment ===>
  const actionTicketCommentMutation = useMutationCustom<
    ITicket,
    { id?: string; params?: IActionTicketComment; type?: EEventType }
  >(
    async ({
      id,
      params,
      type,
    }: {
      id?: string;
      params?: IActionTicketComment;
      type?: EEventType;
    }) => {
      return myTaskService.actionTicketComment(id, params, type);
    },
    {
      onSuccess: () => {
        setOpenModal(undefined);
        refetch();
      },
      onError: (err: any) => {
        toast.error(err.message);
      },
    },
  );

  const handleActionTicketComment = async (
    id?: string,
    params?: IActionTicketComment,
    type?: EEventType,
  ) => {
    await actionTicketCommentMutation.mutate({
      id,
      params,
      type,
    });
  };
  //<=== end action ticket ===>

  const onSelectedDetail = (value?: ITicket) => {
    setSelectedDetail(value);
  };

  const handleOnpenModal = (value?: EEventType) => {
    setOpenModal(value);
    if (type === 'list') {
      router.push(ROUTES_FE.TENANT.TICKET.ROOT);
    }
  };

  //Breadcrumb
  const { setTitle } = useBreadcrumb();
  useEffect(() => {
    if (idDetail) setTitle(t('TENANT.DETAIL'));

    return () => {
      setTitle();
    };
  }, [setTitle, idDetail]);

  useEffect(() => {
    if (type === 'list' && (currentPage || pageSize)) {
      onRefresh?.(refetch);
    }
  }, [currentPage, pageSize, type]);

  return (
    <TicketsContext.Provider
      value={{
        ticketPage: {
          ...paginationPage,
          apiData: listTicket,
          setApiData: setListTicket,
          totalEvents: total,
          refetch,
          isFetching: isFetching || isFetchingDetail,
          isLoading: isLoading || loadingDetail,
          showSearch: getColumnSearchPropsByInput,
        },
        selectedDetail,
        onSelectedDetail,
        openModal,
        onOpenModal: handleOnpenModal,
        isActionLoading: actionTicketMutation.isLoading || actionTicketCommentMutation.isLoading,
        onActionTicket: handleActionTicket,
        onActionTicketComment: handleActionTicketComment,
        paramsQuery,
      }}
    >
      {children}
    </TicketsContext.Provider>
  );
};

export const useTicketContextStore = (): TicketsContextType => {
  const context = useContext(TicketsContext);
  if (!context) {
    throw new Error('useTicketsContext must be used within a TicketsProvider');
  }
  return context;
};
