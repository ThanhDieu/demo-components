'use client';
import { Form } from 'antd';
import { useTranslations } from 'next-intl';
import React from 'react';
import { getCurrentZNSButton, useZNSTemplateDetails } from '../FormZNSComponent';

const RenderCostSummaryForPlayground: React.FC = () => {
  const t = useTranslations('ZNS_TEMPLATE');
  const { formZNSDetails } = useZNSTemplateDetails();
  const buttonsWatch = Form.useWatch('buttons', formZNSDetails) as any[];
  if (!buttonsWatch || !buttonsWatch?.length) return;
  return (
    <>
      {buttonsWatch.map((bt, index) => {
        const btItem = getCurrentZNSButton(bt?.type);
        return (
          <div key={index} className='flex w-full justify-between items-center'>
            <span>{index === 0 ? t('PRIMARY_BUTTON') : t('SECONDARY_BUTTON')}</span>
            <span className='font-semibold'>
              {index === 0 ? btItem?.primaryPrice : index === 1 ? btItem?.secondaryPrice : 0} VND
            </span>
          </div>
        );
      })}
    </>
  );
};

export default RenderCostSummaryForPlayground;
