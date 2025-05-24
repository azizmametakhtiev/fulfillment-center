import { useAppDispatch, useAppSelector } from '@/app/hooks.ts'
import { useState } from 'react'
import { unarchiveOrder, fetchArchivedOrders, deleteOrder } from '@/store/thunks/orderThunk.ts'
import { toast } from 'react-toastify'
import { selectAllArchivedOrders, selectLoadingFetchArchivedOrders } from '@/store/slices/orderSlice.ts'
import { OrderWithClient } from '@/types'
import { hasMessage, isAxios401Error, isGlobalError } from '@/utils/helpers.ts'
import { useNavigate } from 'react-router-dom'
import { selectUser, unsetUser } from '@/store/slices/authSlice'

export const useArchivedOrdersActions = () => {
  const dispatch = useAppDispatch()
  const orders = useAppSelector(selectAllArchivedOrders) as OrderWithClient[] | null
  const loading = useAppSelector(selectLoadingFetchArchivedOrders)
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const [orderToActionId, setOrderToActionId] = useState<string | null>(null)
  const [actionType, setActionType] = useState<'delete' | 'unarchive'>('delete')
  const navigate = useNavigate()
  const currentUser = useAppSelector(selectUser)

  const deleteOneOrder = async (id: string) => {
    try {
      await dispatch(deleteOrder(id)).unwrap()
      await dispatch(fetchArchivedOrders())
      toast.success('Заказ успешно удален!')
    } catch (e) {
      if (isAxios401Error(e) && currentUser) {
        toast.error('Другой пользователь зашел в данный аккаунт')
        dispatch(unsetUser())
        navigate('/login')
      } else if (isGlobalError(e) || hasMessage(e)) {
        toast.error(e.message)
      } else {
        toast.error('Не удалось удалить заказ')
      }
      console.error(e)
    }
  }

  const unarchiveOneOrder = async (id: string) => {
    try {
      await dispatch(unarchiveOrder(id)).unwrap()
      await dispatch(fetchArchivedOrders())
      toast.success('Заказ успешно восстановлен!')
    } catch (e) {
      if (isAxios401Error(e) && currentUser) {
        toast.error('Другой пользователь зашел в данный аккаунт')
        dispatch(unsetUser())
        navigate('/login')
      } else if (isGlobalError(e) || hasMessage(e)) {
        toast.error(e.message)
      } else {
        toast.error('Не удалось восстановить заказ')
      }
      console.error(e)
    }
  }

  const handleConfirmationOpen = (id: string, type: 'delete' | 'unarchive') => {
    setOrderToActionId(id)
    setActionType(type)
    setConfirmationOpen(true)
  }

  const handleConfirmationClose = () => {
    setConfirmationOpen(false)
    setOrderToActionId(null)
  }

  const handleConfirmationAction = async () => {
    if (!orderToActionId) return

    if (actionType === 'delete') {
      await deleteOneOrder(orderToActionId)
    } else {
      await unarchiveOneOrder(orderToActionId)
    }

    handleConfirmationClose()
  }

  return {
    orders,
    loading,
    confirmationOpen,
    actionType,
    handleConfirmationOpen,
    handleConfirmationClose,
    handleConfirmationAction,
  }
}
