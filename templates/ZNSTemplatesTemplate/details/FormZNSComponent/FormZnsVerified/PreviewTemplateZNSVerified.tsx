'use client';

import { COLORS } from '@/common/colors';
import { Form } from 'antd';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import React from 'react';
import { GoCopy } from 'react-icons/go';
import { useZNSTemplateDetails } from '..';
import { RenderItemContentForPlayground, RenderLogoForPlayground } from '../..';

const PreviewTemplateZNSVerified: React.FC = () => {
  const t = useTranslations();
  const { formZNSDetails, stateZNSTemplateStore } = useZNSTemplateDetails();
  const layoutWatch = Form.useWatch('layout', formZNSDetails);
  return (
    <div className='preview-content p-3'>
      <RenderLogoForPlayground />
      <div
        className={clsx(
          'font-bold mb-3',
          stateZNSTemplateStore?.modeTemplate === 'dark' ? 'text-white' : 'text-black',
        )}
      >
        {t('ZNS_TEMPLATE.YOUR_AUTHENTICATE')}
      </div>
      <div className='flex gap-3 mb-3 items-center'>
        <span
          className={clsx(
            'leading-snug font-bold text-lg',
            stateZNSTemplateStore?.modeTemplate === 'dark' ? 'text-white' : 'text-black',
          )}
        >
          &lt;otp&gt;
        </span>
        <GoCopy color={COLORS.bgZaloOA} size={20} />
      </div>
      {layoutWatch?.map((item, index: number) => (
        <RenderItemContentForPlayground item={item} key={index} index={index} type={item.type} />
      ))}
    </div>
  );
};

export default PreviewTemplateZNSVerified;
