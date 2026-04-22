'use client';

import { Pagination } from '@heroui/pagination';

export default function PaginationComponent({
  page = 1,
  total = 1,
  onChange,
  color = 'primary',
  className = '',
  size = 'lg',
  showControls = true,
  variant = 'flat',
}) {
  if (total < 1) return null;

  return (
    <div className={`flex justify-center ${className}`}>
      <Pagination
        total={total}
        page={page}
        onChange={onChange}
        color={color}
        size={size}
        showControls={showControls}
        variant={variant}
      />
    </div>
  );
}
