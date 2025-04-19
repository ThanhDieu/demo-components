'use client';
import { COLORS } from '@/common/colors';
import { useZNSTemplateStore } from '@/stores/useZNSTemplate.store';
import { Card } from 'antd';
import React from 'react';
import { FaAngleRight } from 'react-icons/fa';

type Props = {
  children: React.ReactNode;
  title: string;
  icon: React.ReactNode;
};

const RenderOuterCardForPlayground = ({ children, title, icon }: Props) => {
  const { modeTemplate } = useZNSTemplateStore();
  return (
    <Card
      size='small'
      title={
        <div className='flex items-center gap-2'>
          {icon}
          <span className='text-zaloOA'>{title}</span>
        </div>
      }
      className={modeTemplate === 'dark' ? '!border-[#325366]' : '!border-[#d0e3ff]'}
      extra={<FaAngleRight color={COLORS.bgZaloOA} />}
      styles={{
        header: {
          borderBottom: modeTemplate === 'dark' ? '2px solid #325366' : '2px solid #d0e3ff',
        },
      }}
      classNames={{
        body: modeTemplate === 'dark' ? 'text-[#bdbbc3] bg-[#17252e]' : 'text-bgDark bg-[#f1fbff]',
        header: modeTemplate === 'dark' ? '!bg-black' : 'bg-white',
      }}
    >
      {children}
    </Card>
  );
};

export default RenderOuterCardForPlayground;
