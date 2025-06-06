import { useAppDispatch, useAppSelector } from '@/app/hooks.ts'
import { useState } from 'react'
import { deleteClient, fetchArchivedClients, unarchiveClient } from '@/store/thunks/clientThunk.ts'
import {
  selectAllArchivedClients,
  selectLoadingArchivedClients,
} from '@/store/slices/clientSlice.ts'
import { toast } from 'react-toastify'
import { hasMessage, isAxios401Error, isGlobalError } from '@/utils/helpers.ts'
import { useNavigate } from 'react-router-dom'
import { selectUser, unsetUser } from '@/store/slices/authSlice'


export const useArchivedClientActions = () => {
  const dispatch = useAppDispatch()
  const loading = useAppSelector(selectLoadingArchivedClients)
  const clients = useAppSelector(selectAllArchivedClients)
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const [clientToActionId, setClientToActionId] = useState<string | null>(null)
  const [actionType, setActionType] = useState<'delete' | 'unarchive'>('delete')
  const navigate = useNavigate()
  const currentUser = useAppSelector(selectUser)

  const deleteOneClient = async (id: string) => {
    try {
      await dispatch(deleteClient(id)).unwrap()
      await dispatch(fetchArchivedClients())
      toast.success('Клиент успешно удален!')
    } catch (e) {
      if (isAxios401Error(e) && currentUser) {
        toast.error('Другой пользователь зашел в данный аккаунт')
        dispatch(unsetUser())
        navigate('/login')
      } else if (isGlobalError(e) || hasMessage(e)) {
        toast.error(e.message)
      } else {
        toast.error('Не удалось удалить клиента')
      }
      console.error(e)
    }
  }

  const unarchiveOneClient = async (id: string) => {
    try {
      await dispatch(unarchiveClient(id)).unwrap()
      await dispatch(fetchArchivedClients())
      toast.success('Клиент успешно восстановлен!')
    } catch (e) {
      if (isAxios401Error(e) && currentUser) {
        toast.error('Другой пользователь зашел в данный аккаунт')
        dispatch(unsetUser())
        navigate('/login')
      } else if (isGlobalError(e) || hasMessage(e)) {
        toast.error(e.message)
      } else {
        toast.error('Не удалось восстановить клиента')
      }
      console.error(e)
    }
  }

  const handleConfirmationOpen = (id: string, type: 'delete' | 'unarchive') => {
    setClientToActionId(id)
    setActionType(type)
    setConfirmationOpen(true)
  }

  const handleConfirmationClose = () => {
    setConfirmationOpen(false)
    setClientToActionId(null)
  }

  const handleConfirmationAction = async () => {
    if (!clientToActionId) return

    if (actionType === 'delete') {
      await deleteOneClient(clientToActionId)
    } else {
      await unarchiveOneClient(clientToActionId)
    }

    handleConfirmationClose()
  }

  return {
    clients,
    loading,
    confirmationOpen,
    actionType,
    handleConfirmationOpen,
    handleConfirmationClose,
    handleConfirmationAction,
  }
}
