import { ColumnDef } from '@tanstack/react-table'
import DataTable from '@/components/DataTable/DataTable'
import SelectableColumn from '@/components/DataTable/SelectableColumn/SelectableColumn'
import DataTableColumnHeader from '@/components/DataTable/DataTableColumnHeader/DataTableColumnHeader'
import { PropsTaskTable } from '@/features/reports/utils/TypesProps'
import React from 'react'
import { UserTaskReport } from '@/types'
import { useSearchParams } from 'react-router-dom'
import { formatDate } from '@/features/reports/utils/FormattedDateForTitle.ts'
import Dropdown from '@/features/reports/components/DropDown.tsx'

const TaskReportDataList: React.FC<PropsTaskTable> = ({ userTaskReports }) => {
  const [searchParams] = useSearchParams()
  const startDate = formatDate(searchParams.get('startDate'))
  const endDate = formatDate(searchParams.get('endDate'))
  const columns: ColumnDef<UserTaskReport>[] = [
    {
      id: 'select',
      header: ({ table }) => SelectableColumn(table, 'header'),
      cell: ({ row }) => SelectableColumn(row, 'cell'),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'user.displayName',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Исполнитель" />,
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.user.displayName}
          {row.original.user.isArchived && (
            <div className="text-muted-foreground text-xs">(в архиве)</div>
          )}
        </div>
      ),
      enableColumnFilter: true,
      enableHiding: false,
    },
    {
      id: 'задачи',
      header: () => (
        <div className="text-center">
          Выполненные <br /> задачи
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center">
          <Dropdown
            items={row.original.tasks}
            getLabel={task => `${ task.taskNumber }${ task.isArchived ? ' (в архиве)' : '' }`}
            getLink={task => `/tasks/${ task._id }`}
            buttonText="Задачи"
          />
        </div>
      ),
    },
    {
      accessorKey: 'количество выполненных задач',
      header: () => (
        <div className="text-center">
          Количество <br />выполненных задач
        </div>
      ),
      cell: ({ row }) => (
        <div className="text-center">
          {row.original.taskCount}
        </div>
      ),
    },
  ]

  return (
    <div className="overflow-x-auto flex-grow min-w-[340px] max-w-[570px] w-full md:w-full ml-2">
      <h6
        className="mx-auto w-[90%] sm:w-[80%] md:w-[95%] lg:w-[95%] xl:w-[95%] mb-[15px] text-[1rem] sm:text-[1.25rem] text-center"
      >
        Количество задач, выполненных каждым  {' '}
        сотрудником за период с {startDate} по {endDate}
      </h6>
      <DataTable columns={columns} data={userTaskReports ?? []} />
    </div>
  )
}

export default TaskReportDataList
