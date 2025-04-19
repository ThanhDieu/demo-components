import clsx from 'clsx';

const SAMPLE_DATA = {
  thanks: 'Cảm ơn bạn đã góp ý!',
  answers: [
    'Đóng gói hàng tốt hơn',
    'Chất lượng sản phẩm tốt hơn',
    'Nhân viên chăm sóc nhiệt tình hơn',
    'Kiểm tra đơn kĩ hơn khi đóng gói',
    'Chuẩn bị hàng nhanh hơn',
  ],
  question: 'Chúng tôi có thể cải thiện điều gì?',
};
export const DEFAULT_DATA_RATING = [
  {
    star: 1,
    title: 'Rất không hài lòng',
    description:
      'Rất xin lỗi bạn vì trải nghiệm chưa tốt vừa qua. Chúng tôi sẽ nghiêm túc xem xét để thay đổi và phục vụ bạn tốt hơn nữa',
    ...SAMPLE_DATA,
  },
  {
    star: 2,
    title: 'Không hài lòng',
    ...SAMPLE_DATA,
    description:
      'Rất xin lỗi bạn vì trải nghiệm chưa tốt vừa qua. Chúng tôi sẽ nghiêm túc xem xét để thay đổi và phục vụ bạn tốt hơn nữa',
  },
  {
    star: 3,
    title: 'Bình thường',
    ...SAMPLE_DATA,
    description:
      'Mọi góp ý của bạn đều rất giá trị. Chúng tôi sẽ tiếp tục nỗ lực để phục vụ bạn tốt hơn nữa.',
  },
  {
    star: 4,
    title: 'Hài lòng',
    ...SAMPLE_DATA,
    description:
      'Mọi góp ý của bạn đều rất giá trị. Chúng tôi sẽ tiếp tục nỗ lực để phục vụ bạn tốt hơn nữa.',
  },
  {
    star: 5,
    title: 'Rất hài lòng',
    ...SAMPLE_DATA,
    description:
      'Mọi góp ý của bạn đều rất giá trị. Chúng tôi sẽ tiếp tục nỗ lực để phục vụ bạn tốt hơn nữa.',
  },
];

export const RenderFiveStar = ({ field }: { field: number }) => (
  <div className='inline-flex gap-1 items-center'>
    {[1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className={clsx('text-xl', star <= field ? 'text-yellow-500' : 'text-gray-300')}
      >
        ★
      </span>
    ))}
  </div>
);
