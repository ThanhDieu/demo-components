'use client';

import { MockRowTypeTable } from '@/stores/useZNSTemplate.store';
import { Button, Form, Popover, Radio } from 'antd';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { GoTag } from 'react-icons/go';
import { useZNSTemplateDetails } from '..';

type Props = {
  disabled: boolean;
  index: number;
};

const RenderTagFormTable = ({ disabled, index }: Props) => {
  const [open, setOpen] = useState(false);
  const { formZNSDetails } = useZNSTemplateDetails();
  const paramWatch = Form.useWatch('params', formZNSDetails);
  const t = useTranslations();

  const hide = () => {
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };
  const handleSelect = (value: number) => {
    formZNSDetails.setFieldValue(['params', index, 'row_type'], value);
  };

  return (
    <Popover
      content={
        <div>
          <Radio.Group
            onChange={(e) => handleSelect(e?.target?.value)}
            defaultValue={0}
            className='!flex flex-col gap-2'
            value={paramWatch?.[index]?.row_type || 0}
          >
            {MockRowTypeTable.map((item) => (
              <Radio key={item.value} value={item.value}>
                <span
                  style={{
                    background: item.bg,
                    color: item.color,
                  }}
                  className='font-bold rounded-3xl py-1 px-3 inline-flex'
                >
                  {item.title}
                </span>
              </Radio>
            ))}
          </Radio.Group>
          <div className='text-right mt-3'>
            <Button type='primary' onClick={hide} size='small'>
              OK
            </Button>
          </div>
        </div>
      }
      title={t('ZNS_TEMPLATE.ANIMATE')}
      trigger='click'
      open={open}
      onOpenChange={handleOpenChange}
    >
      <Button type='text' disabled={disabled} icon={<GoTag size={18} />} />
    </Popover>
  );
};

export default RenderTagFormTable;
