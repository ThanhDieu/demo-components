'use client';
import { useCategoryStore } from '@/stores/useCategory.store';
import { useTemplateSampleStore } from '@/stores/useTemplateSample.store';
import { Modal, Tabs, TabsProps } from 'antd';
import { useTranslations } from 'next-intl';
import React from 'react';
import { TemplateCard } from '../partials';

interface ModalTemplateSampleProps {
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
}

const ModalTemplateSample: React.FC<ModalTemplateSampleProps> = ({
  isModalOpen,
  setIsModalOpen,
}) => {
  const t = useTranslations();
  const { templateSamples } = useTemplateSampleStore((state) => state);
  const { categories } = useCategoryStore((state) => state);

  const items: TabsProps['items'] = categories?.map((category) => {
    const categoryTemplateSamples = templateSamples?.filter(
      (templateSample) => templateSample.categoryId === category.id,
    );
    return {
      key: category.id,
      label: category.name,
      children: (
        <div className='w-full flex flex-wrap gap-4'>
          {categoryTemplateSamples?.map((templateSample) => {
            return <TemplateCard key={templateSample?.id} data={templateSample} mode='inModal' />;
          })}
        </div>
      ),
    };
  });

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <Modal
      title={t('TENANT.ZNS_TEMPLATE_LIBRARY')}
      width={800}
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
    >
      <Tabs defaultActiveKey='1' items={items} />
    </Modal>
  );
};

export default ModalTemplateSample;
