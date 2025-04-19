'use client';

import { LayoutContent } from '@/components/organisms';
import { use__Name__Store } from '@/stores/@miniApp/use__Name__Store.store';
import { Card, Col, Row } from 'antd';
import { useTranslations } from 'next-intl';
import React from 'react';
import { config__Name__Information } from './partials';
import { useRouter } from 'next/navigation';

type __Name__DetailTemplateProps = {
  detailId?: string;
  miniAppId?: string;
};

const __Name__DetailTemplate: React.FC<__Name__DetailTemplateProps> = () => {
  const t = useTranslations();
  const router = useRouter();
  const { current__Name__ } = use__Name__Store();
  const inforItems = config__Name__Information(t).map((item: any) => ({
    key: item.dataIndex,
    label: item.title,
    content: item?.render
      ? item?.render((current__Name__ as any)?.[item.dataIndex], current__Name__)
      : (current__Name__ as any)?.[item.dataIndex],
  }));
  const showList = ['id', 'name', 'status', 'createdAt']
    .map((el) => {
      const findex = inforItems.findIndex((item) => item.key === el);
      if (findex > -1) {
        return inforItems[findex];
      }
      return;
    })
    .filter(Boolean);
  return (
    <LayoutContent title={`${current__Name__?.name || t('TENANT.DETAIL')}`} renderIfTrue={true}
    icon={
        <Button type='text' icon={<ArrowLeftOutlined />} onClick={() => router.back()}></Button>
      }>
      <Card>
        <Row gutter={24} className='mb-3'>
          {showList.map((item, index) => (
            <Col span={12} key={index}>
              <Row gutter={24} className='mb-3'>
                <Col span={6} className='font-medium'>
                  {item?.label}
                </Col>
                <Col span={18}>{item?.content}</Col>
              </Row>
            </Col>
          ))}
        </Row>
      </Card>
    </LayoutContent>
  );
};

export default __Name__DetailTemplate;
