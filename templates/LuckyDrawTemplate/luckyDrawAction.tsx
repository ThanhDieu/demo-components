'use client';
import { LayoutContent } from '@/components/organisms';
import { useBreadcrumb } from '@/components/organisms/partials/Breadcrumb/context';
import { IActionGameForm } from '@/interfaces/mini-app/luckyDraw.interfaces';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { Button, Card, Form } from 'antd';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { CreateUpdateLuckyDraw, useLuckyDrawGiftDetailHook } from './partials';

const LuckyDrawConfigurationActionTemplate = ({
  detailId,
  miniAppId,
}: {
  detailId?: string;
  miniAppId: string;
}) => {
  const t = useTranslations();
  const router = useRouter();
  const [form] = Form.useForm<IActionGameForm>();
  const { detail: detailData, isLoading } = useLuckyDrawGiftDetailHook(detailId);

  //Breadcrumb
  const { setTitle } = useBreadcrumb();
  useEffect(() => {
    if (detailData?.name) setTitle(detailData?.name);

    return () => {
      setTitle();
    };
  }, [setTitle, detailData?.name]);

  return (
    <LayoutContent
      title={detailId ? t('BREADCRUMB.update') : t('BREADCRUMB.create')}
      renderIfTrue={true}
      icon={
        <Button type='text' icon={<ArrowLeftOutlined />} onClick={() => router.back()}></Button>
      }
      isLoading={isLoading && !!detailId}
    >
      <Card>
        <CreateUpdateLuckyDraw
          detailId={detailId}
          detailData={detailData}
          miniAppId={miniAppId}
          form={form}
        />
      </Card>
    </LayoutContent>
  );
};

export default LuckyDrawConfigurationActionTemplate;
