'use client';

import { DATE_FORMAT_2, TIME_SECOND_FORMAT } from '@/common/constants';
import { EEventType } from '@/common/enums';
import { LoadingMini } from '@/components/atoms';
import { UserInformation } from '@/components/molecules';
import { LayoutContent } from '@/components/organisms';
import { Badge, Button, Tag } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import {
  CreateUpdateTicketModal,
  getPriorityTag,
  getStatusTag,
  TicketContentOuter,
  TicketInformation,
  UpdateLabelTicket,
} from './partials';
import { TicketsProvider, useTicketContextStore } from './partials/context';

const TicketDetailTemplate = ({ params }: { params: { id: string } }) => {
  return (
    <TicketsProvider type='detail' idDetail={params.id}>
      <RenderContent />
    </TicketsProvider>
  );
};
const RenderContent = () => {
  const t = useTranslations();
  const router = useRouter();
  const { selectedDetail, ticketPage, openModal } = useTicketContextStore();
  const { isLoading, isFetching } = ticketPage;

  const inforItems = [
    {
      label: 'GENERAL.CREATED_AT',
      content: (
        <>
          <span>
            {dayjs(dayjs(selectedDetail?.createdAt, 'YYYY-MM-DDTHH:mm:ssZ')).format(DATE_FORMAT_2)}
          </span>
          <span className='italic text-neutral-400 text-xs inline-flex gap-2 items-center pl-3'>
            {dayjs(dayjs(selectedDetail?.createdAt, 'YYYY-MM-DDTHH:mm:ssZ')).format(
              TIME_SECOND_FORMAT,
            )}
          </span>
        </>
      ),
    },
    {
      label: 'SETTING_FALLBACK.PRIORITY',
      content: selectedDetail?.priority ? (
        <div className='flex gap-2 items-center'>
          <Tag color={getPriorityTag(selectedDetail?.priority)}>
            <div className='capitalize'>
              <Badge
                color={getPriorityTag(selectedDetail?.priority)}
                text={<span className='text-xs'>{selectedDetail?.priority}</span>}
              />
            </div>
          </Tag>
          <UpdateLabelTicket type='priority' />
        </div>
      ) : (
        ''
      ),
    },
    {
      label: 'TENANT.STATUS',
      content: selectedDetail?.status ? (
        <div className='flex gap-2 items-center'>
          <Tag color={getStatusTag(selectedDetail?.status)} className='capitalize'>
            {selectedDetail.status}
          </Tag>
          <UpdateLabelTicket type='status' />
        </div>
      ) : (
        ''
      ),
    },

    {
      label: 'DISCOUNT.CREATED_USER',
      content: selectedDetail?.createdBy ? (
        <UserInformation
          user={
            {
              ...selectedDetail?.createdBy,
              avatar: selectedDetail?.createdBy?.userProfile?.avatar,
            } as any
          }
        />
      ) : (
        ''
      ),
    },
    {
      label: 'TASK.ASSIGNEE',
      content: selectedDetail?.assignee ? (
        <UserInformation
          user={
            {
              ...selectedDetail?.assignee,
              avatar: selectedDetail?.assignee?.userProfile?.avatar,
            } as any
          }
        />
      ) : (
        ''
      ),
    },
  ];

  return (
    <LayoutContent
      title={selectedDetail?.title}
      renderIfTrue={true}
      showResult={{
        status: '404',
        extra: (
          <Button type='primary' onClick={() => router.back()}>
            {t('GENERAL.BACK')}
          </Button>
        ),
      }}
      isLoading={isLoading}
    >
      <LoadingMini spinning={isFetching}>
        <TicketContentOuter>
          <TicketInformation items={inforItems} />
        </TicketContentOuter>
      </LoadingMini>
      {openModal === EEventType.UPDATE && <CreateUpdateTicketModal />}
    </LayoutContent>
  );
};
export default TicketDetailTemplate;
