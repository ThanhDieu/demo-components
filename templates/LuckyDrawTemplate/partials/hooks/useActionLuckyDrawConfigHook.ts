import { COLORS } from '@/common/colors';
import { DATE_FORMAT, TIME_FORMAT } from '@/common/constants';
import { EEventType } from '@/common/enums';
import { EZMPLuckyDrawRuleType, EZMPWeekDays } from '@/enums/miniapp/mini-app.enums';
import { useMutationCustom } from '@/hooks/useMutationCustom';
import {
  IActionGame,
  IActionGameForm,
  IGameSpecialDate,
  ILuckyDraw,
  ILuckyDrawRule,
} from '@/interfaces/mini-app/luckyDraw.interfaces';
import { ROUTES_FE } from '@/routers';
import { luckyDrawService } from '@/services/mini-app/lucky-draw-config.api';
import { useMiniAppStore } from '@/stores/@miniApp/useMiniAppStore';
import { useZMPLuckyDrawStore } from '@/stores/@miniApp/useZMPLuckyDrawStore';
import StringUtils from '@/utils/StringUtils';
import { Form, FormInstance } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { handleShowGiftListByNumber, splitPercentage } from '../form';

export const useActionLuckyDrawConfigHook = (
  form?: FormInstance<IActionGameForm>,
  idLuckyDraw?: string,
) => {
  const { currentMiniApp } = useMiniAppStore();
  const t = useTranslations();
  const { setCurrentZMPLuckyDraw, setOpenModal, openModal } = useZMPLuckyDrawStore();
  const [text, setText] = useState<string>();
  const [errorMessage, seErrorMessage] = useState<any>();
  const pieceCountWatch = Form.useWatch('pieceCount', form);
  const gameRulesWatch = Form.useWatch('gameRules', form);
  const router = useRouter();

  const actionLuckyDrawMutation = useMutationCustom<ILuckyDraw, { params?: IActionGame }>(
    async ({ params }: { params: IActionGame }) => {
      return idLuckyDraw
        ? !!params
          ? luckyDrawService.updateLuckyDraw(idLuckyDraw, params)
          : luckyDrawService.deleteLuckyDraw(idLuckyDraw)
        : luckyDrawService.createLuckyDraw(params);
    },
    {
      onSuccess: (res) => {
        if (openModal !== EEventType.DELETE) {
          setCurrentZMPLuckyDraw(res?.data);
          if (currentMiniApp?.id && res?.data?.id) {
            toast.success(
              t('NOTI.ACTION_SUCCESS', {
                action: idLuckyDraw ? t('GENERAL.UPDATE') : t('GENERAL.CREATE'),
              }),
            );
            router.push(
              StringUtils.generatePath(
                `${ROUTES_FE.TENANT.MINI_APP.SPIN_WHEEL_CONFIG}/${res?.data?.id}`,
                {
                  id: currentMiniApp?.id,
                },
              ),
            );
          } else {
            seErrorMessage(res?.data as any);
          }
        } else {
          setCurrentZMPLuckyDraw(undefined);
        }
        setOpenModal(undefined);
      },
      onError: (err: any) => {
        seErrorMessage(err.message);
        // toast.error(err.message);
      },
    },
  );

  const handleActionLuckyDraw = async (formData?: IActionGameForm) => {
    if (!formData) {
      return actionLuckyDrawMutation.mutateAsync({});
    }
    const params: IActionGame = {
      name: formData?.name,
      description: formData?.description,
      pieceCount: formData?.pieceCount,
      startTime: dayjs(formData.rangeDate[0]).format(),
      endTime: dayjs(formData.rangeDate[1]).format(),
      isDefault: formData?.isDefault,
      specialDates: handleFormatDate(formData.excludedDates as any, false),
      zmaGameGeneralRuleId: formData?.zmaGameGeneralRuleId,
      gameRules: formData?.gameRules?.map((item, index) => ({
        name: item?.name,
        priority: item?.priority,
        zmaGameRuleGift: item?.zmaGameRuleGift?.map((item) => {
          const { gift, ...restItem } = item;
          return {
            ...restItem,
            giftId: (item as any).giftId.value,
          };
        }),
        isDefault: index === 0,
        days: index > 0 ? formatToDatesArray(item) : [],
      })),
    };
    return actionLuckyDrawMutation.mutateAsync({ params });
  };
  const handleChangeTotalPiece = (value: number) => {
    if (value && form) {
      form.setFieldValue(
        'gameRules',
        gameRulesWatch?.length > 0
          ? gameRulesWatch?.map((rule: ILuckyDrawRule) => {
              const newPieces = splitPercentage(100, value)?.map((item, index) => ({
                ...(rule.zmaGameRuleGift[index] || {
                  giftId: '',
                  color: COLORS.primary,
                }),
                rate: item,
              }));

              return {
                ...rule,
                zmaGameRuleGift: newPieces,
              };
            })
          : [
              {
                zmaGameRuleGift: handleShowGiftListByNumber(pieceCountWatch),
                type: EZMPLuckyDrawRuleType.DEFAULT,
              },
            ],
      );
      setText('Tỷ lệ trúng quà của vòng quay của các rule đã thay đổi!!!');
    }
  };
  return {
    onFinish: handleActionLuckyDraw,
    onChangeTotalPiece: handleChangeTotalPiece,
    warningText: text,
    setWarningText: setText,
    isLoading: actionLuckyDrawMutation.isLoading,
    errorMessage,
    seErrorMessage,
  };
};

function formatToDatesArray(input: ILuckyDrawRule): IGameSpecialDate[] {
  const result: IGameSpecialDate[] = [];
  const { applicableDates, applicableTime, applicableDays } = input;

  if (!applicableTime) return [];

  const parsedTime: string[][] = JSON.parse(applicableTime as any);

  if (!parsedTime?.length) return [];

  const formatTimeRange = (range: string[]) => ({
    start: dayjs(range?.[0]).format(TIME_FORMAT) || '00:00',
    end: dayjs(range?.[1]).format(TIME_FORMAT) || '23:59',
  });

  // Trường hợp: có applicableDates
  if (applicableDates?.length) {
    for (const date of applicableDates) {
      for (const time of parsedTime) {
        result.push({
          ...formatTimeRange(time),
          date: dayjs(date).format(DATE_FORMAT),
        });
      }
    }
  }

  // Trường hợp: có applicableDays
  if (applicableDays?.length) {
    for (const day of applicableDays) {
      for (const time of parsedTime) {
        result.push({
          ...formatTimeRange(time),
          day,
        });
      }
    }
  }

  // Trường hợp fallback: không có date và day
  if (!applicableDates?.length && !applicableDays?.length) {
    for (const time of parsedTime) {
      result.push(formatTimeRange(time));
    }
  }

  return result;
}

function handleFormatDate(specialDates?: string, isTime?: boolean) {
  if (!specialDates || typeof specialDates !== 'string') return [];
  const newSpecialDates = JSON.parse(specialDates);
  if (!isTime) {
    const days = (newSpecialDates?.days || [])?.map((day: EZMPWeekDays) => ({
      start: '00:00',
      end: '23:59',
      day,
    }));
    const dates = (newSpecialDates?.dates || [])?.map((date: string) => ({
      start: '00:00',
      end: '23:59',
      date: dayjs(date, DATE_FORMAT),
    }));

    return [...days, ...dates];
  } else {
  }

  return [];
}

export function formatToRuleObject(arr: IGameSpecialDate[]): ILuckyDrawRule {
  const applicableDates: Set<string> = new Set();
  const applicableDays: Set<number> = new Set();
  const applicableTimeSet: Set<string> = new Set();

  for (const item of arr) {
    const timeRangeStr = JSON.stringify([
      dayjs(item.start, TIME_FORMAT).format(),
      dayjs(item.end, TIME_FORMAT).format(),
    ]);
    applicableTimeSet.add(timeRangeStr);

    if (item.date) {
      const isoDate = dayjs(item.date).startOf('day').toISOString();
      applicableDates.add(isoDate);
    } else if (typeof item.day === 'number') {
      applicableDays.add(item.day);
    }
  }

  const result: ILuckyDrawRule = {
    applicableTime: JSON.stringify([...applicableTimeSet].map((str) => JSON.parse(str))),
  } as ILuckyDrawRule;

  if (applicableDates.size > 0) {
    result.applicableDates = [...applicableDates].map((item) => dayjs(item));
  }

  if (applicableDays.size > 0) {
    result.applicableDays = [...applicableDays];
  }
  return result;
}
