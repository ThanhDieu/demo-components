'use client';
import { EZNSValueType } from '@/common/enums';
import { IZNSType } from '@/interfaces/templates/template.interface';
import { Popconfirm } from 'antd';
import { useTranslations } from 'next-intl';
import { SiAutocad } from 'react-icons/si';
import TypeZnsItem from './TypeZnsItem';
import { useZNSTemplateDetails } from '../../context';

const TypeZnsList = () => {
  const { stateZNSTemplateStore, formZNSDetails } = useZNSTemplateDetails();
  const {
    commonZNSTemplate,
    selectedItemZNSTemplate,
    setSelectedItemZNSTemplate,
    setDefaultZNSTemplate,
    resetField,
  } = stateZNSTemplateStore;
  const t = useTranslations();

  const hadleSelectType = (item: IZNSType) => {
    formZNSDetails.resetFields();
    resetField('banner');
    setDefaultZNSTemplate(undefined);
    setSelectedItemZNSTemplate('type', item);
    const firstTag = item?.validTags?.[0];
    const findTag = commonZNSTemplate?.tag?.find((t) => t.value === firstTag);
    if (findTag) {
      setSelectedItemZNSTemplate('tag', findTag);
    }
  };
  const availableArr = (value: EZNSValueType) =>
    [
      EZNSValueType.CUSTOM,
      EZNSValueType.VERIFIED,
      EZNSValueType.FEEDBACK,
      EZNSValueType.VOUCHER,
      EZNSValueType.PAYMENT,
    ].includes(value);
  return (
    <div className='grid grid-cols-4 2xl:grid-cols-5 gap-3'>
      {(commonZNSTemplate?.type || []).map((item) => (
        <Popconfirm
          key={item?.id}
          title={t('ZNS_TEMPLATE.NOTE')}
          description={t('ZNS_TEMPLATE.ZNS_TYPE_DES')}
          onConfirm={() => hadleSelectType(item)}
          okText={t('ZNS_TEMPLATE.CHOOSE')}
          cancelText={t('GENERAL.CANCEL')}
          disabled={
            !!item?.value &&
            (!availableArr(item?.value) || item.value === selectedItemZNSTemplate?.type?.value)
          }
          overlayClassName='!max-w-[300px]'
        >
          <div>
            <TypeZnsItem
              icon={<SiAutocad size={24} />}
              title={item?.name || ''}
              price={item?.price || 0}
              isChooseItem={selectedItemZNSTemplate?.type?.id === item?.id}
              // onClick={() => hadleSelectType(item)}
              isNewTag={!!item?.value && !availableArr(item?.value)}
              disabled={!!item?.value && !availableArr(item?.value)}
            />
          </div>
        </Popconfirm>
      ))}
    </div>
  );
};

export default TypeZnsList;
