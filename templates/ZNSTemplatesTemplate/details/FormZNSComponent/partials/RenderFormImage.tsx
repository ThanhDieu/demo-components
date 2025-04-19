import { ImageCrop } from '@/components/molecules';
import { templateService } from '@/services/template.api';
import { useZNSTemplateStore } from '@/stores/useZNSTemplate.store';
import FileUtils from '@/utils/FileUtils';
import StringUtils from '@/utils/StringUtils';
import { Card, Form } from 'antd';
import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';

const RenderFormImage = () => {
  const t = useTranslations();
  const { setSelectedItemZNSTemplate, resetField, selectedItemZNSTemplate } = useZNSTemplateStore();
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = (values: any[]) => {
    if (selectedItemZNSTemplate?.banner && selectedItemZNSTemplate?.banner?.length > 0) {
      const newList = selectedItemZNSTemplate?.banner.filter((banner) =>
        values?.some((value) => value?.uid === banner?.uid),
      );
      setSelectedItemZNSTemplate('banner', newList);
    }
  };
  const handleOkImageUpload = async (image: any) => {
    if (!image) return;

    setIsLoading(true);
    const formData: any = new FormData();
    formData.append('file', image);
    const res = await templateService.uploadImage(formData);
    resetField('logo');
    if (res?.data) {
      const list = [
        ...(selectedItemZNSTemplate?.banner || []),
        {
          uid: image.uid,
          media_id: res?.data?.mediaId,
          ...res?.data,
        },
      ];
      setSelectedItemZNSTemplate('banner', list);
    }
    setIsLoading(false);
  };
  const banner = useMemo(() => {
    if (!selectedItemZNSTemplate?.banner) return [];
    return selectedItemZNSTemplate?.banner?.map((item) =>
      StringUtils.formatImageUrl(item?.fileUrl),
    );
  }, []);
  return (
    <Card size='small' title={t('ZNS_TEMPLATE.IMAGE')}>
      <Form.Item
        name='banner'
        valuePropName='fileList'
        getValueFromEvent={FileUtils.normFile}
        rules={[
          {
            required: true,
            message: t('GENERAL.PLEASE_INPUT', { field: t('OACONTENT.IMAGE') }),
          },
        ]}
        initialValue={banner}
      >
        <ImageCrop
          defaultImage={banner}
          size={0.5}
          aspect={16 / 9}
          accept='image/jpg,image/png'
          max={3}
          disabled={isLoading}
          onOk={handleOkImageUpload}
          onChange={handleUpload}
        />
      </Form.Item>
      <div className='text-gray-500'>
        {t('ZALO_OA.DESCRIPTION_IMAGE', {
          number: '16:9',
          size: '500 KB',
          type: '(JPG, PNG)',
        })}
      </div>
    </Card>
  );
};

export default RenderFormImage;
