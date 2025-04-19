'use client';

import { EEventType } from '@/common/enums';
import { ETicketPriority, ETicketStatus } from '@/enums/ticket.enums';
import { EditOutlined } from '@ant-design/icons';
import { Badge, Button, Popover, Radio, Tag } from 'antd';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { getPriorityTag, getStatusTag } from '.';
import { useTicketContextStore } from './context';

type Props = {
  type: 'priority' | 'status';
};

const UpdateLabelTicket = ({ type }: Props) => {
  const [open, setOpen] = useState(false);
  const { selectedDetail, onActionTicket } = useTicketContextStore();
  const [selected, setSelected] = useState();
  const t = useTranslations();

  const save = () => {
    if (selectedDetail?.id)
      onActionTicket?.(
        selectedDetail?.id,
        {
          [type]: selected,
        } as any,
        EEventType.UPDATE,
      );
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  const list =
    type === 'priority'
      ? [ETicketPriority.URGENT, ETicketPriority.HIGH, ETicketPriority.MEDIUM, ETicketPriority.LOW]
      : [
          ETicketStatus.OPEN,
          ETicketStatus.IN_PROGRESS,
          ETicketStatus.RESOLVED,
          ETicketStatus.CLOSED,
        ];

  return (
    <Popover
      content={
        <div>
          <Radio.Group
            className='!flex flex-col gap-2'
            value={selected || selectedDetail?.[type]}
            onChange={(e) => setSelected(e?.target?.value)}
          >
            {list.map((item: any) => (
              <Radio key={item} value={item}>
                {type === 'priority' ? (
                  <Tag color={getPriorityTag(item)}>
                    <div className='capitalize'>
                      <Badge
                        color={getPriorityTag(item)}
                        text={<span className='!text-xs'> {item}</span>}
                      />
                    </div>
                  </Tag>
                ) : (
                  <Tag color={getStatusTag(item)} className='capitalize'>
                    {item}
                  </Tag>
                )}
              </Radio>
            ))}
          </Radio.Group>
          <div className='text-right mt-3'>
            <Button type='primary' onClick={save} size='small'>
              OK
            </Button>
          </div>
        </div>
      }
      title={t(type === 'priority' ? 'SETTING_FALLBACK.PRIORITY' : 'TENANT.STATUS')}
      trigger='click'
      open={open}
      onOpenChange={handleOpenChange}
    >
      <Button type='text' icon={<EditOutlined size={18} />} />
    </Popover>
  );
};

export default UpdateLabelTicket;
