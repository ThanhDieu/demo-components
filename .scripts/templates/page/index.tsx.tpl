'use client';

import { EEventType } from '@/common/enums';
import { LayoutContent } from '@/components/organisms';
import { use__Name__Store } from '@/stores/@miniApp/use__Name__Store.store';
import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Card } from 'antd';
import { useTranslations } from 'next-intl';
import React from 'react';
import { __Name__Table, CreateUpdate__Name__Modal } from './partials';

type __Name__TemplateProps = {
  miniAppId?: string;
};

const __Name__Template: React.FC<__Name__TemplateProps> = () => {
  const t = useTranslations();
  const { openModal, setOpenModal } = use__Name__Store();

  const showCreateUpdateModal =
    openModal && [EEventType.CREATE, EEventType.UPDATE].includes(openModal);

  return (
    <LayoutContent
      title={t('BREADCRUMB.__Name__', { defaultValue: '__Name__' })}
      renderIfTrue
      extra={
        <Button
          type='primary'
          icon={<PlusCircleOutlined />}
          onClick={() => setOpenModal(EEventType.CREATE)}
        >
          {t('GENERAL.CREATE')}
        </Button>
      }
    >
      <Card>
        <__Name__Table />
      </Card>
      {showCreateUpdateModal && <CreateUpdate__Name__Modal />}
    </LayoutContent>
  );
};

export default __Name__Template;
