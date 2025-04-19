'use client';

import { TypeFeedBackFormZNSTemplateForPlayground } from '@/common/enums';
import { Button, Divider, Form, Image } from 'antd';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import React, { useMemo } from 'react';
import { CiStar } from 'react-icons/ci';
import { PiStarDuotone, PiStarFill } from 'react-icons/pi';
import { useZNSTemplateDetails } from '..';
import {
  RenderButtonActionForPlayground,
  RenderItemContentForPlayground,
  RenderLogoForPlayground,
} from '../..';

const PreviewTemplateZNSFeedback: React.FC = () => {
  const t = useTranslations();
  const { formZNSDetails, stateZNSTemplateStore } = useZNSTemplateDetails();
  const ratingsWatch = Form.useWatch('ratings', formZNSDetails);
  const typeRatingWatch = Form.useWatch('typeRating', formZNSDetails);
  const indexRatingWatch = Form.useWatch('indexRating', formZNSDetails);
  const layoutWatch = Form.useWatch('layout', formZNSDetails);
  const buttonsWatch = Form.useWatch('buttons', formZNSDetails);
  const titleWatch = Form.useWatch('title', formZNSDetails);

  const ratingFocus = useMemo(() => {
    if (!ratingsWatch || ratingsWatch?.length === 0 || !typeRatingWatch) return;
    return ratingsWatch?.[indexRatingWatch || 0];
  }, [indexRatingWatch, typeRatingWatch, ratingsWatch]);
  return (
    <div className='preview-content p-3'>
      {ratingFocus ? (
        <div>
          {typeRatingWatch === TypeFeedBackFormZNSTemplateForPlayground.FEEDBACK_PLAYGROUND && (
            <div className='text-center'>
              <div className='font-bold mb-4'> {ratingFocus?.title}</div>
              {Array.from({ length: 5 }).map((_, index) =>
                (ratingFocus?.star || 0) <= index ? (
                  <PiStarDuotone key={index} size={35} color='#ffa800' />
                ) : (
                  <PiStarFill key={index} size={35} color='#ffa800' />
                ),
              )}
              <Divider className='my-0' />
              <div className='mb-4 font-medium leading-5'>{ratingFocus?.question}</div>
              <div className='text-[10px] mb-4'>({t('ZNS_TEMPLATE.CAN_CHOOSE_MANY')})</div>
              <div className='flex flex-wrap justify-center items-center gap-1'>
                {ratingFocus?.answers?.filter(Boolean)?.map((ans: string, idx: number) => (
                  <div key={idx} className='bg-neutral-100 rounded-md p-1 px-2 text-xs text-center'>
                    {ans}
                  </div>
                ))}
              </div>
              <div className='bg-gray-100 rounded-sm p-2 text-left h-24 mt-3'>
                <span className='text-gray-400 text-xs'>Hãy giúp chúng tôi hiểu hơn</span>
              </div>
            </div>
          )}
          {typeRatingWatch === TypeFeedBackFormZNSTemplateForPlayground.THANKYOU_PLAYGROUND && (
            <div className='text-center'>
              <Image
                preview={false}
                src='https://stc-oa.zdn.vn/resources/zca-tool/static/media/rating-thankyou.fbf8d77e.svg'
              />
              <div className='font-bold my-4'>{ratingFocus?.thanks}</div>
              <div className='text-xs text-center'>{ratingFocus?.description}</div>
              <div className='flex w-full mt-12'>
                <Button
                  onClick={() => formZNSDetails.resetFields(['indexRating', 'typeRating'])}
                  type='primary'
                  className={'w-full !font-bold !bg-zaloOA'}
                >
                  {t('ZNS_TEMPLATE.COMPLETED_BUTTON')}
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div>
          <RenderLogoForPlayground />
          <div
            className={clsx(
              'font-bold mb-3 text-[16px]',
              stateZNSTemplateStore?.modeTemplate === 'dark' ? 'text-white' : 'text-black',
            )}
          >
            {titleWatch}
          </div>
          <div>
            {layoutWatch?.map((item, index: number) => (
              <RenderItemContentForPlayground
                item={item}
                key={index}
                index={index}
                type={item.type}
              />
            ))}
          </div>

          <div
            className='border border-solid rounded-xs flex gap-4 justify-center items-center py-2 rounded-lg'
            style={{
              background:
                stateZNSTemplateStore?.modeTemplate === 'dark'
                  ? 'rgb(66 40 5 / 70%)'
                  : 'linear-gradient(180deg,rgba(255,252,249,.7),rgba(255,248,238,.7))',
              borderColor: stateZNSTemplateStore?.modeTemplate === 'dark' ? '#634101' : '#fec',
            }}
          >
            {Array.from({ length: 5 }).map((_, index) => (
              <CiStar key={index} size={35} color='#ffa800' />
            ))}
          </div>
          <RenderButtonActionForPlayground buttons={buttonsWatch || []} />
        </div>
      )}
    </div>
  );
};

export default PreviewTemplateZNSFeedback;
