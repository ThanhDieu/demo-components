import { LoadingMini } from '@/components/atoms';
import { ImageCrop } from '@/components/molecules';
import { useQueryCustom } from '@/hooks/useQueryCustom';
import { IOAAsset } from '@/interfaces/oa.interfaces';
import { oaManagerService } from '@/services/oa-managment';
import { templateService } from '@/services/template.api';
import { useZaloOaStore } from '@/stores/useZaloOA.store';
import { useZNSTemplateStore } from '@/stores/useZNSTemplate.store';
import StringUtils from '@/utils/StringUtils';
import { UploadOutlined } from '@ant-design/icons';
import { Card, Col, Divider, Form, Image, Input, Modal, Row } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useZNSTemplateDetails } from '..';

const RenderFormLogo = () => {
  const t = useTranslations();
  const { setSelectedItemZNSTemplate, resetField, selectedItemZNSTemplate } = useZNSTemplateStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentOa } = useZaloOaStore();

  const { isLoading } = useQueryCustom<IOAAsset[]>(
    [currentOa],
    async () => {
      return oaManagerService.getAssets({
        zaloOAId: currentOa?.id,
        assetType: 'ZNS_LOGO',
      });
    },
    {
      onSuccess: (res) => {
        let firstLight;
        let firstDark;
        if (!selectedItemZNSTemplate?.logo?.light?.fileUrl) {
          firstLight = res?.data?.find((item) => item?.assetData?.uploadType === 'LIGHT_LOGO');
        }
        if (!selectedItemZNSTemplate?.logo?.dark?.fileUrl) {
          firstDark = res?.data?.find((item) => item?.assetData?.uploadType === 'DARK_LOGO');
        }
        if (firstLight && firstDark)
          setSelectedItemZNSTemplate('logo', {
            light: {
              ...firstLight?.assetData,
              fileUrl: firstLight?.assetS3Key,
            },
            dark: {
              ...firstDark?.assetData,
              fileUrl: firstDark?.assetS3Key,
            },
          });
      },
      enabled:
        !!currentOa?.id &&
        !(selectedItemZNSTemplate?.logo?.light && selectedItemZNSTemplate?.logo?.dark),
    },
  );

  const handleLogoImageUpload = async (image: any, type: 'light' | 'dark') => {
    if (!image) return;
    setLoading?.(true);
    resetField('banner');
    const formData: any = new FormData();
    formData.append('file', image);
    formData.append('uploadType', type === 'dark' ? 'DARK_LOGO' : 'LIGHT_LOGO');
    const res = await templateService.uploadImage(formData);
    if (res?.data) {
      await setSelectedItemZNSTemplate('logo', {
        ...selectedItemZNSTemplate?.logo,
        [type]: {
          media_id: res?.data?.mediaId,
          ...res.data,
        },
      });
      setLoading?.(false);
    }
  };

  return (
    <>
      <Card
        title={
          <div>
            <span className='text-error'>*</span> {t('ZNS_TEMPLATE.LOGO')}
          </div>
        }
        size='small'
      >
        <div className='text-xs text-gray-500'>
          {t('ZNS_TEMPLATE.LOGO_DES')}{' '}
          <span
            className='cursor-pointer text-primary'
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsModalOpen(true);
            }}
          >
            {t('ZNS_TEMPLATE.HERE')}
          </span>
        </div>
        <Form.Item>
          <Row className='!mt-3 max-w-[700px]' gutter={[16, 16]}>
            <Col span={12}>
              <LoadingMini spinning={loading || isLoading}>
                <LogoUploadField
                  label={t('ZNS_TEMPLATE.LIGHT')}
                  name='light'
                  fileUrl={selectedItemZNSTemplate?.logo?.light?.fileUrl}
                  onUpload={(value: any) => handleLogoImageUpload(value, 'light')}
                  loading={loading}
                />
              </LoadingMini>
            </Col>
            <Col span={12}>
              <LoadingMini spinning={loading || isLoading}>
                <LogoUploadField
                  label={t('ZNS_TEMPLATE.DARK')}
                  name='dark'
                  fileUrl={selectedItemZNSTemplate?.logo?.dark?.fileUrl}
                  onUpload={(value: any) => handleLogoImageUpload(value, 'dark')}
                  loading={loading}
                  additionalClasses='bg-bgDark'
                  iconClasses='!text-white'
                />
              </LoadingMini>
            </Col>
          </Row>
        </Form.Item>
        <div className='text-gray-500'>
          {t('ZALO_OA.DESCRIPTION_IMAGE', {
            number: '400x96',
            size: '5MB',
            type: '(PNG)',
          })}
        </div>
      </Card>
      {/* modal */}
      <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => setIsModalOpen(false)}
        centered
        width={500}
        cancelButtonProps={{ className: '!hidden' }}
      >
        <div className='p-4'>
          <h2 className='text-lg font-semibold'>{t('ZNS_TEMPLATE.MODAL_IMAGE.TITLE')}</h2>
          <Divider className='!border-neutral-500' />

          <ul className='list-disc pl-5 text-sm text-gray-700 mt-3'>
            <li className='mb-1'>{t('ZNS_TEMPLATE.MODAL_IMAGE.DES_1')}</li>
            <li className='mb-1'>{t('ZNS_TEMPLATE.MODAL_IMAGE.DES_2')}.</li>
            <li className='mb-1'>{t('ZNS_TEMPLATE.MODAL_IMAGE.DES_3')}</li>
          </ul>

          {/* Hình ảnh minh họa */}
          <div className='flex mt-4 gap-2'>
            <Image
              src='https://stc-oa.zdn.vn/resources/zca-tool/static/media/logo-hint.207e84ac.svg'
              alt='Logo Guidelines'
              className='w-full'
              preview={false}
            />
            <div>
              <div className='flex gap-2 items-center'>
                <div className='w-4 h-4 bg-[#939ff4]'></div>
                <div>{t('ZNS_TEMPLATE.MODAL_IMAGE.SCOPE_LOGO')}</div>
              </div>
              <div className='flex gap-2 items-center'>
                <div className='w-4 h-4 bg-[#d34f49]'></div>
                <div>{t('ZNS_TEMPLATE.MODAL_IMAGE.SCOPE_SAVE')}</div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};
const LogoUploadField = ({
  label,
  name,
  fileUrl,
  onUpload,
  loading,
  additionalClasses = '',
  iconClasses = '',
}: any) => {
  const t = useTranslations();
  const { formZNSDetails, stateZNSTemplateStore } = useZNSTemplateDetails();
  const { selectedItemZNSTemplate } = stateZNSTemplateStore;

  useEffect(() => {
    const logo = (selectedItemZNSTemplate?.logo as any)?.[name];
    if (logo) {
      formZNSDetails.setFieldValue(name, logo);
      formZNSDetails.validateFields([name]);
    } else {
      formZNSDetails.resetFields([name]);
    }
  }, [formZNSDetails, selectedItemZNSTemplate?.logo]);
  return (
    <>
      <Form.Item label={label} className={`w-full relative !h-40`}>
        <ImageCrop
          defaultImage={StringUtils.formatImageUrl(fileUrl || '')}
          aspect={400 / 96}
          onOk={onUpload}
          disabled={loading}
          accept='image/png'
          listType='text'
          showUploadList={false}
        >
          <div
            className={`cursor-pointer hover:border-primary hover:opacity-80 text-center h-40 w-[300px] flex flex-col items-center justify-center rounded-md border border-gray-300 border-dashed ${additionalClasses}`}
          >
            {fileUrl ? (
              <div className='p-3'>
                <Image
                  src={StringUtils.formatImageUrl(fileUrl)}
                  preview={false}
                  className='w-full h-auto'
                />
              </div>
            ) : (
              <div>
                <UploadOutlined className={iconClasses} />
                <div className={iconClasses}>Tải ảnh mới</div>
              </div>
            )}
          </div>
        </ImageCrop>
      </Form.Item>
      <Form.Item
        name={name}
        rules={[{ required: true, message: t('GENERAL.PLEASE_INPUT', { field: label }) }]}
        className='!mb-0 '
        style={{ marginTop: -30 }}
      >
        <Input hidden size='small' />
      </Form.Item>
    </>
  );
};
export default RenderFormLogo;
