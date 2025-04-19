'use client';

import { EEventType } from '@/common/enums';
import { Statistics } from '@/components/atoms';
import { LayoutContent } from '@/components/organisms';
import { ETicketStatus } from '@/enums/ticket.enums';
import { useGlobalStore } from '@/stores/useGlobal.store';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Card } from 'antd';
import { useTranslations } from 'next-intl';
import React, { Fragment, useEffect } from 'react';
import { IoTicketOutline } from 'react-icons/io5';
import {
  CreateUpdateTicketModal,
  getStatusTicket,
  TicketList,
  TicketsProvider,
  useTicketContextStore,
} from './partials';

const TicketTemplate: React.FC = () => {
  return (
    <TicketsProvider type='list'>
      <RenderContentTemplate />
    </TicketsProvider>
  );
};

const RenderContentTemplate = () => {
  const t = useTranslations();
  const { openModal, onOpenModal, paramsQuery } = useTicketContextStore();
  const { notiTask } = useGlobalStore();
  useEffect(() => {
    if (paramsQuery?.conversationId) {
      onOpenModal(EEventType.CREATE);
    }
  }, [paramsQuery?.conversationId]);
  return (
    <Fragment>
      <LayoutContent
        title={t('BREADCRUMB.tickets')}
        showResult={{ status: '403' }}
        renderIfTrue={true}
        extra={
          <Button
            icon={<PlusCircleOutlined />}
            type='primary'
            onClick={() => onOpenModal(EEventType.CREATE)}
          >
            {t('GENERAL.CREATE')}
          </Button>
        }
      >
        <div className='grid grid-cols-5 gap-x-4 mb-4'>
          <Statistics
            icon={<IoTicketOutline className='w-6 text-black' />}
            title={t('BREADCRUMB.tickets')}
            value={notiTask?.allTicket || 0}
          />
          {[
            ETicketStatus.OPEN,
            ETicketStatus.IN_PROGRESS,
            ETicketStatus.RESOLVED,
            ETicketStatus.CLOSED,
          ].map((item) => {
            const status = getStatusTicket(item);
            return (
              <Statistics
                key={item}
                icon={status.icon}
                title={t(status.label as any)}
                value={notiTask?.[item as ETicketStatus] || 0}
              />
            );
          })}
        </div>
        <Card bordered={false}>
          <TicketList />
        </Card>
      </LayoutContent>
      {openModal === EEventType.CREATE && <CreateUpdateTicketModal />}
    </Fragment>
  );
};

export default TicketTemplate;
