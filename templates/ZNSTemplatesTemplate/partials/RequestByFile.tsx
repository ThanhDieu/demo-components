'use client';
import { useMutationCustom } from '@/hooks/useMutationCustom';
import { templateService } from '@/services/template.api';
import FileUtils from '@/utils/FileUtils';
import { DownloadOutlined, InboxOutlined, SendOutlined } from '@ant-design/icons';
import { Button, Flex, Form, Modal, Upload } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useTranslations } from 'next-intl';
import { toast } from 'react-toastify';

interface RequestByFileProps {
  openModal: boolean;
  onChangeModal: (value: boolean) => void;
}

const { Dragger } = Upload;

const RequestByFile: React.FC<RequestByFileProps> = ({ openModal, onChangeModal }) => {
  const t = useTranslations();
  const [form] = Form.useForm();

  const handleDownload = () => {
    const filePath = '/files/SampleFileRequest.xlsx';
    FileUtils.handleDownloadFile({
      linkFile: filePath,
      name: 'SampleFileRequest',
      ext: 'xlsx',
    });
  };

  const uploadTemplateRequestMutation = useMutationCustom<any, any>(
    templateService.uploadTemplateFile,
    {
      onSuccess: () => {
        toast.success(t('ZNS_TEMPLATE.SEND_SUCCESS'));
        onChangeModal(false);
      },
      onError: () => {
        toast.error(t('ZNS_TEMPLATE.SEND_FAILURE'));
        onChangeModal(false);
      },
    },
  );

  const onSubmit = (value: any) => {
    const formData = new FormData();
    formData.append('file', value?.file?.[0].originFileObj);
    formData.append('note', value?.note || '');
    uploadTemplateRequestMutation.mutate(formData);
  };
  return (
    <Modal
      open={openModal}
      width={600}
      title={
        <div className='border-0 border-b border-solid pb-2 border-neutral-200 '>
          {t('TEMPLATE.FILE_TEMPLATE_REQUEST')}
        </div>
      }
      onCancel={() => onChangeModal(false)}
      okButtonProps={{
        icon: <SendOutlined />,
        autoFocus: true,
        htmlType: 'submit',
      }}
      okText={t('GENERAL.SEND_REQUEST')}
      modalRender={(dom) => (
        <Form
          layout='vertical'
          form={form}
          name='form_in_modal'
          initialValues={{ modifier: 'public' }}
          clearOnDestroy
          onFinish={(values) => onSubmit(values)}
        >
          {dom}
        </Form>
      )}
    >
      <Flex justify='space-between' align='center' className='mb-4'>
        <p>{t('TEMPLATE.FILE_REQUEST_NOTE')}</p>
        <Button icon={<DownloadOutlined />} iconPosition='start' onClick={handleDownload}>
          {t('TEMPLATE.DOWNLOAD_TEMPLATE')}
        </Button>
      </Flex>
      <div>
        <Form.Item
          name='file'
          rules={[{ required: true }]}
          valuePropName='fileList'
          getValueFromEvent={FileUtils.normFile}
        >
          <Dragger maxCount={1} listType='picture' accept='.xlsx' beforeUpload={() => false}>
            <p className='ant-upload-drag-icon'>
              <InboxOutlined />
            </p>
            <p className='ant-upload-text'>{t('TEMPLATE.UPLOAD_BOX_NOTE')}</p>
          </Dragger>
        </Form.Item>
        <Form.Item label='Note' name='note'>
          <TextArea cols={2}></TextArea>
        </Form.Item>
      </div>
    </Modal>
  );
};

export default RequestByFile;
