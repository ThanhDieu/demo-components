'use client';

import { LoadingMini } from '@/components/atoms';
import { useMutationCustom } from '@/hooks/useMutationCustom';
import { IZNSParams } from '@/interfaces/templates/template.interface';
import { ROUTES_FE } from '@/routers';
import { templateService } from '@/services/template.api';
import {
  ArrowLeftOutlined,
  BookOutlined,
  CloseCircleOutlined,
  SendOutlined,
} from '@ant-design/icons';
import { Button, Card, Form } from 'antd';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { ModalTemplateSample, prepareDataBeforeSendZNS } from '.';
import {
  extractTemplateParams,
  IFormZNSType,
  RenderStepOne,
  RenderStepTwo,
  useZNSTemplateDetails,
} from './FormZNSComponent';

interface FormRequestProps {}

const FormRequest: React.FC<FormRequestProps> = () => {
  const router = useRouter();
  const t = useTranslations();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const {
    formZNSDetails: form,
    stateZNSTemplateStore,
    idDetails,
    isCreate,
    znsTemplateId,
  } = useZNSTemplateDetails();
  const {
    loading,
    selectedItemZNSTemplate,
    setSelectedItemZNSTemplate,
    commonZNSTemplate,
    resetField,
    step,
    setStep,
    defaultZNSTemplate,
  } = stateZNSTemplateStore;

  const resetForm = () => {
    form?.resetFields();
    resetField();
    setStep(1);
  };
  useEffect(() => {
    if (!!isCreate && !znsTemplateId && commonZNSTemplate) {
      const firstType = commonZNSTemplate?.type?.[0];
      setSelectedItemZNSTemplate('type', firstType);
      const firstTag = firstType?.validTags?.[0];
      const findTag = commonZNSTemplate?.tag?.find((t) => t.value === firstTag);
      if (findTag) {
        setSelectedItemZNSTemplate('tag', findTag);
      }
    }
  }, [commonZNSTemplate, isCreate, znsTemplateId]);

  const templateRequestMutation = useMutationCustom<any, any>(
    async ({ params }: { params: any }) => {
      if (idDetails) return templateService.updateCustomTemplate(idDetails, params);
      return templateService.createCustomTemplate(params);
    },
    {
      onSuccess: () => {
        toast.success(t('ZNS_TEMPLATE.SEND_SUCCESS'));
        resetForm();
        router.push(ROUTES_FE.TENANT.ZNS.TEMPLATE_MANAGEMENT);
      },
      onError: (err) => {
        toast.error(err?.message || t('ZNS_TEMPLATE.SEND_FAILURE'));
        // resetForm();
      },
    },
  );

  const onFinished = (formvalues: IFormZNSType) => {
    const params = prepareDataBeforeSendZNS(
      formvalues,
      selectedItemZNSTemplate,
      defaultZNSTemplate,
    );
    if (step === 1) {
      const paramString = extractTemplateParams({
        otp: formvalues?.otp,
        title: formvalues?.title,
        layout: formvalues?.layout,
        buttons: formvalues?.buttons,
        ratings: formvalues?.ratings,
        voucher: formvalues?.voucher,
        payment: formvalues?.payment,
      });
      form.setFieldValue(
        'params',
        paramString.map((item) => {
          const valueItem = formvalues?.params?.find((el: IZNSParams) => el.name === item);
          return {
            ...valueItem,
            name: item,
            type: Number(valueItem?.type || 1),
            sample_value: valueItem?.sample_value || '',
          };
        }),
      );

      setStep(2);
    } else {
      templateRequestMutation.mutate({ params });
      // console.log(params, '===>CREATE<====');
    }
  };

  const items = [
    {
      title: t('TEMPLATE.DECLARE_CONTENT'),
      content: <RenderStepOne />,
    },
    {
      title: t('ZNS_TEMPLATE.SEND_APPROVAL'),
      content: <RenderStepTwo />,
    },
  ];
  return (
    <div>
      <Card
        bordered={false}
        title={<h1 className='font-bold text-lg mb-0'>{items[step - 1]?.title}</h1>}
        extra={
          step === 1 && (
            <Button
              onClick={() => {
                setIsModalOpen(true);
              }}
              icon={<BookOutlined />}
              disabled
            >
              {t('TEMPLATE.CHOOSE_FROM_LIBRARY')}
            </Button>
          )
        }
        actions={[
          <div className='flex justify-start !px-4'>
            <LoadingMini key='2' spinning={templateRequestMutation.isLoading}>
              <Button
                type='default'
                icon={step === 1 ? <CloseCircleOutlined /> : <ArrowLeftOutlined />}
                onClick={() => {
                  if (step === 1) {
                    resetForm();
                    router.push(ROUTES_FE.TENANT.ZNS.TEMPLATES);
                  } else {
                    setStep(1);
                  }
                }}
                disabled={loading}
              >
                {step === 1 ? t('GENERAL.CANCEL') : t('GENERAL.BACK')}
              </Button>
            </LoadingMini>
          </div>,
          <div key='1' className='flex justify-end !px-4'>
            <LoadingMini spinning={templateRequestMutation.isLoading}>
              <Button
                type='primary'
                onClick={() => form.submit()}
                icon={<SendOutlined />}
                disabled={loading}
              >
                {step === 1 ? t('GENERAL.CONTINUE') : t('GENERAL.SEND_REQUEST')}
              </Button>
            </LoadingMini>
          </div>,
        ]}
        classNames={{
          body: 'custom-scrollbar min-h-[50vh] h-[calc(100vh_-_295px)] overflow-auto overflow-x-hidden ',
        }}
      >
        <Form onFinish={onFinished} autoComplete='off' layout='vertical' form={form} clearOnDestroy>
          <div className={step === 1 ? 'block' : '!hidden'}>{items[0]?.content}</div>
          <div className={step === 2 ? 'block' : '!hidden'}>{items[1]?.content}</div>
        </Form>
      </Card>

      <ModalTemplateSample isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} />
    </div>
  );
};

export default FormRequest;
