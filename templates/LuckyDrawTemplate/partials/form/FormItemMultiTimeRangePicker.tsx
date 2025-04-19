'use client';
import { Form, Input, Space, Tag, TimePicker } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useState } from 'react';

type TimeRange = [Dayjs, Dayjs];

interface MultiTimeRangeProps {
  name: (string | number)[];
  onChange?: (value: TimeRange[]) => void;
  defaultData?: TimeRange[];
}

const FormItemMultiTimeRangePicker = ({ name, onChange, defaultData }: MultiTimeRangeProps) => {
  const [selectedTimes, setSelectedTimes] = useState<TimeRange[]>([]);
  const [tempRange, setTempRange] = useState<TimeRange | null>(null);

  const handleAddTimeRange = (val: TimeRange) => {
    if (val) {
      const updated = [...selectedTimes, val];
      setSelectedTimes(updated);
      setTempRange(null);
      onChange?.(updated);
    }
  };

  const handleRemoveTime = (index: number) => {
    const updated = selectedTimes.filter((_, i) => i !== index);
    setSelectedTimes(updated);
    onChange?.(updated);
  };
  useEffect(() => {
    if (defaultData && defaultData?.length > 0) {
      setSelectedTimes(defaultData);
    }
  }, [defaultData]);

  return (
    <Form.Item label='Thời gian đặc biệt' className='!mb-1' required>
      <TimePicker.RangePicker
        value={tempRange ?? undefined}
        format='HH:mm'
        onChange={(val) => {
          handleAddTimeRange(val as TimeRange);
        }}
        className='w-full'
      />
      <Space wrap>
        {(selectedTimes || []).map(([start, end], idx) => (
          <Tag
            key={idx.toString()}
            closable
            onClose={() => handleRemoveTime(idx)}
            className='!mr-0'
          >
            {dayjs(start).format('HH:mm')} - {dayjs(end).format('HH:mm')}
          </Tag>
        ))}
      </Space>
      <Form.Item
        name={name}
        hidden
        noStyle
        rules={[{ required: true, message: 'Vui lòng nhập khung giờ' }]}
      >
        <Input />
      </Form.Item>
    </Form.Item>
  );
};

export default FormItemMultiTimeRangePicker;
