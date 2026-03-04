<script setup lang="ts">
const isOpen = ref(false)
const selectedWeek = ref(9)

// Mock: semanas epidemiológicas do ano
const months = [
  'jan.',
  'fev.',
  'mar.',
  'abr.',
  'mai.',
  'jun.',
  'jul.',
  'ago.',
  'set.',
  'out.',
  'nov.',
  'dez.'
]

const weekOptions = computed(() => {
  const currentYear = new Date().getFullYear()
  const firstDayOfYear = new Date(currentYear, 0, 1)
  const dow = firstDayOfYear.getDay()
  const firstSunday = new Date(firstDayOfYear)
  if (dow !== 0) firstSunday.setDate(firstDayOfYear.getDate() + (7 - dow))

  const options = []
  for (let week = 1; week <= selectedWeek.value; week++) {
    const start = new Date(firstSunday)
    start.setDate(firstSunday.getDate() + (week - 1) * 7)
    const end = new Date(start)
    end.setDate(start.getDate() + 6)

    const startDay = start.getDate().toString().padStart(2, '0')
    const startMonth = months[start.getMonth()]
    const endDay = end.getDate().toString().padStart(2, '0')
    const endMonth = months[end.getMonth()]
    const periodText =
      start.getMonth() === end.getMonth()
        ? `${startDay} a ${endDay} ${endMonth}`
        : `${startDay} ${startMonth} a ${endDay} ${endMonth}`

    options.push({ week, weekText: `SE ${week}`, periodText, year: currentYear })
  }
  return options.reverse()
})

const displayText = computed(() => {
  const current = weekOptions.value.find(o => o.week === selectedWeek.value)
  if (!current) return 'SE 9'
  return `${current.weekText} (${current.periodText} ${current.year})`
})

function handleSelect(option: { week: number }) {
  selectedWeek.value = option.week
  isOpen.value = false
}

function handleToggle() {
  isOpen.value = !isOpen.value
}

function handleBlur() {
  setTimeout(() => {
    isOpen.value = false
  }, 200)
}
</script>

<template>
  <div class="relative">
    <button
      type="button"
      class="flex cursor-pointer items-center gap-2 rounded-full border border-base-200 bg-base-0 px-4 py-2.5 shadow-sm transition-colors hover:border-primary-300 hover:bg-base-50"
      :aria-expanded="isOpen"
      aria-haspopup="listbox"
      @click="handleToggle"
      @blur="handleBlur"
    >
      <Icon
        name="lucide:calendar-days"
        class="size-4 shrink-0 text-primary-500"
        aria-hidden="true"
      />

      <span
        class="min-w-0 flex-1 truncate whitespace-nowrap text-left text-sm font-medium text-base-700"
      >
        {{ displayText }}
      </span>

      <Icon
        :name="isOpen ? 'lucide:chevron-up' : 'lucide:chevron-down'"
        class="size-4 shrink-0 text-primary-500 transition-transform duration-200"
        aria-hidden="true"
      />
    </button>

    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="isOpen"
        class="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-base-100 bg-base-0 shadow-lg"
        role="listbox"
      >
        <ul class="max-h-80 overflow-y-auto py-2">
          <li
            v-for="option in weekOptions"
            :key="option.week"
            role="option"
            :aria-selected="selectedWeek === option.week"
            :class="[
              'flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors',
              selectedWeek === option.week
                ? 'bg-primary-50 text-primary-900'
                : 'text-base-950 hover:bg-secondary-50'
            ]"
            @mousedown.prevent="handleSelect(option)"
          >
            <Icon
              name="lucide:calendar-days"
              :class="[
                'size-5 shrink-0',
                selectedWeek === option.week ? 'text-primary-900' : 'text-secondary-400'
              ]"
            />
            <div class="min-w-0 flex-1">
              <p class="text-sm font-medium">
                {{ option.weekText }}
                <span class="font-normal text-secondary-600">
                  ({{ option.periodText }} {{ option.year }})
                </span>
              </p>
            </div>
            <Icon
              v-if="selectedWeek === option.week"
              name="lucide:check"
              class="size-4 shrink-0 text-primary-900"
            />
          </li>
        </ul>
      </div>
    </Transition>
  </div>
</template>
