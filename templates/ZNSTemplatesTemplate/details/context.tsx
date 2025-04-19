'use client';

import {
  ERadioItemZNSTypeTemplateCollapse,
  TypeFeedBackFormZNSTemplateForPlayground,
} from '@/common/enums';
import {
  IZNSButton,
  IZNSFeedback,
  IZNSParams,
  IZNSPayment,
  IZNSTable,
  IZNSVoucher,
} from '@/interfaces/templates/template.interface';
import { IZNSTemplateState, useZNSTemplateStore } from '@/stores/useZNSTemplate.store';
import { Form, FormInstance } from 'antd';
import { useSearchParams } from 'next/navigation';
import React, { createContext, useContext, useEffect } from 'react';
import { setupDataFormByDetail } from '.';

export interface IFormZNSType {
  templateName: string;
  logoLight: any;
  logoDark: any;
  banners: any;
  buttons: IZNSButton[];
  params: IZNSParams[];
  title: string;
  note: string;
  layout: {
    type: ERadioItemZNSTypeTemplateCollapse;
    value?: string;
    table?: IZNSTable[];
  }[];
  ratings: IZNSFeedback[];
  voucher: IZNSVoucher;
  typeRating?: TypeFeedBackFormZNSTemplateForPlayground;
  indexRating?: number;
  payment?: IZNSPayment;
  [key: string]: any;
}

interface ZNSTemplateDetailsContextType {
  formZNSDetails: FormInstance<IFormZNSType>;
  stateZNSTemplateStore: IZNSTemplateState;
  idDetails?: string;
  znsTemplateId?: string | null;
  isCreate: boolean;
}

const ZNSTemplateDetailsContext = createContext<ZNSTemplateDetailsContextType | null>(null);

export const useZNSTemplateDetails = () => {
  const context = useContext(ZNSTemplateDetailsContext);
  if (!context) {
    throw new Error('useZNSTemplateDetails must be used within a ZNSTemplateDetailsProvider');
  }
  return context;
};

export const ZNSTemplateDetailsProvider = ({
  children,
  idDetails,
}: {
  children: React.ReactNode;
  idDetails?: string;
}) => {
  const stateZNSTemplateStore = useZNSTemplateStore();
  const { defaultZNSTemplate, setSelectedItemZNSTemplate } = stateZNSTemplateStore;
  const formAntd = Form.useForm<IFormZNSType>();

  const isCreate = !idDetails;
  const znsTemplateId = useSearchParams().get('znsTemplateId');
  const form = formAntd?.[0];

  //setup data by details
  useEffect(() => {
    if (defaultZNSTemplate?.znsTemplateId && form && (idDetails || znsTemplateId)) {
      const formatedDataZNSByDetails = setupDataFormByDetail(defaultZNSTemplate);

      form.setFieldsValue(formatedDataZNSByDetails.forForm);

      if (formatedDataZNSByDetails?.forState) {
        setSelectedItemZNSTemplate(
          'templateName',
          defaultZNSTemplate?.templateName,
          formatedDataZNSByDetails.forState,
        );
      }
    }
  }, [defaultZNSTemplate?.id, form, znsTemplateId, idDetails]);

  return (
    <ZNSTemplateDetailsContext.Provider
      value={{
        formZNSDetails: formAntd?.[0],
        stateZNSTemplateStore,
        idDetails,
        isCreate,
        znsTemplateId,
      }}
    >
      {children}
    </ZNSTemplateDetailsContext.Provider>
  );
};
