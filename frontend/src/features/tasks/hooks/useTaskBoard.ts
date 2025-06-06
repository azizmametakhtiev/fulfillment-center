import { useCallback, useEffect, useRef, useState } from 'react'
import { TaskWithPopulate } from '@/types'
import { useAppDispatch, useAppSelector } from '@/app/hooks.ts'
import { selectDraggingTask, selectLoadingFetchTask, selectPopulatedTasks } from '@/store/slices/taskSlice.ts'
import { fetchTasksByUserIdWithPopulate, fetchTasksWithPopulate } from '@/store/thunks/tasksThunk.ts'
import { selectAllUsers, selectUsersLoading } from '@/store/slices/userSlice.ts'
import { fetchUsers } from '@/store/thunks/userThunk.ts'
import { PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import dayjs from 'dayjs'
import { useNavigate, useParams } from 'react-router-dom'

export const useTaskBoard = () => {
  const dispatch = useAppDispatch()

  const draggingTask = useAppSelector(selectDraggingTask)
  const tasks = useAppSelector(selectPopulatedTasks)
  const users = useAppSelector(selectAllUsers)
  const selectFetchUser = useAppSelector(selectUsersLoading)
  const loadingTasks = useAppSelector(selectLoadingFetchTask)

  const [todoItems, setTodoItems] = useState<TaskWithPopulate[]>([])
  const [doneItems, setDoneItems] = useState<TaskWithPopulate[]>([])
  const [inProgressItems, setInProgressItems] = useState<TaskWithPopulate[]>([])

  const { id } = useParams()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [openDetailsModal, setOpenDetailsModal] = useState(false)

  const inputRef = useRef<HTMLInputElement | null>(null)

  const fetchAllTasks = useCallback(async () => {
    setTodoItems([])
    setInProgressItems([])
    setDoneItems([])
    await dispatch(fetchTasksWithPopulate())
  }, [dispatch])

  useEffect(() => {
    void fetchAllTasks()
  }, [dispatch, fetchAllTasks])

  useEffect(() => {
    if (selectFetchUser) {
      setLoading(false)
    }
  }, [selectFetchUser])

  const handleOpen = () => setOpen(true)

  const handleClose = () => {
    setOpen(false)
    void fetchAllTasks()
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
  )

  useEffect(() => {
    if(selectFetchUser || loadingTasks){
      setDoneItems([])
      setInProgressItems([])
      setTodoItems([])
    }
  }, [dispatch, fetchAllTasks, loadingTasks, selectFetchUser])

  useEffect(() => {
    if (id) {
      setOpenDetailsModal(true)
    } else {
      setOpenDetailsModal(false)
    }
  }, [id])

  const handleCloseDetailsModal = () => {
    void fetchAllTasks()
    setOpenDetailsModal(false)
    navigate('/tasks', { replace: true })
  }

  const filterTasksByStatus = useCallback((status: string) => {
    if(tasks){
      return tasks?.filter(task => task.status === status)
    }
    return []
  }, [tasks])

  const filterTasks = (items: TaskWithPopulate[]) =>
    items
      .filter(item =>
        (searchQuery === '' ||
          item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (item.createdAt && dayjs(item.createdAt).format('DD.MM.YYYY HH:mm').includes(searchQuery)) ||
          (item.updatedAt && dayjs(item.updatedAt).format('DD.MM.YYYY HH:mm').includes(searchQuery))),
      )
      .map(item => ({
        ...item,
        key: item._id,
        createdAtFormatted: item.createdAt ? dayjs(item.createdAt).format('DD.MM.YYYY HH:mm') : '',
        updatedAtFormatted: item.updatedAt ? dayjs(item.updatedAt).format('DD.MM.YYYY HH:mm') : '',
      }))

  useEffect(() => {
    if(tasks){
      setTodoItems(filterTasksByStatus('к выполнению'))
      setDoneItems(filterTasksByStatus('готово'))
      setInProgressItems(filterTasksByStatus('в работе'))
    }
  }, [filterTasksByStatus, tasks])


  const fetchAllUsers = useCallback(async () => {
    await dispatch(fetchUsers())
  }, [dispatch])

  useEffect(() => {
    void fetchAllUsers()
  }, [dispatch, fetchAllUsers])

  useEffect(() => {
    if (selectFetchUser) {
      setLoading(false)
    }
  }, [selectFetchUser])

  const clearAllFilters = async () => {
    setSearchQuery('')
    setSelectedUser(null)
    inputRef.current?.focus()
    setTodoItems([])
    setInProgressItems([])
    setDoneItems([])
    await dispatch(fetchTasksWithPopulate())
  }

  const clearSearch =  async () => {
    setSearchQuery('')
    inputRef.current?.focus()
    if (selectedUser) {
      setTodoItems([])
      setInProgressItems([])
      setDoneItems([])
      await dispatch(fetchTasksByUserIdWithPopulate(selectedUser))
    } else {
      await dispatch(fetchTasksWithPopulate())
    }
  }
  return {
    id,
    todoItems,
    doneItems,
    inProgressItems,
    setDoneItems,
    setTodoItems,
    setInProgressItems,
    draggingTask,
    open,
    loading,
    openDetailsModal,
    searchQuery,
    users,
    clearAllFilters,
    clearSearch,
    filterTasks,
    setSearchQuery,
    inputRef,
    selectedUser,
    setSelectedUser,
    sensors,
    selectFetchUser,
    handleOpen,
    handleClose,
    dispatch,
    handleCloseDetailsModal,
  }
}
