'use client';
import { getCommonStatus } from '@/common/apiStatus';
import { EEventType } from '@/common/enums';
import ModalCreation from '@/components/molecules/ModalCreation';
import { EZMPCommonStatus } from '@/enums/miniapp/mini-app.enums';
import { use__Name__Store } from '@/stores/@miniApp/use__Name__Store.store';
import { EditOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Form, Input, Select, Tag } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

const CreateUpdate__Name__Modal = () => {
  const t = useTranslations();
  const [form] = Form.useForm();
  const { current__Name__, setOpenModal: onOpenModal, openModal } = use__Name__Store();

  const handleCancel = () => {
    onOpenModal(undefined);
  };

  useEffect(() => {
    if (current__Name__ && openModal === EEventType.UPDATE) {
      form.setFieldsValue(current__Name__);
    }
  }, [current__Name__, openModal]);

  return (
    <ModalCreation
      open={!!openModal}
      headingTitle={
        t(openModal === EEventType.CREATE ? 'GENERAL.CREATE' : 'GENERAL.UPDATE') + ' __Name__'
      }
      headingIcon={openModal === EEventType.CREATE ? <PlusCircleOutlined /> : <EditOutlined />}
      okText={t(openModal === EEventType.CREATE ? 'GENERAL.CREATE' : 'GENERAL.UPDATE')}
      cancelText={t('GENERAL.CANCEL')}
      okButtonProps={{
        autoFocus: true,
        htmlType: 'submit',
      }}
      onCancel={handleCancel}
      destroyOnClose
      modalRender={(dom) => (
        <Form
          layout='vertical'
          form={form}
          name='form_in_modal'
          clearOnDestroy
          onFinish={(values) => {
            console.log(values);
          }}
        >
          {dom}
        </Form>
      )}
      classNameCustom='!pb-0'
    >
      <Form.Item
        name='name'
        label={t('GENERAL.NAME')}
        rules={[
          {
            required: true,
            message: t('GENERAL.PLEASE_INPUT', { field: t('GENERAL.NAME') }),
          },
        ]}
      >
        <Input
          style={{ width: '100%' }}
          placeholder={t('GENERAL.ENTER_INPUT', { field: t('GENERAL.NAME') })}
          maxLength={200}
        />
      </Form.Item>
      <Form.Item label={t('TENANT.STATUS')} name='status' initialValue={EZMPCommonStatus.ACTIVE}>
        <Select
          options={[EZMPCommonStatus.ACTIVE, EZMPCommonStatus.INACTIVE].map((item) => {
            const status = getCommonStatus(item);
            return {
              label: t(status?.label as any),
              value: item,
              color: status?.color,
            };
          })}
          optionRender={(option) => {
            return (
              <Tag color={option?.data.color} className='capitalize'>
                {option?.data?.label}
              </Tag>
            );
          }}
        />
      </Form.Item>
      <Form.Item
        name='description'
        label={t('GENERAL.DESCRIPTION')}
        rules={[
          {
            required: true,
            message: t('GENERAL.PLEASE_INPUT', { field: t('GENERAL.DESCRIPTION') }),
          },
        ]}
      >
        <Input.TextArea
          style={{ width: '100%' }}
          placeholder={t('GENERAL.ENTER_INPUT', { field: t('GENERAL.DESCRIPTION') })}
          maxLength={200}
        />
      </Form.Item>
    </ModalCreation>
  );
};

export default CreateUpdate__Name__Modal;
