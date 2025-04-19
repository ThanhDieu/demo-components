'use client';
import { IZNSButton } from '@/interfaces/templates/template.interface';
import { useZNSTemplateStore } from '@/stores/useZNSTemplate.store';
import { Button } from 'antd';
import clsx from 'clsx';
import React from 'react';
import { LuPhone } from 'react-icons/lu';

interface ButtonGroupProps {
  buttons: IZNSButton[];
}
const RenderButtonActionForPlayground: React.FC<ButtonGroupProps> = ({ buttons }) => {
  // const handleClick = (link: string) => {
  //   window.open(link, '_blank');
  // };
  const { modeTemplate } = useZNSTemplateStore();
  if (!buttons || !buttons?.length) return;
  return (
    <div className='flex flex-col gap-3 pt-4'>
      {buttons.map((bt, index) => {
        return (
          <Button
            key={index}
            type='primary'
            className={clsx(
              'w-full !font-bold',
              index === 0
                ? '!bg-zaloOA'
                : modeTemplate === 'dark'
                ? '!bg-[#545454] !text-white'
                : '!bg-[#e5f0ff] !text-zaloOA',
            )}
            icon={String(bt.type) === '2' && <LuPhone />}
          >
            {bt?.title}
          </Button>
        );
      })}
    </div>
  );
};

export default RenderButtonActionForPlayground;
