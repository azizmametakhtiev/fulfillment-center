import { UserWithPopulate } from '@/types'
import useUserActions from '../hooks/useUserActions'
import ConfirmationModal from '@/components/Modal/ConfirmationModal'
import { ColumnDef } from '@tanstack/react-table'
import SelectableColumn from '@/components/DataTable/SelectableColumn/SelectableColumn'
import DataTableColumnHeader from '@/components/DataTable/DataTableColumnHeader/DataTableColumnHeader'
import TableActionsMenu from '@/components/DataTable/TableActionsMenu/TableActionsMenu'
import DataTable from '@/components/DataTable/DataTable'
import { Badge } from '@/components/ui/badge'
import RegistrationForm from '@/features/users/components/RegistrationForm.tsx'
import Modal from '@/components/Modal/Modal.tsx'

const UsersDataList = () => {
  const {
    users,
    confirmationOpen,
    handleConfirmationOpen,
    handleConfirmationClose,
    handleConfirmationArchive,
    handleOpen,
    handleClose,
    selectedUser,
    open,
  } = useUserActions(true)

  const columns: ColumnDef<UserWithPopulate>[] = [
    {
      id: 'select',
      header: ({ table }) => SelectableColumn(table, 'header'),
      cell: ({ row }) => SelectableColumn(row, 'cell'),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'displayName',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Отображаемое имя" />
      ),
      meta: {
        title: 'Отображаемое имя',
      },
      cell: ({ row }) => (
        <div className="font-medium">{row.original.displayName}</div>
      ),
    },
    {
      accessorKey: 'email',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      meta: {
        title: 'Email',
      },
      cell: ({ row }) => <div>{row.original.email}</div>,
    },
    {
      accessorKey: 'role',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Роль" />
      ),
      meta: {
        title: 'Роль',
      },
      cell: ({ row }) => {
        const role = row.original.role
        const variant =
          role === 'super-admin' ? 'destructive'
            : role === 'admin' ? 'default'
              : role === 'stock-worker' ? 'secondary'
                : undefined

        return (
          <Badge
            variant={variant}
            className={role === 'manager' ? 'bg-gray-500 text-white hover:bg-gray-700' : undefined}
          >
            {role === 'super-admin' && 'Супер-админ'}
            {role === 'admin' && 'Администратор'}
            {role === 'manager' && 'Менеджер'}
            {role === 'stock-worker' && 'Работник склада'}
          </Badge>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      id: 'actions',
      header: 'Действия',
      enableGlobalFilter: false,
      enableHiding: false,
      cell: ({ row }) => {
        const tableUser = row.original

        return (
          <TableActionsMenu<UserWithPopulate>
            row={tableUser}
            handleOpen={handleOpen}
            handleConfirmationOpen={handleConfirmationOpen}
            showDetailsLink={false}
            detailsPathPrefix="users"
          />
        )
      },
    },
  ]

  return (
    <div className="max-w-[1000px] mx-auto w-full">
      <DataTable columns={columns} data={users ?? []} />

      <ConfirmationModal
        open={confirmationOpen}
        entityName="этого пользователя"
        actionType={'archive'}
        onConfirm={handleConfirmationArchive}
        onCancel={handleConfirmationClose}
      />

      <Modal open={open} handleClose={handleClose}>
        <RegistrationForm
          onSuccess={handleClose}
          initialFormData={selectedUser ?? undefined}
        />
      </Modal>
    </div>
  )
}

export default UsersDataList
