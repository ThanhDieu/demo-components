'use client';
import { LoadingDashboard } from '@/components/atoms/LoadingComponent';
import { useBreadcrumb } from '@/components/organisms/partials/Breadcrumb/context';
import { TemplateStatus } from '@/interfaces/templates/template.interface';
import { ROUTES_FE } from '@/routers';
import { useTemplateRequestStore } from '@/stores/useTemplateRequest';
import { useTemplateSampleStore } from '@/stores/useTemplateSample.store';
import { useZaloOaStore } from '@/stores/useZaloOA.store';
import { useZNSTemplateStore } from '@/stores/useZNSTemplate.store';
import { Alert, Steps } from 'antd';
import { useTranslations } from 'next-intl';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { FormRequest, PreviewTemplate } from './details';
import { ZNSTemplateDetailsProvider } from './details/context';

const TemplateDetailsRequestForm = ({ params }: { params: { id: string } }) => {
  const t = useTranslations();
  const { setSelectedTemplate, templateSamples } = useTemplateSampleStore();
  const { getTemplateById, loading } = useTemplateRequestStore((state) => state);
  const znsTemplateId = useSearchParams().get('znsTemplateId');
  const idDetails = params?.id || znsTemplateId;
  const { currentOa } = useZaloOaStore();
  const { fetchCommonZNSList, commonZNSTemplate, step, setDefaultZNSTemplate, setStep } =
    useZNSTemplateStore();
  const router = useRouter();
  const isZNSDetail = useMemo(() => !!Number(params?.id), [params?.id]);
  //Breadcrumb
  const { setTitle } = useBreadcrumb();
  useEffect(() => {
    setTitle(isZNSDetail ? t('TENANT.DETAIL') : t('BREADCRUMB.create'));

    return () => {
      setTitle();
    };
  }, [setTitle, isZNSDetail]);

  useEffect(() => {
    if (!commonZNSTemplate?.type?.length) fetchCommonZNSList();
  }, []);

  useEffect(() => {
    if (!idDetails) {
      setDefaultZNSTemplate(undefined);
      setSelectedTemplate(undefined);
      setStep(1);
      return;
    }

    if (isZNSDetail || !!znsTemplateId) {
      setSelectedTemplate(undefined);
      setStep(1);
      getTemplateById(idDetails)
        .then((res) => {
          setDefaultZNSTemplate(res);
          if (!znsTemplateId && res.status !== TemplateStatus.REJECTED) {
            router.push(`${ROUTES_FE.TENANT.ZNS.TEMPLATE_MANAGEMENT}/${res?.znsTemplateId}`);
          }
        })
        .catch(() => {
          setDefaultZNSTemplate(undefined);
        });
    } else {
      setStep(1);
      const sampleTemplate = templateSamples?.find((sp) => sp.categoryId === idDetails);
      setSelectedTemplate(sampleTemplate);
      setDefaultZNSTemplate(undefined);
    }
  }, [idDetails]);

  if (!currentOa?.id)
    return (
      <Alert
        message={t('GENERAL.NOTIFICATION')}
        description={t('GENERAL.PLEASE_CHOOSE_ZALO_OA')}
        type='warning'
        showIcon
      />
    );
  if (loading) return <LoadingDashboard />;
  return (
    <ZNSTemplateDetailsProvider idDetails={!!Number(params?.id) ? params?.id : ''}>
      <div className='w-[calc(100%_-_380px)] mb-3'>
        <Steps
          className='w-full'
          current={step || 1}
          items={[t('TEMPLATE.DECLARE_CONTENT'), t('ZNS_TEMPLATE.SEND_APPROVAL')].map((item) => ({
            title: item,
          }))}
        />
      </div>
      <div className='grid grid-cols-[1fr_380px] gap-6'>
        <div className='w-full'>
          <FormRequest />
        </div>
        <div className='w-full max-w-[380px] mx-auto h-full'>
          <PreviewTemplate />
        </div>
      </div>
    </ZNSTemplateDetailsProvider>
  );
};

export default TemplateDetailsRequestForm;
