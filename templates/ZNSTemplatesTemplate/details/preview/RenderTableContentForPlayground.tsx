'use client';
import { IZNSTable } from '@/interfaces/templates/template.interface';
import { MockRowTypeTable, useZNSTemplateStore } from '@/stores/useZNSTemplate.store';
import { Form } from 'antd';
import React, { useEffect } from 'react';
import { useZNSTemplateDetails } from '../FormZNSComponent';

interface TableDisplayProps {
  tables: IZNSTable[];
  name: number;
}

const RenderTableContentForPlayground: React.FC<TableDisplayProps> = ({ tables, name }) => {
  const { modeTemplate } = useZNSTemplateStore();
  const { formZNSDetails } = useZNSTemplateDetails();
  const paramsWatch = Form.useWatch('params', formZNSDetails)?.filter((item) => !!item?.row_type);

  const getTag = (() => {
    const tagMap = new Map(MockRowTypeTable.map((el) => [el.value, el]));

    return (value: string) => {
      if (!value || !paramsWatch?.length) return undefined;

      return paramsWatch
        .map((item, index) => ({ ...item, ...(tagMap.get(item?.row_type || 0) ?? {}), index }))
        .find((tag) => tag?.name && `<${tag.name}>` === value && String(tag.type) === '6');
    };
  })();

  useEffect(() => {
    tables.forEach((item, index) => {
      const tagByValue = getTag(item?.value);
      const currentRowType = formZNSDetails.getFieldValue([
        'layout',
        name,
        'table',
        index,
        'row_type',
      ]);

      if (tagByValue?.row_type !== undefined && tagByValue.row_type !== currentRowType) {
        formZNSDetails.setFieldValue(
          ['layout', name, 'table', index, 'row_type'],
          tagByValue.row_type,
        );
      }
    });
  }, [tables, paramsWatch]);

  return tables?.map((item, index) => {
    const tag = getTag(item?.value);
    return (
      <div key={index} className='flex gap-4 mb-1 leading-5'>
        <span className='w-1/3 inline-block py-1 break-words'>{item?.title}</span>
        <span className='font-bold w-2/3 break-words'>
          <span
            style={{
              background: tag?.value ? tag.bg : 'transparent',
              color: tag?.value ? tag.color : modeTemplate === 'dark' ? 'white' : 'black',
            }}
            className='inline-block px-2 py-1 rounded-3xl'
          >
            {item?.value}
          </span>
        </span>
      </div>
    );
  });
};

export default RenderTableContentForPlayground;
