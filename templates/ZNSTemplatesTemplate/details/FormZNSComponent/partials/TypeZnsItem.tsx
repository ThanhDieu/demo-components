'use client';
import { COLORS } from '@/common/colors';
import { InfoCircleOutlined } from '@ant-design/icons';
import { Popover } from 'antd';
import clsx from 'clsx';
import { useTranslations } from 'next-intl';
import React from 'react';
import { IoMdCheckmarkCircle } from 'react-icons/io';

interface Props {
  icon: React.ReactNode;
  title: string;
  price?: number;
  subTitle?: string;
  isNewTag?: boolean;
  isChooseItem?: boolean;
  onClick?: () => void;
  disabled?: boolean;
  description?: string;
}
const TypeZnsItem = (props: Props) => {
  const {
    icon,
    title,
    price,
    isNewTag = false,
    isChooseItem = false,
    onClick,
    subTitle,
    disabled,
    description,
  } = props;
  const t = useTranslations();
  return (
    <div
      onClick={!disabled ? onClick : undefined}
      className={clsx(
        `h-full relative bg-white transition-all duration-300 p-3 rounded-xs border border-solid border-neutral-200 `,
        isChooseItem ? '!border-primary' : '',
        disabled ? '!bg-gray-300 opacity-50 cursor-not-allowed' : 'cursor-pointer',
      )}
    >
      {isNewTag && (
        <div className='absolute top-0 right-0 bg-primary text-white text-[9px] px-2 py-[2px] rounded-tr-xs rounded-bl-[2px]'>
          {t('GENERAL.COMING_SOON')}
        </div>
      )}
      {description && (
        <Popover
          overlayClassName='!max-w-[250px]'
          content={<div dangerouslySetInnerHTML={{ __html: description }} />}
        >
          <div className='absolute top-0 right-0 bg-primary text-white text-[9px] px-2 py-[2px] rounded-tr-xs rounded-bl-[2px]'>
            <InfoCircleOutlined />
          </div>
        </Popover>
      )}
      <div>{isChooseItem ? <IoMdCheckmarkCircle size={24} color={COLORS.primary} /> : icon}</div>
      <div className='font-semibold text-xs 2xl:text-sm'>{title}</div>
      {!!price && (
        <div className='text-primary text-xs 2xl:text-sm'>
          {t('BILLING.FROM')} {price}đ/ZNS
        </div>
      )}
      {!!subTitle && <div className='text-gray-500 text-xs 2xl:text-sm'>{subTitle}</div>}
    </div>
  );
};

export default TypeZnsItem;
