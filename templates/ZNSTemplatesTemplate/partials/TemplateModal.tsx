'use client';
import ProtectedComponent from '@/components/atoms/ProtectedComponent';
import { UserInformation } from '@/components/molecules';
import { UserPermissionsObject } from '@/enums/auth.enums';
import { TemplateSample } from '@/interfaces/templates/templateSample.interface';
import { Env } from '@/libs/Env.mjs';
import { ROUTES_FE } from '@/routers';
import { useZaloOaStore } from '@/stores/useZaloOA.store';
import { Button, Modal, Tooltip } from 'antd';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

interface TemplateModalProps {
  modalData?: TemplateSample;
  isModalOpen: boolean;
  setIsModalOpen: (value: boolean) => void;
}

const TemplateModal: React.FC<TemplateModalProps> = ({
  modalData,
  isModalOpen,
  setIsModalOpen,
}) => {
  const { currentOa } = useZaloOaStore();
  const router = useRouter();
  const t = useTranslations();
  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const onSendMessage = () => {
    setIsModalOpen(false);
    if (!modalData) return;
    router.push(`${ROUTES_FE.TENANT.ZNS.TEMPLATES}/${modalData.id}`);
  };

  return (
    <div>
      <Modal
        title={modalData?.name}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <p className='mb-2'>{modalData?.description}</p>
        <div className='bg-[#d4d9fa] flex justify-center items-center p-6'>
          <Image
            src={`${Env.NEXT_PUBLIC_S3_HOST}/${modalData?.image}`}
            alt={modalData?.name ?? 'Image Description'}
            width={300}
            height={300}
            objectFit='cover'
          />
        </div>
        <div className='my-4 '>
          {/* <h4 className='font-semibold'>{t('TEMPLATE.CREATE_TEMPLATE_WITH')}</h4> */}
          <h4 className='font-semibold'>Tài khoản Zalo nhận mẫu ZNS</h4>

          <div className='flex justify-between items-center py-2'>
            <div className='flex items-center gap-2'>
              {!currentOa?.id ? (
                <span>{t('GENERAL.PLEASE_CHOOSE_ZALO_OA')} </span>
              ) : (
                <UserInformation
                  user={{
                    displayName: currentOa?.name || '',
                    avatar: currentOa?.zaloOAvatar || '',
                    email: '',
                    id: currentOa?.id || '',
                  }}
                />
              )}
            </div>
            <ProtectedComponent permission={UserPermissionsObject.REQUEST_TEMPLATE}>
              <Tooltip
                // title={!currentOa?.id ? t('GENERAL.PLEASE_CHOOSE_ZALO_OA') : ''}
                title={t('GENERAL.COMING_SOON')}
                placement='top'
              >
                <Button
                  type='primary'
                  onClick={onSendMessage}
                  // disabled={!currentOa?.id}
                  disabled //TODO
                >
                  {t('API_KEY.SELECT_TEMPLATE')}
                </Button>
              </Tooltip>
            </ProtectedComponent>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TemplateModal;
