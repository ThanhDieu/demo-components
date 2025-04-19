'use client';

import { ERadioItemZNSTypeTemplateCollapse } from '@/common/enums';
import { IZNSTable } from '@/interfaces/templates/template.interface';
import { Button, Card, Form, FormInstance, Input } from 'antd';
import { AnyObject } from 'antd/es/_util/type';
import form from 'antd/es/form';
import { useTranslations } from 'next-intl';
import React, { useCallback } from 'react';
import { DndProvider, useDrag, useDrop, XYCoord } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { FaRegTrashAlt } from 'react-icons/fa';
import { OptionRadioGroup, RenderFormContent, RenderFormTable, useZNSTemplateDetails } from '..';
const ItemType = 'FORM_ITEM';

const RenderDnDFormLayout = ({
  tableDefaultData,
  paragraphDefaultData,
}: {
  tableDefaultData?: IZNSTable[];
  paragraphDefaultData?: string[];
}) => {
  const t = useTranslations();
  const { formZNSDetails: form } = useZNSTemplateDetails();
  const layoutWatch = Form.useWatch('layout', form);
  const disabledContent =
    layoutWatch &&
    layoutWatch?.filter((el: any) => el.type === ERadioItemZNSTypeTemplateCollapse.document)
      ?.length >= 4;

  const disabledTable =
    layoutWatch &&
    layoutWatch?.findIndex((el: any) => el.type === ERadioItemZNSTypeTemplateCollapse.table) > -1;

  const moveItem = (fromIndex: number, toIndex: number) => {
    const values = form.getFieldValue('layout') || [];
    const updatedValues = [...values];
    const [movedItem] = updatedValues.splice(fromIndex, 1);
    updatedValues.splice(toIndex, 0, movedItem);
    form.setFieldsValue({ layout: updatedValues });
  };
  const textFirst = layoutWatch?.findIndex(
    (el: any) => el.type === ERadioItemZNSTypeTemplateCollapse.document,
  );

  const renderCard = useCallback(
    (
      field: { name: number; key: number },
      index: number,
      remove: (index: number | number[]) => void,
      currentData: any,
    ) => {
      return (
        <DragItem
          key={field.key}
          item={field}
          index={index}
          moveItem={moveItem}
          remove={remove}
          currentData={currentData}
          isRequired={textFirst === field.name}
        />
      );
    },
    [textFirst],
  );
  return (
    <DndProvider backend={HTML5Backend}>
      <div className='layout-content py-3'>
        <Form.List name='layout'>
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => {
                const currentData = (form as FormInstance).getFieldValue(['layout', field.name]);
                return renderCard(field, index, remove, currentData);
              })}
              <Form.Item noStyle>
                <OptionRadioGroup
                  selectedValue={ERadioItemZNSTypeTemplateCollapse.document}
                  options={[
                    {
                      label: t('ZNS_TEMPLATE.TEXTAREA'),
                      value: ERadioItemZNSTypeTemplateCollapse.document,
                      disabled: disabledContent,
                    },
                    {
                      label: t('ZNS_TEMPLATE.TABLE'),
                      value: ERadioItemZNSTypeTemplateCollapse.table,
                      disabled: disabledTable,
                    },
                  ]}
                  onChange={(value) => {
                    if (value === ERadioItemZNSTypeTemplateCollapse.table) {
                      add({
                        type: value,
                        table: tableDefaultData,
                      });
                    } else {
                      const lengthData = layoutWatch?.filter(
                        (el: { type: string }) =>
                          el.type === ERadioItemZNSTypeTemplateCollapse.document,
                      )?.length;
                      add({
                        type: value,
                        value: paragraphDefaultData?.[lengthData || 0] || '',
                      });
                    }
                  }}
                />
              </Form.Item>
            </>
          )}
        </Form.List>
      </div>
    </DndProvider>
  );
};
const RenderLayoutPrivate = ({
  type,
  form,
  name,
  isRequired,
  ...restField
}: {
  type: ERadioItemZNSTypeTemplateCollapse;
  form: any;
  name: number;
  isRequired: boolean;
}) => {
  switch (type) {
    case ERadioItemZNSTypeTemplateCollapse.table:
      return <RenderFormTable name={name} />;
    default:
      return <RenderFormContent isRequired={isRequired} name={name} {...restField} />;
  }
};

const DragItem = ({
  item,
  index,
  moveItem,
  remove,
  isRequired,
  currentData,
  onDrop,
  ...restField
}: AnyObject) => {
  const ref = React.useRef(null);
  const t = useTranslations();
  const [, drop] = useDrop({
    accept: ItemType,
    hover(draggedItem: { index: number }, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = draggedItem.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }
      const hoverBoundingRect = (ref.current as any)?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      if (dragIndex !== hoverIndex) {
        moveItem(dragIndex, index);
        draggedItem.index = hoverIndex;
      }
    },
  });

  const [, drag] = useDrag({
    type: ItemType,
    item: { index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));
  return (
    <div ref={ref}>
      <Card
        size='small'
        title={
          <>
            {isRequired ? <span className='text-error'>*</span> : ''}
            {currentData?.type === ERadioItemZNSTypeTemplateCollapse.table
              ? t('ZNS_TEMPLATE.TABLE')
              : ` ${t('ZNS_TEMPLATE.TEXTAREA')}`}
          </>
        }
        extra={
          <Button
            danger
            onClick={() => {
              remove(index);
            }}
            type='text'
            icon={<FaRegTrashAlt size={18} />}
          />
        }
        className='!mb-3 hover:border-primary cursor-grab'
        classNames={{
          body: '!pt-6',
        }}
      >
        <Form.Item {...restField} name={[index, 'type']} hidden>
          <Input />
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.layout?.[index] !== currentValues.layout?.[index]
          }
        >
          {({ getFieldValue }) => {
            return (
              <RenderLayoutPrivate
                type={getFieldValue(['layout', index, 'type'])}
                form={form}
                name={index}
                isRequired={isRequired}
                {...restField}
              />
            );
          }}
        </Form.Item>
      </Card>
    </div>
  );
};

export default RenderDnDFormLayout;
