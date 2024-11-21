import { AnyObject } from 'antd/es/_util/type';
import { ColumnType } from 'antd/es/table';
import { Table, TableProps } from 'antd';
import { useAccount } from 'wagmi';
import { ReactNode, useMemo } from 'react';
import { cn } from '@/utils/classnames.ts';
import { SizeType } from 'antd/es/config-provider/SizeContext';

function ResponsiveTable<T extends AnyObject>({
  dataSource,
  columns,
  rowKey,
  size,
  ...rest
}: {
  dataSource: T[];
  columns: ColumnType<T>[];
  rowKey: string;
  size?: SizeType;
} & TableProps) {
  const { address } = useAccount();

  const cols = useMemo(
    () => columns.filter((col) => address || col.dataIndex !== 'action'),
    [columns, address]
  );

  return (
    <div className="flex-col">
      <div className="max-md:hidden">
        <Table
          columns={cols}
          dataSource={dataSource}
          bordered={false}
          rowHoverable={false}
          pagination={false}
          rowKey={rowKey}
          size={size}
          {...rest}
        />
      </div>
      <div className="md:hidden">
        {dataSource.map((record, index) => (
          <div
            key={record[rowKey]}
            className="flex flex-col  gap-[16px] border border-transparent border-b-line-primary p-[16px] last:border-none"
          >
            {columns.map((col, colIndex) => (
              <div key={`${colIndex}`} className="flex justify-between">
                <span
                  className={cn(
                    col.dataIndex === 'action' && 'hidden',
                    'text-tc-secondary'
                  )}
                >
                  {typeof col.title === 'function'
                    ? col.title(record)
                    : `${col.title}`}
                </span>
                <span
                  className={cn(
                    'flex flex-col justify-end',
                    col.dataIndex === 'action' && 'flex-1 '
                  )}
                >
                  {typeof col.render === 'function'
                    ? (col.render(
                        // @ts-ignore
                        record[col.dataIndex],
                        record,
                        index
                      ) as ReactNode)
                    : // @ts-ignore
                      record[col.dataIndex]}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ResponsiveTable;
