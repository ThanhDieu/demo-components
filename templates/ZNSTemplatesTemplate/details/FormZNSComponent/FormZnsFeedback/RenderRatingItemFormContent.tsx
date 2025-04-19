'use client';
import { TypeFeedBackFormZNSTemplateForPlayground } from '@/common/enums';
import { CopyText } from '@/components/molecules';
import { CloseOutlined } from '@ant-design/icons';
import { Button, Card, Flex, Form, Input } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useTranslations } from 'next-intl';
import React, { useEffect, useRef, useState } from 'react';
import { useZNSTemplateDetails } from '..';
import { DEFAULT_DATA_RATING, RenderFiveStar } from './znsFeedbackData';

interface IProps {}
const RenderRatingItemFormContent: React.FC<IProps> = () => {
  const t = useTranslations('ZNS_TEMPLATE');
  const [isExpanded, setIsExpanded] = useState<number[]>([]);
  const { formZNSDetails: form } = useZNSTemplateDetails();
  const ratingWatch = Form.useWatch('ratings', form);

  const divRef = useRef<HTMLDivElement>(null);
  const handleFocus = (type: TypeFeedBackFormZNSTemplateForPlayground, indexRating: number) => {
    form.setFieldsValue({
      typeRating: type,
      indexRating,
    });
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (divRef.current && !divRef.current.contains(event.target as Node)) {
        handleFocus(TypeFeedBackFormZNSTemplateForPlayground.GENERAL_PLAYGROUND, -1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleFocus]);

  const handleOpenChangeDetails = (field: number) => {
    form.setFieldValue(['ratings', field], {
      star: DEFAULT_DATA_RATING[field]?.star,
      title: DEFAULT_DATA_RATING[field]?.title,
      question: '',
      thanks: DEFAULT_DATA_RATING[field]?.thanks,
      description: DEFAULT_DATA_RATING[field]?.description,
      isEdit: true,
    });
    setIsExpanded((prev) => [...prev, field]);
    handleFocus(TypeFeedBackFormZNSTemplateForPlayground.GENERAL_PLAYGROUND, -1);
  };

  const handleOpenEditDetails = (field: number, isOpen: boolean) => {
    if (!isOpen) {
      setIsExpanded((prev) => [...prev, field]);
    } else {
      setIsExpanded((prev) => prev.filter((i) => i !== field));
    }
  };

  return (
    <Card size='small' className='!mt-4' title={t('RATTING.TITLE')}>
      <div className='flex items-center px-5 mb-3'>
        <div className='font-medium w-[120px]'>{t('RATTING.POINT')}</div>
        <div className='font-medium w-[65%] flex gap-1'>
          {t('TITLE')} <span className='text-red-600'>*</span>
        </div>
      </div>
      <div>
        <Form.Item name='typeRating' noStyle hidden>
          <Input />
        </Form.Item>
        <Form.Item name='indexRating' noStyle hidden>
          <Input />
        </Form.Item>
        <Form.List
          name='ratings'
          initialValue={DEFAULT_DATA_RATING?.map((item) => ({
            ...item,
            answers: [],
            question: '',
          }))}
        >
          {(fields) => (
            <div style={{ display: 'flex', rowGap: 16, flexDirection: 'column' }}>
              {fields.map((field) => {
                const newDataFormItem = ratingWatch?.[field?.name];
                const isNodata = !newDataFormItem?.isEdit;
                const isOpen = isExpanded.includes(field.name);
                return (
                  <Card
                    ref={divRef}
                    key={field.key}
                    title={
                      <div className='flex gap-2'>
                        <RenderFiveStar field={field.name + 1} />
                        <Form.Item
                          className='!mb-0 w-full'
                          rules={[
                            {
                              required: true,
                              message: '',
                            },
                          ]}
                          name={[field.name, 'title']}
                        >
                          <Input
                            maxLength={50}
                            showCount
                            onClick={() =>
                              handleFocus(
                                TypeFeedBackFormZNSTemplateForPlayground.FEEDBACK_PLAYGROUND,
                                field.name,
                              )
                            }
                          />
                        </Form.Item>
                        {isNodata ? (
                          <Button
                            type='primary'
                            ghost
                            onClick={() => {
                              handleOpenChangeDetails(field.name);
                            }}
                            className='!min-w-28'
                          >
                            {t('ADD_DETAILS')}
                          </Button>
                        ) : (
                          <Button
                            type='primary'
                            ghost
                            onClick={() => {
                              handleOpenEditDetails(field.name, isOpen);
                            }}
                            disabled={
                              isOpen && (!newDataFormItem?.thanks || !newDataFormItem?.description)
                            }
                            className='!min-w-28'
                          >
                            {!isOpen ? t('EDIT_DETAIL') : t('LESS')}
                          </Button>
                        )}
                      </div>
                    }
                    classNames={{
                      body: isOpen ? '!block' : '!hidden ',
                      header: isOpen ? '' : '!border-b-0',
                    }}
                  >
                    <Form.Item noStyle hidden name={[field.name, 'star']}>
                      <Input />
                    </Form.Item>
                    <div>
                      <Form.Item noStyle hidden name={[field.name, 'isEdit']}>
                        <Input />
                      </Form.Item>
                      <Form.Item
                        className='!w-full'
                        label={t('QUESTION')}
                        name={[field.name, 'question']}
                      >
                        <Input
                          type='text'
                          placeholder={`VD: ${DEFAULT_DATA_RATING[field.name]?.question}`}
                          suffix={<CopyText value={newDataFormItem?.question || ''} />}
                          showCount
                          maxLength={100}
                          onClick={() =>
                            handleFocus(
                              TypeFeedBackFormZNSTemplateForPlayground.FEEDBACK_PLAYGROUND,
                              field.name,
                            )
                          }
                        />
                      </Form.Item>

                      {/* Nest Form.List */}

                      <Form.Item label={t('ANSWER')}>
                        <Form.List name={[field.name, 'answers']}>
                          {(subFields, subOpt) => (
                            <div style={{ display: 'flex', flexDirection: 'column', rowGap: 16 }}>
                              {subFields.map((subField) => (
                                <Flex key={`${subField?.key}_item`} className='gap-1'>
                                  <Form.Item className='!w-full !mb-1' name={[subField.name]}>
                                    <Input
                                      type='text'
                                      suffix={
                                        <CopyText
                                          value={newDataFormItem?.answers?.[subField?.name] || ''}
                                        />
                                      }
                                      placeholder={`VD: ${
                                        DEFAULT_DATA_RATING[field.name]?.answers?.[subField?.name]
                                      }`}
                                      showCount
                                      maxLength={50}
                                      onClick={() =>
                                        handleFocus(
                                          TypeFeedBackFormZNSTemplateForPlayground.FEEDBACK_PLAYGROUND,
                                          field.name,
                                        )
                                      }
                                    />
                                  </Form.Item>
                                  <Form.Item className='!mb-1'>
                                    <CloseOutlined
                                      onClick={() => {
                                        subOpt.remove(subField.name);
                                      }}
                                    />
                                  </Form.Item>
                                </Flex>
                              ))}
                              {subFields?.length <= 4 && (
                                <Button type='dashed' onClick={() => subOpt.add()} block>
                                  + {t('ADD_ANSWER')}
                                </Button>
                              )}
                            </div>
                          )}
                        </Form.List>
                      </Form.Item>
                      <Form.Item
                        className='!w-full'
                        label={t('THANKYOU')}
                        rules={[{ required: true, message: '' }]}
                        name={[field.name, 'thanks']}
                      >
                        <Input
                          type='text'
                          suffix={<CopyText value={newDataFormItem?.thanks || ''} />}
                          placeholder={`VD: ${DEFAULT_DATA_RATING[field.name]?.thanks}`}
                          showCount
                          maxLength={100}
                          onClick={() =>
                            handleFocus(
                              TypeFeedBackFormZNSTemplateForPlayground.THANKYOU_PLAYGROUND,
                              field.name,
                            )
                          }
                        />
                      </Form.Item>
                      <Form.Item
                        className='!w-full'
                        label={t('DES_2')}
                        name={[field.name, 'description']}
                        rules={[{ required: true, message: '' }]}
                      >
                        <TextArea
                          rows={4}
                          placeholder={`VD: ${DEFAULT_DATA_RATING[field.name]?.description}`}
                          showCount
                          maxLength={200}
                          onClick={() =>
                            handleFocus(
                              TypeFeedBackFormZNSTemplateForPlayground.THANKYOU_PLAYGROUND,
                              field.name,
                            )
                          }
                        />
                      </Form.Item>
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </Form.List>
      </div>
    </Card>
  );
};

export default RenderRatingItemFormContent;
