'use client';

import { Form } from 'antd';
import clsx from 'clsx';
import React from 'react';
import { useZNSTemplateDetails } from '..';
import {
  RenderButtonActionForPlayground,
  RenderImagesForPlayground,
  RenderItemContentForPlayground,
  RenderLogoForPlayground,
} from '../..';

const PreviewTemplateZNSCustom: React.FC = () => {
  const { formZNSDetails, stateZNSTemplateStore } = useZNSTemplateDetails();
  const { selectedItemZNSTemplate, modeTemplate } = stateZNSTemplateStore;
  const layoutWatch = Form.useWatch('layout', formZNSDetails);
  const buttonsWatch = Form.useWatch('buttons', formZNSDetails);
  const titleWatch = Form.useWatch('title', formZNSDetails);
  return (
    <div className='preview-content'>
      {selectedItemZNSTemplate?.banner && selectedItemZNSTemplate?.banner?.length > 0 ? (
        <RenderImagesForPlayground />
      ) : (
        <div className='pt-3 px-3'>
          <RenderLogoForPlayground />
        </div>
      )}
      <div className='pb-3 px-3'>
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
        <RenderButtonActionForPlayground buttons={buttonsWatch || []} />
      </div>
    </div>
  );
};

export default PreviewTemplateZNSCustom;
