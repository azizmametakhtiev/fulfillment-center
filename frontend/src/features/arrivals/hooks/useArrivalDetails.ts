import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks.ts'
import {
  selectArrivalWithPopulate,
  selectLoadingFetchArrival,
} from '@/store/slices/arrivalSlice.ts'
import { archiveArrival, cancelArrival, fetchArrivalByIdWithPopulate } from '@/store/thunks/arrivalThunk.ts'
import { toast } from 'react-toastify'
import { hasMessage, isAxios401Error } from '@/utils/helpers.ts'
import { selectUser, unsetUser } from '@/store/slices/authSlice'
import { getOS } from '@/utils/getOs'

const useArrivalDetails = () => {
  const { arrivalId } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const currentUser = useAppSelector(selectUser)
  const user = useAppSelector(selectUser)

  const arrival = useAppSelector(selectArrivalWithPopulate)
  const loading = useAppSelector(selectLoadingFetchArrival)

  const [confirmArchiveModalOpen, setConfirmArchiveModalOpen] = useState(false)
  const [confirmCancelModalOpen, setConfirmCancelModalOpen] = useState(false)
  const [isCanceled, setIsCanceled] = useState(false)
  const [isArchived, setIsArchived] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false)
  const [tabs, setTabs] = useState(0)
  const [os] = useState<string>(getOS())

  useEffect(() => {
    if (arrivalId) {
      dispatch(fetchArrivalByIdWithPopulate(arrivalId))
    }
  }, [dispatch, arrivalId])


  const handleArchive = async () => {
    if (arrivalId) {
      try {
        await dispatch(archiveArrival(arrivalId)).unwrap()
        toast.success('Поставка успешно архивирована!')
        setIsArchived(!isArchived)
        navigate('/arrivals')
      } catch (e) {
        if (isAxios401Error(e) && currentUser) {
          toast.error('Другой пользователь зашел в данный аккаунт')
          dispatch(unsetUser())
          navigate('/login')
        } else if (hasMessage(e)) {
          toast.error(e.message || 'Ошибка архивирования')
        } else {
          console.error(e)
          toast.error('Неизвестная ошибка')
        }
      }
    }
    setConfirmArchiveModalOpen(false)
  }

  const handleCancel = async () => {
    if (arrivalId) {
      try {
        await dispatch(cancelArrival(arrivalId)).unwrap()
        toast.success('Поставка успешно отменена!')
        setIsCanceled(!isCanceled)
        navigate('/arrivals')
      } catch (e) {
        if (isAxios401Error(e) && currentUser) {
          toast.error('Другой пользователь зашел в данный аккаунт')
          dispatch(unsetUser())
          navigate('/login')
        } else if (hasMessage(e)) {
          toast.error(e.message || 'Ошибка отмены')
        } else {
          console.error(e)
          toast.error('Неизвестная ошибка')
        }
      }
    }
    setConfirmCancelModalOpen(false)
  }

  return {
    arrival,
    loading,
    confirmArchiveModalOpen,
    handleArchive,
    editModalOpen,
    setEditModalOpen,
    setConfirmArchiveModalOpen,
    tabs,
    setTabs,
    handleCancel,
    confirmCancelModalOpen,
    setConfirmCancelModalOpen,
    os,
    user,
  }
}

export default useArrivalDetails
