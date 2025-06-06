import { useAppDispatch, useAppSelector } from '@/app/hooks.ts'
import { useState } from 'react'
import { toast } from 'react-toastify'
import { hasMessage, isAxios401Error, isGlobalError } from '@/utils/helpers.ts'
import { selectAllArchivedTasks, selectLoadingFetchArchivedTasks } from '@/store/slices/taskSlice.ts'
import { deleteTask, fetchArchivedTasks, unarchiveTask } from '@/store/thunks/tasksThunk.ts'
import { useNavigate } from 'react-router-dom'
import { selectUser, unsetUser } from '@/store/slices/authSlice'


const useArchivedTasksActions = () => {
  const dispatch = useAppDispatch()
  const [confirmationOpen, setConfirmationOpen] = useState(false)
  const [taskToActionId, setTaskToActionId] = useState<string | null>(null)
  const [actionType, setActionType] = useState<'delete' | 'unarchive'>('delete')
  const tasks = useAppSelector(selectAllArchivedTasks)
  const loading = useAppSelector(selectLoadingFetchArchivedTasks)
  const navigate = useNavigate()
  const currentUser = useAppSelector(selectUser)

  const deleteOneTask = async (id: string) => {
    try {
      await dispatch(deleteTask(id)).unwrap()
      await dispatch(fetchArchivedTasks())
      toast.success('Задача успешно удалена!')
    } catch (e) {
      if (isAxios401Error(e) && currentUser) {
        toast.error('Другой пользователь зашел в данный аккаунт')
        dispatch(unsetUser())
        navigate('/login')
      } else if (isGlobalError(e) || hasMessage(e)) {
        toast.error(e.message)
      } else {
        toast.error('Не удалось удалить задачу')
      }
      console.error(e)
    }
  }

  const unarchiveOneTask = async (id: string) => {
    try {
      await dispatch(unarchiveTask(id)).unwrap()
      await dispatch(fetchArchivedTasks())
      toast.success('Задача успешно восстановлена!')
    } catch (e) {
      if (isAxios401Error(e) && currentUser) {
        toast.error('Другой пользователь зашел в данный аккаунт')
        dispatch(unsetUser())
        navigate('/login')
      } else if (isGlobalError(e) || hasMessage(e)) {
        toast.error(e.message)
      } else {
        toast.error('Не удалось восстановить задачу')
      }
      console.error(e)
    }
  }

  const handleConfirmationOpen = (id: string, type: 'delete' | 'unarchive') => {
    setTaskToActionId(id)
    setActionType(type)
    setConfirmationOpen(true)
  }

  const handleConfirmationClose = () => {
    setConfirmationOpen(false)
    setTaskToActionId(null)
  }

  const handleConfirmationAction = async () => {
    if (!taskToActionId) return

    if (actionType === 'delete') {
      await deleteOneTask(taskToActionId)
    } else {
      await unarchiveOneTask(taskToActionId)
    }

    handleConfirmationClose()
  }

  return {
    tasks,
    loading,
    confirmationOpen,
    actionType,
    handleConfirmationOpen,
    handleConfirmationClose,
    handleConfirmationAction,
  }
}

export default useArchivedTasksActions
