import * as React from 'react'
import { Calendar } from '@/components/ui/calendar'
import { DateRange } from 'react-day-picker'
import { ru } from 'date-fns/locale'

interface Props {
  startDate?: Date
  endDate?: Date
  onChange: (range: { startDate?: Date; endDate?: Date }) => void
  minDate?: Date
  maxDate?: Date
}

export const ShadcnRangePicker: React.FC<Props> = ({
  startDate,
  endDate,
  onChange,
}) => {
  const [range, setRange] = React.useState<DateRange | undefined>({
    from: startDate,
    to: endDate,
  })

  const initialMonth = startDate ?? new Date()

  React.useEffect(() => {
    setRange({ from: startDate, to: endDate })
  }, [startDate, endDate])

  const handleSelect = (newRange: DateRange | undefined) => {
    setRange(newRange)
    onChange({
      startDate: newRange?.from,
      endDate: newRange?.to,
    })
  }

  return (
    <Calendar
      mode="range"
      locale={ru}
      selected={range}
      onSelect={handleSelect}
      numberOfMonths={1}
      defaultMonth={initialMonth}
      weekStartsOn={1}
    />
  )
}

