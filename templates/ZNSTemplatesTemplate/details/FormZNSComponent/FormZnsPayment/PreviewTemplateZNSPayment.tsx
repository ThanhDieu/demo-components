'use client';
import { COLORS } from '@/common/colors';
import { Form } from 'antd';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import React, { useMemo } from 'react';
import { FaRegCreditCard } from 'react-icons/fa';
import { useZNSTemplateDetails } from '..';
import {
  RenderButtonActionForPlayground,
  RenderItemContentForPlayground,
  RenderLogoForPlayground,
  RenderOuterCardForPlayground,
} from '../..';
import { MockBankList } from './znsPaymentData';

const PreviewTemplateZNSPayment: React.FC = () => {
  const t = useTranslations();

  const { formZNSDetails, stateZNSTemplateStore } = useZNSTemplateDetails();
  const { modeTemplate } = stateZNSTemplateStore;
  const layoutWatch = Form.useWatch('layout', formZNSDetails);
  const buttonsWatch = Form.useWatch('buttons', formZNSDetails);
  const titleWatch = Form.useWatch('title', formZNSDetails);
  const paymentWatch = Form.useWatch('payment', formZNSDetails);

  const currentBank = useMemo(() => {
    if (!paymentWatch?.bank_code) return;
    return MockBankList.find((el) => el.bin === paymentWatch?.bank_code);
  }, [paymentWatch?.bank_code]);
  return (
    <div className='preview-content p-3'>
      <RenderLogoForPlayground />
      <div
        className={clsx(
          'font-bold mb-3 text-[16px]',
          modeTemplate === 'dark' ? 'text-white' : 'text-black',
        )}
      >
        {titleWatch}
      </div>
      {layoutWatch?.map((item, index: number) => (
        <RenderItemContentForPlayground key={index} type={item.type} item={item} index={index} />
      ))}
      <RenderOuterCardForPlayground
        icon={<FaRegCreditCard color={COLORS.bgZaloOA} size={20} />}
        title={t('ZNS_TEMPLATE.PAY_NOW')}
      >
        <div className='flex mb-3 gap-1'>
          <div className='w-1/3'>{t('ZNS_TEMPLATE.BANK')}</div>
          <div className='w-2/3 text-zaloOA'>
            {currentBank ? `${currentBank?.name} (${currentBank?.shortName})` : ''}
          </div>
        </div>
        <div className='flex mb-3 gap-1'>
          <div className='w-1/3'>{t('ZNS_TEMPLATE.ACCOUNT_NAME')}</div>
          <div className={clsx('w-2/3', modeTemplate === 'dark' ? 'text-white' : 'text-black')}>
            {paymentWatch?.account_name || ''}
          </div>
        </div>
        <div className='flex mb-3 gap-1'>
          <div className='w-1/3'>{t('ZNS_TEMPLATE.ACCOUNT_NUMBER')}</div>
          <div className='w-2/3 text-zaloOA'>{paymentWatch?.account_number || ''}</div>
        </div>
        <div className='flex mb-3 gap-1'>
          <div className='w-1/3'>{t('ZNS_TEMPLATE.MONEY')}</div>
          <div className='w-2/3 text-zaloOA'>{paymentWatch?.amount || ''}</div>
        </div>
        <div className='flex mb-3 gap-1'>
          <div className='w-1/3'>{t('ZNS_TEMPLATE.DES_2')}</div>
          <div className='w-2/3 text-zaloOA'>{paymentWatch?.note || ''}</div>
        </div>
      </RenderOuterCardForPlayground>
      <RenderButtonActionForPlayground buttons={buttonsWatch || []} />
    </div>
  );
};

export default PreviewTemplateZNSPayment;
