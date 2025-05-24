import { useAppDispatch, useAppSelector } from '@/app/hooks.ts'
import { useCallback, useEffect, useState } from 'react'
import { archiveClient, fetchClientById, fetchClients } from '@/store/thunks/clientThunk.ts'
import {
  clearClientError,
  selectAllClients,
  selectClient,
  selectClientError,
  selectLoadingFetchClient,
} from '@/store/slices/clientSlice.ts'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'
import { hasMessage, isAxios401Error, isGlobalError } from '@/utils/helpers.ts'
import { Client } from '@/types'
import { selectUser, unsetUser } from '@/store/slices/authSlice'

export const useClientActions = (fetchOnDelete: boolean) => {
  const dispatch = useAppDispatch()
  const [open, setOpen] = useState(false)
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const [clientToArchiveId, setClientToArchiveId] = useState<string | null>(null)
  const [openDetailsModal, setOpenDetailsModal] = useState(false)
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null)

  const clients = useAppSelector(selectAllClients)
  const { clientId } = useParams()
  const client = useAppSelector(selectClient)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const error = useAppSelector(selectClientError)
  const loading = useAppSelector(selectLoadingFetchClient)
  const navigate = useNavigate()
  const currentUser = useAppSelector(selectUser)

  const clearErrors = useCallback(() => {
    dispatch(clearClientError())
  }, [dispatch])

  const fetchAllClients = useCallback(async () => {
    await dispatch(fetchClients())
  }, [dispatch])

  const fetchClient = useCallback(
    async (id: string) => {
      await dispatch(fetchClientById(id))
    },
    [dispatch],
  )

  useEffect(() => {
    void clearErrors()
  }, [clearErrors])

  useEffect(() => {
    void fetchAllClients()
  }, [fetchAllClients])

  useEffect(() => {
    if (clientId) {
      void fetchClient(clientId)
      setOpenDetailsModal(true)
    } else {
      setOpenDetailsModal(false)
    }
  }, [clientId, fetchClient, setOpenDetailsModal])

  const archiveOneClient = async (id: string) => {
    try {
      await dispatch(archiveClient(id)).unwrap()
      if (fetchOnDelete) {
        await fetchAllClients()
      } else {
        navigate('/clients')
      }
      toast.success('Клиент успешно архивирован!')
    } catch (e) {
      if (isAxios401Error(e) && currentUser) {
        toast.error('Другой пользователь зашел в данный аккаунт')
        dispatch(unsetUser())
        navigate('/login')
      } else if (isGlobalError(e) || hasMessage(e)) {
        toast.error(e.message)
      } else {
        toast.error('Не удалось архивировать клиента')
      }
      console.error(e)
    }
  }

  const handleOpen = (client?: Client) => {
    if (client) {
      setSelectedClient(client)
    }
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    clearErrors()
  }

  const handleConfirmationOpen = (id: string) => {
    setClientToArchiveId(id)
    setConfirmationOpen(true)
  }

  const handleConfirmationClose = () => {
    setConfirmationOpen(false)
    setClientToArchiveId(null)
  }

  const handleConfirmationArchive = () => {
    if (clientToArchiveId) void archiveOneClient(clientToArchiveId)
    handleConfirmationClose()
  }

  const handleOpenDetailsModal = (clientId: string) => {
    setSelectedClientId(clientId)
    setOpenDetailsModal(true)
  }

  const handleCloseDetailsModal = () => {
    setOpenDetailsModal(false)
    navigate('/clients', { replace: true })
  }

  return {
    dispatch,
    clients,
    client,
    selectedClient,
    open,
    confirmationOpen,
    error,
    loading,
    clientId,
    navigate,
    archiveOneClient,
    handleOpen,
    handleClose,
    handleConfirmationOpen,
    handleConfirmationClose,
    handleConfirmationArchive,
    selectedClientId,
    openDetailsModal,
    handleOpenDetailsModal,
    handleCloseDetailsModal,
  }
}
