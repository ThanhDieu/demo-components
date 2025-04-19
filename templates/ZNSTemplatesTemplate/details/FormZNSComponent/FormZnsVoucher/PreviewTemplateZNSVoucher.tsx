'use client';

import { DATE_FORMAT_2, TIME_FORMAT } from '@/common/constants';
import { Divider, Form, Image } from 'antd';
import clsx from 'clsx';
import dayjs from 'dayjs';
import React from 'react';
import { useZNSTemplateDetails } from '..';
import {
  RenderButtonActionForPlayground,
  RenderImagesForPlayground,
  RenderItemContentForPlayground,
  RenderLogoForPlayground,
  RenderOuterCardForPlayground,
} from '../..';
const barcode =
  'https://stc-oa.zdn.vn/resources/new-zca-tool/prod/static/media/img-bar-code.94f58d19.png';
const qrCode =
  'https://stc-oa.zdn.vn/resources/new-zca-tool/prod/static/media/img-qr-code.a0e9bc8c.png';

const PreviewTemplateZNSVoucher: React.FC = () => {
  const { formZNSDetails, stateZNSTemplateStore } = useZNSTemplateDetails();
  const { selectedItemZNSTemplate, modeTemplate } = stateZNSTemplateStore;
  const layoutWatch = Form.useWatch('layout', formZNSDetails);
  const buttonsWatch = Form.useWatch('buttons', formZNSDetails);
  const titleWatch = Form.useWatch('title', formZNSDetails);
  const voucherWatch = Form.useWatch('voucher', formZNSDetails);

  const formatDate = (field: 'end_date' | 'start_date') => {
    if (!voucherWatch?.[field]) return '';
    return voucherWatch?.[`${field}_prefix`] === 'date'
      ? dayjs(voucherWatch[field]).format(`${TIME_FORMAT} ${DATE_FORMAT_2}`)
      : voucherWatch[field];
  };
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
          <RenderItemContentForPlayground item={item} key={index} index={index} type={item.type} />
        ))}
        <RenderOuterCardForPlayground
          title='Lưu vào ví QR'
          icon={<Image src={'/images/walletQr.png'} className='!w-auto !h-5' preview={false} />}
        >
          <div
            className={clsx(
              'font-bold mb-1',
              modeTemplate === 'dark' ? 'text-white' : 'text-black',
            )}
          >
            {voucherWatch?.name}
          </div>
          <div className='text-xs leading-5'>{voucherWatch?.condition}</div>
          <div className='text-xs leading-5'>
            HSD: {voucherWatch?.start_date ? `${formatDate('start_date')} - ` : ''}{' '}
            {formatDate('end_date')}
          </div>
          <Divider
            dashed
            style={{ borderColor: modeTemplate === 'dark' ? '#325366' : '#d0e3ff' }}
            className='!my-3'
          />
          <div
            className={clsx('text-center', modeTemplate === 'dark' ? 'text-white' : 'text-black')}
          >
            <div>
              {['1', '2'].includes(voucherWatch?.display_code) ? (
                <Image
                  src={voucherWatch?.display_code === '1' ? qrCode : barcode}
                  className='!w-auto !max-h-24'
                  preview={false}
                />
              ) : (
                ''
              )}
            </div>
            Mã: <span className='font-medium text-zaloOA'>{voucherWatch?.voucher_code}</span>
          </div>
        </RenderOuterCardForPlayground>
        <RenderButtonActionForPlayground buttons={buttonsWatch || []} />
      </div>
    </div>
  );
};

export default PreviewTemplateZNSVoucher;
