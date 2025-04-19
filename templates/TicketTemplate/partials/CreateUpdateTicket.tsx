'use client';

import { LoadingMini, RichTextTyniMCEditor } from '@/components/atoms';
import ModalCreation from '@/components/molecules/ModalCreation';
import SelectUserStore from '@/components/molecules/SelectUserStore';
import { ETicketPriority, ETicketStatus } from '@/enums/ticket.enums';
import { IActionTicket } from '@/interfaces/task.interfaces';
import { oaContentService } from '@/services/oa-managment';
import { useZaloOaStore } from '@/stores/useZaloOA.store';
import FileUtils from '@/utils/FileUtils';
import { InboxOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Badge, Flex, Form, Input, Select, Tag, Upload } from 'antd';
import { useTranslations } from 'next-intl';
import { FC, useEffect, useState } from 'react';
import { getPriorityTag, getStatusTag } from '.';
import { useTicketContextStore } from './context';

interface Props {}

const CreateUpdateTicketModal: FC<Props> = () => {
  const t = useTranslations();
  const [form] = Form.useForm();
  const { openModal, onOpenModal, onActionTicket, selectedDetail, paramsQuery, isActionLoading } =
    useTicketContextStore();
  const [loading, setLoading] = useState(false);
  const { currentOa, zaloOas } = useZaloOaStore();

  const handleFinish = async (values: IActionTicket) => {
    const { files, ...resForm } = values;
    if (files?.length) {
      setLoading(true);
      const uploadPromises = files.map(async (file) => {
        if (file?.originFileObj) {
          const formData: any = new FormData();
          formData.append('file', file.originFileObj);
          const res = await oaContentService.uploadFile(formData);
          return res?.data?.fileUrl;
        }
        return file?.url;
      });

      const tempFiles = values.attachments?.filter(
        (item) =>
          !files?.some((file) => file?.url && item === file?.url) && values?.content.includes(item),
      );
      const uploadedAttachments = await Promise.all(uploadPromises);
      resForm.attachments = Array.from(new Set([...(tempFiles || []), ...uploadedAttachments]));
    }
    onActionTicket?.(selectedDetail?.id, resForm, openModal);
    setLoading(false);
  };

  useEffect(() => {
    if (selectedDetail?.id) {
      form.setFieldsValue({
        ...selectedDetail,
        files: selectedDetail?.attachments?.map((file, index) => ({
          uid: `-${index}`,
          name: `file${index}.png`,
          status: 'done',
          url: file,
        })),
      });
    }
  }, [selectedDetail]);

  return (
    <ModalCreation
      headingTitle={t(('TICKET.' + `${openModal?.toUpperCase()}_TICKET`) as any)}
      headingIcon={<PlusCircleOutlined />}
      open={!!openModal}
      onCancel={() => onOpenModal(undefined)}
      okText={t(('GENERAL.' + openModal?.toUpperCase()) as any)}
      cancelText={t('GENERAL.CANCEL')}
      okButtonProps={{
        autoFocus: true,
        htmlType: 'submit',
        onClick: () => form.submit(),
        disabled: loading || isActionLoading,
      }}
      className='!w-[800px]'
    >
      <LoadingMini spinning={loading || isActionLoading}>
        <Form layout='vertical' form={form} onFinish={handleFinish} autoComplete='off'>
          <Flex className='gap-4'>
            <Form.Item
              name='title'
              label={t('TICKET.TICKET_NAME')}
              rules={[
                {
                  required: true,
                  message: t('TICKET.PLEASE_ENTER_TICKET_NAME'),
                },
              ]}
              className='w-2/3'
            >
              <Input className='w-full' placeholder={t('TICKET.PLEASE_ENTER_TICKET_NAME')} />
            </Form.Item>
            <Form.Item
              label={t('TENANT.STATUS')}
              name='status'
              initialValue={ETicketStatus.OPEN}
              className='w-1/3'
            >
              <Select
                options={[
                  ETicketStatus.OPEN,
                  ETicketStatus.IN_PROGRESS,
                  ETicketStatus.RESOLVED,
                  ETicketStatus.CLOSED,
                ].map((item) => ({
                  text: item.toUpperCase(),
                  value: item,
                }))}
                optionRender={(option) => {
                  return (
                    <Tag color={getStatusTag(option.data.value)} className='capitalize'>
                      {option.data.text}
                    </Tag>
                  );
                }}
              />
            </Form.Item>
          </Flex>
          <Flex className='gap-4'>
            <Form.Item className='w-2/3 !mb-0'>
              <SelectUserStore title={t('TICKET.ASSIGNEE')} name='assigneeId' isRequired={true} />
            </Form.Item>
            <Form.Item
              label={t('SETTING_FALLBACK.PRIORITY')}
              name='priority'
              initialValue={ETicketPriority.LOW}
              className='w-1/3'
            >
              <Select
                options={[
                  ETicketPriority.URGENT,
                  ETicketPriority.HIGH,
                  ETicketPriority.MEDIUM,
                  ETicketPriority.LOW,
                ].map((item) => ({
                  text: item.toUpperCase(),
                  value: item,
                }))}
                optionRender={(option) => {
                  return (
                    <Tag color={getPriorityTag(option.data.value)}>
                      <div className='capitalize'>
                        <Badge
                          color={getPriorityTag(option.data.value)}
                          text={<span className='!text-xs'> {option.data.text}</span>}
                        />
                      </div>
                    </Tag>
                  );
                }}
              />
            </Form.Item>
          </Flex>
          <Form.Item
            name='content'
            label={t('TICKET.CONTENT')}
            initialValue={paramsQuery?.message}
            rules={[
              {
                required: true,
                message: t('GENERAL.PLEASE_INPUT', {
                  field: t('OACONTENT.POST_CONTENT'),
                }),
              },
            ]}
          >
            <RichTextTyniMCEditor
              value={selectedDetail?.content || paramsQuery?.message || ''}
              onChange={(value) => {
                form.setFieldValue('content', value);
              }}
              height={300}
              zaloOAIds={currentOa?.id || (zaloOas || [])?.map((item) => item?.id)?.join(',') || ''}
              isContent={true}
              onGetMedia={(values) => {
                form.setFieldValue('attachments', values);
              }}
            />
          </Form.Item>
          <Form.Item name='attachments' hidden noStyle>
            <Select mode='multiple' />
          </Form.Item>
          <Form.Item label={t('TICKET.ATTACHMENT')} className='!mb-0'>
            <Form.Item
              name='files'
              valuePropName='fileList'
              getValueFromEvent={FileUtils.normFile}
              noStyle
            >
              <Upload.Dragger
                name='files'
                listType='picture-card'
                className='!flex flex-col gap-2'
                accept='image/png, image/jpg, image/jpeg, .csv, .xlsx, .docx, .doc, .mp4'
              >
                <Flex justify='center' align='center' className='gap-4'>
                  <p className='!mb-0 ant-upload-drag-icon'>
                    <InboxOutlined />
                  </p>
                  <p className='!mb-0'>{t('TEMPLATE.UPLOAD_BOX_NOTE')}</p>
                </Flex>
              </Upload.Dragger>
            </Form.Item>
          </Form.Item>
        </Form>
      </LoadingMini>
    </ModalCreation>
  );
};

export default CreateUpdateTicketModal;
