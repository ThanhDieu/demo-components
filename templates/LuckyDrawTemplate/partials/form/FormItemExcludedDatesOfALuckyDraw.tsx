'use client';
import { IActionGameForm, IGameSpecialDate } from '@/interfaces/mini-app/luckyDraw.interfaces';
import { Button, Form, FormInstance, Input, Modal, Typography } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import { FormItemSpecicalDates } from '.';

export type TSpecialDates = {
  days?: any;
  dates?: Dayjs[];
};
type Props = {
  form: FormInstance<IActionGameForm>;
  defaultData?: IGameSpecialDate[];
};

const FormItemExcludedDatesOfALuckyDraw = ({ form, defaultData }: Props) => {
  const [openEditor, setOpenEditor] = useState<boolean>();
  const [content, setContent] = useState<TSpecialDates>();
  const check = useRef(false);

  const range = Form.useWatch('rangeDate', form);
  const handleChange = (value: TSpecialDates) => {
    setContent(value);
    form.setFieldValue('excludedDates', JSON.stringify(value));
  };
  const handleModal = () => {
    setOpenEditor(false);
  };

  const formatData = (value: IGameSpecialDate[]) => ({
    dates: (value || [])?.filter((item) => item.date)?.map((item) => dayjs(item?.date)),
    days: (value || [])?.filter((item) => item.day || item.day === 0)?.map((item) => item.day),
  });
  useEffect(() => {
    if (defaultData && !check?.current) {
      const dfData = formatData(defaultData);
      setContent(dfData);
      if (form)
        form.setFieldsValue({
          excludedDates: JSON.stringify(dfData),
        });
    }
    return () => {
      check.current = false;
    };
  }, [defaultData]);

  return (
    <div>
      <Form.Item name='excludedDates' noStyle>
        <Input.TextArea hidden></Input.TextArea>
      </Form.Item>
      <Form.Item label='Ngày không áp dụng'>
        <Button onClick={() => setOpenEditor(true)}>Cài đặt</Button>
      </Form.Item>
      {openEditor && (
        <Modal
          open={openEditor}
          onCancel={handleModal}
          onOk={handleModal}
          cancelButtonProps={{
            className: '!hidden',
          }}
          title='Ngày không áp dụng'
        >
          <FormItemSpecicalDates
            name={{
              dates: 'dates',
              days: 'days',
            }}
            onChange={handleChange}
            data={content}
            range={range}
            defaultData={defaultData ? formatData(defaultData) : undefined}
            form={form}
            isInit={check}
          />
          <Typography.Text>Thời gian không tích lượt chơi của chương trình</Typography.Text>
        </Modal>
      )}
    </div>
  );
};

export default FormItemExcludedDatesOfALuckyDraw;
