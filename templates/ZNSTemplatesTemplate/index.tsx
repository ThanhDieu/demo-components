'use client';
import { EEventType } from '@/common/enums';
import ProtectedComponent from '@/components/atoms/ProtectedComponent';
import { LayoutContent } from '@/components/organisms';
import { UserPermissionsObject } from '@/enums/auth.enums';
import { ROUTES_FE } from '@/routers';
import { useCategoryStore } from '@/stores/useCategory.store';
import { useTemplateStore } from '@/stores/useTemplate.store';
import { useTemplateSampleStore } from '@/stores/useTemplateSample.store';
import { useZaloOaStore } from '@/stores/useZaloOA.store';
import { useZNSTemplateStore } from '@/stores/useZNSTemplate.store';
import { PlusCircleOutlined, SearchOutlined } from '@ant-design/icons';
import { Button, Card, Flex, Input, Select, Tooltip } from 'antd';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import { FaRegFileAlt } from 'react-icons/fa';
import { RequestByFile, TemplateModal, TemplateSection } from './partials';
import './style.scss';

const ZnsTemplate = () => {
  const t = useTranslations();
  const [search, setSearch] = useState('');
  const [openModal, setOpenModal] = useState<EEventType>();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { currentOa } = useZaloOaStore();
  const { isModalOpen, modalData, setIsModalOpen } = useTemplateStore();
  const router = useRouter();
  const { resetField, setStep } = useZNSTemplateStore();
  const categories = useCategoryStore((state) => state.categories);
  const templateSamples = useTemplateSampleStore((state) => state.templateSamples);
  const categoryOptions = useMemo(() => {
    const categoryOptions = categories.map((template) => ({
      value: template.id,
      label: template.name,
    }));
    return [{ value: 'all', label: 'Tất cả' }, ...categoryOptions];
  }, [categories]);

  const categoryFilter = useMemo(() => {
    if (selectedCategory === 'all') return categories;
    return categories.filter((category) => category.id === selectedCategory);
  }, [selectedCategory]);

  const templateFilter = useMemo(() => {
    if (search == '') return templateSamples;
    return templateSamples.filter((template) =>
      template.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [templateSamples, search]);
  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  useEffect(() => {
    resetField();
    setStep(1);
  }, []);

  return (
    <LayoutContent
      title={t('TENANT.ZNS_TEMPLATE_LIBRARY')}
      permission={UserPermissionsObject.LIST_TEMPLATE_LIBRARY}
      extra={
        <ProtectedComponent permission={UserPermissionsObject.REQUEST_TEMPLATE}>
          <Tooltip title={!currentOa?.id && t('GENERAL.PLEASE_CHOOSE_ZALO_OA')} placement='top'>
            <Button
              type='primary'
              icon={<PlusCircleOutlined />}
              disabled={!currentOa?.id}
              onClick={() => router.push(ROUTES_FE.TENANT.ZNS.TEMPLATES + '/create')}
            >
              {t('GENERAL.CREATE')} {t('GENERAL.ZNS_TEMPLATE')}
            </Button>
          </Tooltip>
        </ProtectedComponent>
      }
    >
      <Card
        bordered={false}
        title={
          <Input
            placeholder='Tìm theo tên mẫu ZNS'
            style={{ width: 320 }}
            addonBefore={<SearchOutlined />}
            onChange={onSearch}
          />
        }
        extra={
          <Flex className='gap-2'>
            <div className='flex gap-4 items-center'>
              <label className='font-semibold'>{t('SERVICE.FIELDS')}</label>
              <Select
                defaultValue='all'
                onChange={setSelectedCategory}
                style={{ width: 260 }}
                options={categoryOptions}
              />
            </div>
            <ProtectedComponent permission={UserPermissionsObject.REQUEST_TEMPLATE}>
              <Tooltip title={!currentOa?.id && t('GENERAL.PLEASE_CHOOSE_ZALO_OA')} placement='top'>
                <Button
                  icon={<FaRegFileAlt />}
                  ghost
                  type='primary'
                  disabled={!currentOa?.id}
                  onClick={() => setOpenModal(EEventType.UPLOAD)}
                >
                  {t('TENANT.THE_REQUIRED_FILE_TEMPLATE')}
                </Button>
              </Tooltip>
            </ProtectedComponent>
          </Flex>
        }
      >
        {categoryFilter.map((category) => (
          <TemplateSection key={category.id} category={category} templateSamples={templateFilter} />
        ))}
        <TemplateModal
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          modalData={modalData}
        />
      </Card>

      {openModal === EEventType.UPLOAD && (
        <RequestByFile openModal={!!openModal} onChangeModal={() => setOpenModal(undefined)} />
      )}
      {/* {openModal === EEventType.CREATE && <RequestByFile openModal={!!openModal} onChangeModal={() => setOpenModal(undefined)} />} */}
    </LayoutContent>
  );
};

export default ZnsTemplate;
