'use client';


import { Button, Drawer } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { SchoolFilter } from '../school-filter/school-filter';

export function ControlBar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile drawer */}
      <Drawer
        placement="bottom"
        open={open}
        onClose={() => setOpen(false)}
        height={300}
        className="lg:hidden"
      >
        <div className="p-4">
          <SchoolFilter />
        </div>
      </Drawer>

      {/* Mobile control bar */}
      <div className="h-14 border-t bg-white px-4 flex items-center justify-end gap-2 lg:hidden">
        <Button 
          icon={<FilterOutlined />}
          onClick={() => setOpen(true)}
        >
          Filters
        </Button>
      </div>
    </>
  );
} 