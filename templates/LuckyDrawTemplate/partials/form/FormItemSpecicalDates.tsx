'use client';
import { ZMPWeekdaysOptions } from '@/enums/miniapp/mini-app.enums';
import { IActionGameForm } from '@/interfaces/mini-app/luckyDraw.interfaces';
import { DatePicker, Form, FormInstance, Select } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { MutableRefObject, useEffect } from 'react';
import { TSpecialDates } from './FormItemExcludedDatesOfALuckyDraw';

type Props = {
  name: {
    days: (string | number)[] | string;
    dates: (string | number)[] | string;
  };
  onChange?: (value?: any) => void;
  data?: any;
  range: [Dayjs | null, Dayjs | null];
  defaultData?: TSpecialDates;
  form?: FormInstance<IActionGameForm>;
  isInit?: MutableRefObject<boolean>;
};

const FormItemSpecicalDates = ({
  name,
  onChange,
  data,
  range,
  defaultData,
  form,
  isInit,
}: Props) => {
  const disabledDate = (current: Dayjs) => {
    const today = dayjs().startOf('day');
    const [startDate, endDate] = range || [];

    return (
      current.isBefore(today, 'day') ||
      current.isBefore(startDate, 'day') ||
      current.isAfter(endDate, 'day')
    );
  };
  useEffect(() => {
    if (defaultData && form && isInit && !isInit?.current) {
      form.setFieldsValue({
        [name.dates as string]: defaultData?.dates,
        [name.days as string]: defaultData?.days,
      });
      isInit.current = true;
    }
  }, [defaultData]);
  return (
    <>
      <Form.Item layout='vertical' name={name?.days} label='Các thứ' className='!mb-1'>
        <Select
          mode='multiple'
          placeholder='Chọn nhiều thứ'
          options={ZMPWeekdaysOptions}
          maxTagCount='responsive'
          onChange={(value) =>
            onChange?.({
              ...data,
              days: value,
            })
          }
          allowClear
        />
      </Form.Item>
      <Form.Item name={name?.dates} label='Các ngày' layout='vertical'>
        <DatePicker
          multiple
          onChange={(value) =>
            onChange?.({
              ...data,
              dates: value,
            })
          }
          disabledDate={disabledDate}
          placeholder='Chọn nhiều ngày'
        />
      </Form.Item>
    </>
  );
};
export default FormItemSpecicalDates;
