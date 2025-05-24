import React, { useEffect, useState } from 'react'
import { UserStripped } from '@/types'
import { useAppDispatch } from '@/app/hooks'
import { fetchTasksByUserIdWithPopulate, fetchTasksWithPopulate } from '@/store/thunks/tasksThunk'
import { UserListProps } from '../hooks/TypesProps'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { getUsersInitials } from '@/utils/getUsersInitials.ts'

const UserList: React.FC<UserListProps> = ({ users, selectedUser, setSelectedUser }) => {
  const dispatch = useAppDispatch()
  const [searchTerm, setSearchTerm] = useState('')
  const [topUsers, setTopUsers] = useState<UserStripped[]>(users.slice(0, 4))
  const [remainingUsers, setRemainingUsers] = useState<UserStripped[]>(users.slice(4))
  const [open, setOpen] = useState(false)

  const handleUserClick = async (userId: string) => {
    setOpen(false)
    if (selectedUser === userId) {
      setSelectedUser(null)
      await dispatch(fetchTasksWithPopulate())
    } else {
      setSelectedUser(userId)
      await dispatch(fetchTasksByUserIdWithPopulate(userId))
    }
  }

  const user = remainingUsers.find(u => u._id === selectedUser)

  useEffect(() => {
    if (user) {
      setTopUsers(prevTopUsers => {
        const newTopUsers = [...prevTopUsers, user]
        const firstTopUser = newTopUsers[0]
        const finalTopUsers = newTopUsers.slice(1)

        setRemainingUsers(prevRemainingUsers => {
          const newRemainingUsers = prevRemainingUsers.filter(u => u._id !== user._id)
          return [...newRemainingUsers, firstTopUser]
        })

        return finalTopUsers
      })
    }
  }, [user])

  return (
    <div className="flex items-center">
      {topUsers.map(user => (
        <Tooltip key={user._id}>
          <TooltipTrigger asChild>
            <div
              className={`relative h-[52px] w-[52px] -ml-3 first:ml-0 z-0 cursor-pointer
                      hover:z-10 transition-transform duration-100
                      ${ selectedUser === user._id ? 'z-10' : '' }`}
              onClick={() => handleUserClick(user._id)}
            >
              <div
                className={`w-full h-full flex items-center justify-center rounded-full bg-white group
                        ${ selectedUser === user._id
          ? 'border-2 border-blue-400'
          : 'hover:border-2 hover:border-blue-400' }
                      `}
              >
                <div
                  className={`flex items-center justify-center   text-gray-600 text-[18px] rounded-full w-[85%] h-[85%] font-bold
                  ${ selectedUser === user._id
          ? 'bg-blue-200'
          : 'bg-gray-200 group-hover:bg-blue-200' }`}
                >
                  {getUsersInitials(user.displayName)}
                </div>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <strong>{user.displayName}</strong>
          </TooltipContent>
        </Tooltip>
      ))}

      {remainingUsers.length > 0 && (
        <Popover open={open} onOpenChange={setOpen}>
          <Tooltip>
            <TooltipTrigger asChild>
              <PopoverTrigger asChild>
                <div
                  onClick={() => setOpen(!open)}
                  className={`relative h-[44px] w-[44px] first:ml-0 z-0 cursor-pointer
                      hover:z-10 transition-transform duration-100`}
                >
                  <div
                    className="w-full h-full flex items-center justify-center rounded-full bg-white hover:border-2 hover:border-gray-300"
                  >
                    <div
                      className="flex items-center justify-center bg-gray-200 text-gray-500 text-[18px] tracking-[-0.1em] rounded-full w-[85%] h-[85%]"
                    >
                      +{remainingUsers.length}
                    </div>
                  </div>
                </div>
              </PopoverTrigger>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              Выбрать пользователя
            </TooltipContent>
          </Tooltip>

          <PopoverContent className="w-60 p-2">
            <Command>
              <CommandInput
                placeholder="Поиск..."
                value={searchTerm}
                onValueChange={setSearchTerm}
              />
              <CommandList>
                <CommandEmpty>Пользователи не найдены</CommandEmpty>
                {remainingUsers
                  .filter(user =>
                    user.displayName.toLowerCase().includes(searchTerm.toLowerCase()),
                  )
                  .map(user => (
                    <CommandItem
                      key={user._id}
                      onSelect={() => handleUserClick(user._id)}
                      className="cursor-pointer"
                    >
                      {user.displayName}
                    </CommandItem>
                  ))}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}

export default UserList
