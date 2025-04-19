'use client';

import { DATE_FORMAT_2, TIME_SECOND_FORMAT } from '@/common/constants';
import { EEventType, ETaskStatusByUserAction } from '@/common/enums';
import { AvatarGroupComponent, LoadingDashboard } from '@/components/atoms';
import { ActionDot, ActionTable } from '@/components/molecules';
import ModalConfirm from '@/components/molecules/ModalConfirm';
import { ETicketPriority, ETicketStatus } from '@/enums/ticket.enums';
import { ITicket, IUserInTask } from '@/interfaces/task.interfaces';
import { ROUTES_FE } from '@/routers';
import NumberUtils from '@/utils/NumberUtils';
import { EyeOutlined } from '@ant-design/icons';
import { Badge, TableColumnsType, Tag } from 'antd';
import Table, { TableProps } from 'antd/es/table';
import dayjs from 'dayjs';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { BiTrash } from 'react-icons/bi';
import { GoClock } from 'react-icons/go';
import { IoWarningOutline } from 'react-icons/io5';
import { getPriorityTag, getStatusTag } from '.';
import { useTicketContextStore } from './context';

interface Props {}
const TicketList: FC<Props> = ({}) => {
  const t = useTranslations();
  const { data: session } = useSession();

  const {
    openModal,
    onOpenModal,
    ticketPage,
    onSelectedDetail,
    selectedDetail,
    onActionTicket,
    isActionLoading,
  } = useTicketContextStore();
  const {
    setPageSize,
    setCurrentPage,
    setFilter,
    filter,
    isLoading,
    apiData: listTicket,
    totalEvents,
    currentPage,
    isFetching,
    pageSize,
    showSearch,
  } = ticketPage;
  const router = useRouter();
  //// end list ////

  const handleGetDetails = async (record?: ITicket) => {
    if (!record?.id) return;
    router.push(ROUTES_FE.TENANT.TICKET.DETAIL + record.id);
  };

  const handleDeleteContent = () => {
    if (selectedDetail?.id && onActionTicket)
      onActionTicket(selectedDetail?.id, undefined, EEventType.DELETE);
  };

  const handleChangeTable: TableProps<ITicket>['onChange'] = (pagination, filters, sorter: any) => {
    if (pagination) {
      setCurrentPage(pagination.current || 0);
      setPageSize(pagination.pageSize || 10);
    }
    setFilter({
      ...filter,
      status: filters?.status?.[0],
      type: filters?.type?.[0],
      orderBy: sorter?.order
        ? `${sorter?.field}=${sorter.order === 'descend' ? 'desc' : 'asc'}`
        : 'asc',
    });
  };

  const itemsAction = (record: ITicket) =>
    [
      {
        label: t('TENANT.DETAIL'),
        key: '0',
        icon: <EyeOutlined className='!text-primary !text-lg' />,
        onClick: () => {
          if (record?.id) router.push(ROUTES_FE.TENANT.TICKET.DETAIL + `${record.id}`);
        },
      },
      {
        label: `${t('GENERAL.DELETE')}`,
        key: '1',
        icon: <BiTrash className='!text-red-500 !text-lg' />,
        onClick: () => {
          onOpenModal(EEventType.DELETE);
        },
      },
    ].filter(Boolean) as any;

  const columns: TableColumnsType<ITicket> = [
    {
      key: 'statusViewAssignee',
      dataIndex: 'statusViewAssignee',
      title: '',
      render: (value, record) =>
        session?.user?.id === record?.assignee?.id &&
        value === ETaskStatusByUserAction.new && <ActionDot />,
      width: 20,
    },
    {
      key: 'title',
      dataIndex: 'title',
      title: t('TENANT.NAME'),
      ellipsis: true,
      ...showSearch(),
    },
    {
      title: t('SETTING_FALLBACK.PRIORITY'),
      dataIndex: 'priority',
      key: 'priority',
      filters: [
        ETicketPriority.URGENT,
        ETicketPriority.HIGH,
        ETicketPriority.MEDIUM,
        ETicketPriority.LOW,
      ].map((item) => ({
        text: item.toUpperCase(),
        value: item,
      })),
      filterMultiple: false,
      onFilter: (value, record) => record.priority.indexOf(value as string) === 0,
      render: (priority) => (
        <Tag color={getPriorityTag(priority)}>
          <div className='capitalize'>
            <Badge
              color={getPriorityTag(priority)}
              text={<span className='!text-xs'> {priority}</span>}
            />
          </div>
        </Tag>
      ),
      width: 120,
    },
    {
      title: t('TENANT.STATUS'),
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusTag(status)} className='capitalize'>
          {status}
        </Tag>
      ),
      width: 120,
      filters: [
        ETicketStatus.OPEN,
        ETicketStatus.IN_PROGRESS,
        ETicketStatus.RESOLVED,
        ETicketStatus.CLOSED,
      ].map((item) => ({
        text: item.toUpperCase(),
        value: item,
      })),
      filterMultiple: false,
      onFilter: (value, record) => record.status.indexOf(value as string) === 0,
    },

    {
      key: 'createdBy',
      dataIndex: 'createdBy',
      title: t('DISCOUNT.CREATED_USER'),
      render: (value: IUserInTask) => (
        <AvatarGroupComponent
          list={[value ? ({ ...value, avatar: value?.userProfile?.avatar } as any) : {}]}
        />
      ),
      width: 120,
      align: 'center',
    },
    {
      key: 'assignee',
      dataIndex: 'assignee',
      title: t('TASK.ASSIGNEE'),
      render: (value: IUserInTask) => (
        <AvatarGroupComponent
          list={[value ? ({ ...value, avatar: value?.userProfile?.avatar } as any) : {}]}
        />
      ),
      width: 200,
      align: 'center',
    },
    {
      title: t('GENERAL.CREATED_AT'),
      key: 'createdAt',
      dataIndex: 'createdAt',
      render: (value) => (
        <>
          <div>{dayjs(dayjs(value, 'YYYY-MM-DDTHH:mm:ssZ')).format(DATE_FORMAT_2)}</div>
          <div className='italic text-neutral-400 text-xs flex gap-2 items-center'>
            {dayjs(dayjs(value, 'YYYY-MM-DDTHH:mm:ssZ')).format(TIME_SECOND_FORMAT)} <GoClock />
          </div>
        </>
      ),
      sorter: (a, b) => (a?.createdAt || '')?.localeCompare(b?.createdAt || ''),
      width: 150,
    },
    {
      key: 'action',
      title: '',
      align: 'center',
      render: (record) => {
        return (
          <div
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
            }}
          >
            <ActionTable items={itemsAction(record)} onClick={() => onSelectedDetail(record)} />
          </div>
        );
      },
      width: 50,
      fixed: 'right',
    },
  ];
  if (isLoading) return <LoadingDashboard />;
  return (
    <>
      <Table
        columns={columns}
        dataSource={listTicket}
        rowKey='id'
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: totalEvents,
          showTotal: (numberTotal) => (
            <span className='font-bold text-base'>{`${t(
              'GENERAL.TOTAL',
            )}: ${NumberUtils.numberToCurrency(numberTotal || 0)}`}</span>
          ),
          showSizeChanger: (totalEvents || 0) < 10 ? false : true,
          className: 'items-center',
        }}
        onChange={handleChangeTable}
        scroll={listTicket?.length > 0 ? { x: 'max-content' } : undefined}
        sticky={true}
        loading={isFetching}
        showSorterTooltip={false}
        rowClassName='cursor-pointer'
        onRow={(record) => {
          return {
            onClick: async () => handleGetDetails(record),
          };
        }}
      />
      {openModal === EEventType.DELETE && (
        <ModalConfirm
          title={
            <div className='text-center'>
              <IoWarningOutline color='red' size={50} />
              <p className='my-4'>{t('SETTING_FALLBACK.CONFIRM_DELETE')}</p>
            </div>
          }
          open={!!openModal}
          onOk={handleDeleteContent}
          onCancel={() => onOpenModal(undefined)}
          okText={t('GENERAL.DELETE')}
          okButtonProps={{
            disabled: isActionLoading,
          }}
        />
      )}
    </>
  );
};
export default TicketList;
