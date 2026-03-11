<script setup lang="ts">
import type { EpidemiologicalWeekData } from '../composables/useEpidemiologicalWeek'
import { MONTHS_FULL, WEEKDAYS_SHORT } from '../composables/useEpidemiologicalWeek'

const { weekData } = useEpidemiologicalWeek()

const isOpen = ref(false)
const selectedWeekData = ref<EpidemiologicalWeekData>(weekData.value)

const viewMonth = ref(new Date().getMonth())
const viewYear = ref(new Date().getFullYear())

const emit = defineEmits<{
  'week-change': [data: EpidemiologicalWeekData]
}>()

const displayText = computed(() => {
  const data = selectedWeekData.value
  return `${data.weekText} (${data.periodText} ${data.year})`
})

const availableYears = computed(() => {
  const currentYear = new Date().getFullYear()
  return [currentYear, currentYear - 1]
})

const calendarDays = computed(() => {
  const year = viewYear.value
  const month = viewMonth.value

  const firstDayOfMonth = new Date(year, month, 1)
  const startDayOfWeek = firstDayOfMonth.getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const prevMonthLastDay = new Date(year, month, 0).getDate()

  const days: {
    date: Date
    day: number
    isCurrentMonth: boolean
    epiWeek: number
  }[] = []

  // Dias do mês anterior
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonthLastDay - i
    const date = new Date(year, month - 1, day)
    days.push({ date, day, isCurrentMonth: false, epiWeek: getEpidemiologicalWeek(date) })
  }

  // Dias do mês atual
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    days.push({ date, day, isCurrentMonth: true, epiWeek: getEpidemiologicalWeek(date) })
  }

  // Dias do próximo mês para completar a última semana
  const remainingDays = 7 - (days.length % 7)
  if (remainingDays < 7) {
    for (let day = 1; day <= remainingDays; day++) {
      const date = new Date(year, month + 1, day)
      days.push({ date, day, isCurrentMonth: false, epiWeek: getEpidemiologicalWeek(date) })
    }
  }

  return days
})

const calendarWeeks = computed(() => {
  const weeks: (typeof calendarDays.value)[] = []
  for (let i = 0; i < calendarDays.value.length; i += 7) {
    weeks.push(calendarDays.value.slice(i, i + 7))
  }
  return weeks
})

const visibleEpiWeeks = computed(() => {
  return calendarWeeks.value.map(week => week[0]?.epiWeek ?? 1)
})

// ============================================================================
// METHODS
// ============================================================================

function handleToggle() {
  isOpen.value = !isOpen.value
}

function handleBlur(event: FocusEvent) {
  const relatedTarget = event.relatedTarget as HTMLElement
  if (relatedTarget?.closest('.epi-calendar-dropdown')) return
  setTimeout(() => {
    isOpen.value = false
  }, 150)
}

function handleGoToToday() {
  const today = new Date()
  viewMonth.value = today.getMonth()
  viewYear.value = today.getFullYear()
  selectWeekByDate(today)
}

function selectWeekByDate(date: Date) {
  const epiWeek = getEpidemiologicalWeek(date)
  const { start: startDate, end: endDate } = getCurrentWeekRange(date)
  const year = date.getFullYear()

  const newWeekData: EpidemiologicalWeekData = {
    week: epiWeek,
    weekText: `SE ${epiWeek}`,
    periodText: `${formatShortDate(startDate)} a ${formatShortDate(endDate)}`,
    startDate,
    endDate,
    year
  }

  selectedWeekData.value = newWeekData
  emit('week-change', newWeekData)
  isOpen.value = false
}

function selectWeek(epiWeek: number) {
  const year = viewYear.value
  const firstDay = new Date(year, 0, 1)
  const dow = firstDay.getDay()
  const firstSunday = new Date(firstDay)
  if (dow !== 0) firstSunday.setDate(firstDay.getDate() + (7 - dow))

  const startDate = new Date(firstSunday)
  startDate.setDate(firstSunday.getDate() + (epiWeek - 1) * 7)

  selectWeekByDate(startDate)
}

function isDayInSelectedWeek(date: Date): 'start' | 'end' | 'between' | false {
  const selected = selectedWeekData.value
  if (!selected.startDate || !selected.endDate) return false

  const dayOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
  const startOnly = new Date(
    selected.startDate.getFullYear(),
    selected.startDate.getMonth(),
    selected.startDate.getDate()
  ).getTime()
  const endOnly = new Date(
    selected.endDate.getFullYear(),
    selected.endDate.getMonth(),
    selected.endDate.getDate()
  ).getTime()

  if (dayOnly === startOnly) return 'start'
  if (dayOnly === endOnly) return 'end'
  if (dayOnly > startOnly && dayOnly < endOnly) return 'between'
  return false
}

function isWeekSelected(epiWeek: number): boolean {
  return selectedWeekData.value.week === epiWeek && selectedWeekData.value.year === viewYear.value
}

function isToday(date: Date): boolean {
  const today = new Date()
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

// Atualiza a visualização quando a semana selecionada muda
watch(
  selectedWeekData,
  newData => {
    if (newData.startDate) {
      viewMonth.value = newData.startDate.getMonth()
      viewYear.value = newData.year
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="relative">
    <!-- Trigger Button -->
    <button
      type="button"
      class="flex w-full cursor-pointer items-center gap-2 rounded-full border border-base-200 bg-base-0 px-3 py-2 shadow-sm transition-colors hover:border-primary-300 hover:bg-base-50 sm:w-auto sm:px-4 sm:py-2.5"
      :aria-expanded="isOpen"
      aria-haspopup="dialog"
      @click="handleToggle"
      @blur="handleBlur"
    >
      <Icon
        name="lucide:calendar-days"
        class="size-4 shrink-0 text-primary-500"
        aria-hidden="true"
      />
      <span class="truncate text-xs font-medium text-base-700 sm:whitespace-nowrap sm:text-sm">
        {{ displayText }}
      </span>
      <Icon
        name="lucide:chevron-down"
        :class="[
          'size-4 shrink-0 text-primary-500 transition-transform duration-200',
          isOpen && 'rotate-180'
        ]"
        aria-hidden="true"
      />
    </button>

    <!-- Calendar Dropdown -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 -translate-y-2 scale-95"
    >
      <div
        v-if="isOpen"
        class="epi-calendar-dropdown absolute right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-secondary-200 bg-base-0 shadow-lg sm:left-0 sm:right-auto"
        role="dialog"
        aria-label="Selecionar semana epidemiológica"
      >
        <!-- Header: Mês, Ano, "ir para hoje" -->
        <div
          class="flex items-center gap-3 border-b border-secondary-200 bg-secondary-50 px-3 py-3"
        >
          <div class="flex flex-1 items-center gap-2">
            <!-- Month -->
            <div class="relative flex-1">
              <select
                v-model="viewMonth"
                class="h-8 w-full cursor-pointer appearance-none rounded-full border border-base-100 bg-base-0 px-3 pr-7 text-xs font-semibold text-base-950 focus:border-primary-500 focus:outline-none"
              >
                <option v-for="(month, index) in MONTHS_FULL" :key="index" :value="index">
                  {{ month }}
                </option>
              </select>
              <Icon
                name="lucide:chevron-down"
                class="pointer-events-none absolute right-2 top-1/2 size-3 -translate-y-1/2 text-primary-500"
              />
            </div>

            <!-- Year -->
            <div class="relative w-20">
              <select
                v-model="viewYear"
                class="h-8 w-full cursor-pointer appearance-none rounded-full border border-base-100 bg-base-0 px-3 pr-7 text-xs font-semibold text-base-950 focus:border-primary-500 focus:outline-none"
              >
                <option v-for="year in availableYears" :key="year" :value="year">
                  {{ year }}
                </option>
              </select>
              <Icon
                name="lucide:chevron-down"
                class="pointer-events-none absolute right-2 top-1/2 size-3 -translate-y-1/2 text-primary-500"
              />
            </div>
          </div>

          <button
            type="button"
            class="h-8 px-3 text-xs font-semibold text-secondary-600 transition-colors hover:text-secondary-800"
            @click="handleGoToToday"
          >
            ir para hoje
          </button>
        </div>

        <!-- Calendar Body -->
        <div class="flex">
          <!-- Epi Week Column -->
          <div class="flex flex-col bg-secondary-50 px-3 pt-4">
            <div
              class="mb-1 flex h-8 items-center justify-center text-center text-[10px] leading-tight text-secondary-500"
            >
              Semana<br />Epidem.
            </div>
            <div class="flex flex-col gap-1">
              <button
                v-for="(epiWeek, index) in visibleEpiWeeks"
                :key="index"
                type="button"
                :class="[
                  'flex size-9 items-center justify-center rounded text-sm transition-colors',
                  isWeekSelected(epiWeek)
                    ? 'bg-secondary-200 font-semibold text-secondary-700'
                    : 'text-base-600 hover:bg-secondary-100'
                ]"
                @click="selectWeek(epiWeek)"
              >
                {{ epiWeek }}
              </button>
            </div>
          </div>

          <!-- Calendar Grid -->
          <div class="p-4">
            <!-- Weekday Headers -->
            <div class="mb-1 flex gap-1">
              <div
                v-for="day in WEEKDAYS_SHORT"
                :key="day"
                class="flex size-9 items-center justify-center text-xs text-secondary-500"
              >
                {{ day }}
              </div>
            </div>

            <!-- Calendar Days -->
            <div class="flex flex-col gap-1">
              <div v-for="(week, weekIndex) in calendarWeeks" :key="weekIndex" class="flex gap-1">
                <button
                  v-for="(day, dayIndex) in week"
                  :key="dayIndex"
                  type="button"
                  :class="[
                    'relative flex size-9 items-center justify-center rounded text-sm transition-colors',
                    !day.isCurrentMonth && 'text-base-300',
                    day.isCurrentMonth &&
                      !isDayInSelectedWeek(day.date) &&
                      'text-base-600 hover:bg-secondary-50',
                    isDayInSelectedWeek(day.date) === 'start' &&
                      'bg-secondary-700 font-semibold text-white',
                    isDayInSelectedWeek(day.date) === 'end' &&
                      'bg-secondary-700 font-semibold text-white',
                    isDayInSelectedWeek(day.date) === 'between' &&
                      'bg-secondary-100 font-semibold text-secondary-700',
                    isToday(day.date) &&
                      !isDayInSelectedWeek(day.date) &&
                      'ring-2 ring-primary-500 ring-offset-1',
                    isToday(day.date) &&
                      isDayInSelectedWeek(day.date) &&
                      'ring-2 ring-primary-300 ring-offset-1'
                  ]"
                  @click="selectWeekByDate(day.date)"
                >
                  {{ day.day }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>
