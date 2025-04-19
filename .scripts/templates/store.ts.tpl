import { EEventType } from '@/common/enums';
import { EZMPCommonStatus } from '@/enums/miniapp/mini-app.enums';
import { I__Name__ } from '@/interfaces/mini-app/__lowerName__.interfaces';
import { create } from 'zustand';

interface __Name__State {
  current__Name__?: I__Name__;
  setCurrent__Name__: (item?: I__Name__) => void;

  __lowerName__List: I__Name__[];
  set__Name__List: (items: I__Name__[]) => void;

  openModal?: EEventType;
  setOpenModal: (onOpenModal?: EEventType) => void;

  loading?: {
    list?: boolean;
    detail?: boolean;
    create?: boolean;
    update?: boolean;
    delete?: boolean;
  };
  setLoading: (loading: boolean, type: EEventType) => void;
}

const mock__Name__List: I__Name__[] = [
  {
    id: '12345-67890',
    name: '__Name__ 1',
    status: EZMPCommonStatus.ACTIVE,
    createdAt: '2025-01-01T00:00:00Z',
  },
  {
    id: '23456-78901',
    name: '__Name__ 2',
    status: EZMPCommonStatus.INACTIVE,
    createdAt: '2025-02-01T00:00:00Z',
  },
];

export const use__Name__Store = create<__Name__State>((set) => ({
  current__Name__: mock__Name__List?.[0],
  setCurrent__Name__: (item) => set({ current__Name__: item }),

  __lowerName__List: mock__Name__List,
  set__Name__List: (items) => set({ __lowerName__List: items }),

  openModal: undefined,
  setOpenModal: (onOpenModal) => set({ openModal: onOpenModal }),

  loading: {
    list: false,
    detail: false,
    create: false,
    update: false,
    delete: false,
  },
  setLoading: (loading, type) =>
    set((state) => ({
      loading: { ...state.loading, [type]: loading },
    })),
}));
