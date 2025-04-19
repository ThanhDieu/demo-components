import { TemplateCardInterface } from '@/data/templates';
import { TemplateSample } from '@/interfaces/templates/templateSample.interface';
import { Env } from '@/libs/Env.mjs';
import { ROUTES_FE } from '@/routers';
import { useTemplateStore } from '@/stores/useTemplate.store';
import { useTranslations } from 'next-intl';
import Image, { StaticImageData } from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { IoArrowForward } from 'react-icons/io5';

export interface TemplateModalData {
  name: string;
  description: string;
  image?: StaticImageData;
}

interface TemplateCardProps {
  data: TemplateSample;
  mode: 'library' | 'inModal';
  onClick?: (data: TemplateCardInterface) => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({ data, mode }) => {
  const { setIsModalOpen, setModalData } = useTemplateStore();
  const t = useTranslations();
  const router = useRouter();
  const onDetail = () => {
    if (mode === 'inModal') {
      router.push(`${ROUTES_FE.TENANT.ZNS.TEMPLATES}/${data.id}`);
      return;
    }
    setIsModalOpen(true);
    setModalData(data);

    //  onClick && onClick(data);
  };
  const { name, description, icon } = data;

  return (
    <div
      className='max-w-[230px] min-h-[230px] flex flex-col items-start rounded-sm'
      style={{ border: '1px solid #dddee4' }}
    >
      <div className='bg-[#e9ecfd] w-full flex items-center justify-center p-4'>
        <Image
          src={`${Env.NEXT_PUBLIC_S3_HOST}/${icon}`}
          alt='Image of template'
          width={50}
          height={50}
          objectFit='cover'
        />
      </div>
      <div className='p-4 flex flex-col gap-1 relative h-full'>
        <h3 className='font-semibold title'>{name}</h3>
        <p className='description'>{description}</p>
        <div
          className='flex items-center gap-2 font-semibold text-blue-600 cursor-pointer absolute bottom-3 '
          onClick={onDetail}
        >
          <span>
            {mode == 'library' ? t('TEMPLATE.VIEW_DETAIL') : t('API_KEY.SELECT_TEMPLATE')}
          </span>
          <IoArrowForward />
        </div>
      </div>
    </div>
  );
};

export default TemplateCard;
