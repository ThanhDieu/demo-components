'use client';
import { ReactQuillEditor } from '@/components/atoms';
import { IActionGameForm } from '@/interfaces/mini-app/luckyDraw.interfaces';
import { Button, Form, FormInstance, Input, Modal } from 'antd';
import { useEffect, useState } from 'react';

type Props = {
  form: FormInstance<IActionGameForm>;
  defaultData?: string;
};

const FormItemDesOfALuckyDraw = ({ form, defaultData }: Props) => {
  const [openEditor, setOpenEditor] = useState<boolean>();
  const [content, setContent] = useState<string>();
  const handleSendComment = (value: string) => {
    setContent(value);
    form.setFieldValue('description', value);
  };
  const handleModal = () => {
    setOpenEditor(false);
  };
  useEffect(() => {
    if (defaultData) {
      setContent(defaultData);
    }
  }, [defaultData, form]);
  return (
    <div>
      <Form.Item name='description' noStyle>
        <Input.TextArea hidden></Input.TextArea>
      </Form.Item>
      <Form.Item label='Thể lệ chương trình'>
        <Button type='link' onClick={() => setOpenEditor(true)}>
          Mô tả thể lệ
        </Button>
      </Form.Item>
      {openEditor && (
        <Modal
          open={openEditor}
          onCancel={handleModal}
          onOk={handleModal}
          cancelButtonProps={{
            className: '!hidden',
          }}
          title='Mô tả thể lệ chương trình'
        >
          <ReactQuillEditor value={content || ''} onChange={handleSendComment} />
        </Modal>
      )}
    </div>
  );
};

export default FormItemDesOfALuckyDraw;
