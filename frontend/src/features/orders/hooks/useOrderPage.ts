import { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../../app/hooks.ts'
import {
  clearErrorOrder,
  clearPopulateOrder,
  selectAllOrdersWithClient,
  selectLoadingFetchOrder,
} from '../../../store/slices/orderSlice.ts'
import {
  archiveOrder, fetchArchivedOrders,
  fetchOrderByIdWithPopulate,
  fetchOrdersWithClient,
} from '../../../store/thunks/orderThunk.ts'
import { toast } from 'react-toastify'
import { OrderWithClient } from '../../../types'

const UseOrderPage = () => {
  const dispatch = useAppDispatch()
  const orders = useAppSelector(selectAllOrdersWithClient)
  const loading = useAppSelector(selectLoadingFetchOrder)
  const [open, setOpen] = useState(false)
  const [counterpartyToDelete, setCounterpartyToDelete] = useState<OrderWithClient | null>(null)

  useEffect(() => {
    dispatch(fetchOrdersWithClient())
  }, [dispatch])

  const handleArchive = async (id: string) => {
    try {
      await dispatch(archiveOrder(id))
      dispatch(fetchOrdersWithClient())
      toast.success('Заказ успешно архивирован!')
      dispatch(fetchArchivedOrders)
    } catch (e) {
      toast.error('Ошибка при архивации заказа.')
      console.error(e)
    }
  }

  const handleOpen = () => setOpen(true)

  const handleClose = () => {
    setOpen(false)
    dispatch(clearPopulateOrder())
    dispatch(clearErrorOrder())
  }

  const handleOpenEdit = async (order: OrderWithClient) => {
    await dispatch(fetchOrderByIdWithPopulate(order._id))
    setOpen(true)
  }

  const handleConfirmArchive = async () => {
    if (counterpartyToDelete) {
      await dispatch(archiveOrder(counterpartyToDelete._id))
      dispatch(fetchOrdersWithClient())
      handleClose()
    }
  }

  return {
    orders,
    open,
    handleOpen,
    loading,
    handleClose,
    handleArchive,
    handleOpenEdit,
    setCounterpartyToDelete,
    handleConfirmArchive,
  }
}

export default UseOrderPage
