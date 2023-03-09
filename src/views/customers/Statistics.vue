<script setup>
import { onMounted, computed, ref, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { notify } from '@kyvg/vue3-notification'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import { useCustomersStore } from '@/stores/customers'
import { months, years } from '@/helpers/vars'
import isSet from '@/helpers/isSet'

import AppFormSelect from '@/components/UI/AppFormSelect'
import AppTable from '@/components/UI/AppTable'
import AppFilter from '@/components/AppFilter'
import TimeSpent from '@/components/TimeSpent'

const { t } = useI18n()

const router = useRouter()
const route = useRoute()

const customersStore = useCustomersStore()
const { loadStatistic } = customersStore
const { isLoading } = storeToRefs(customersStore)

const defaultYear = new Date().getFullYear()
const isOpenFilter = ref(false)
const initialStateFilter = () => ({
    year: defaultYear,
    month: null,
})

const filter = reactive(initialStateFilter())
const filterParams = reactive(initialStateFilter())

const searchFilter = () => {
    Object.assign(filterParams, filter)
    initLoadStatistics(true)
}

const items = ref([])

const fieldsForYears = computed(() => {
    return [
        {
            text: t('month'),
            key: 'date'
        },
        {
            text: t('total_pause'),
            key: 'sum_total_pause'
        },
        {
            text: t('total_sick_days'),
            key: 'total_sick_days'
        },
        {
            text: t('total_vacation_days'),
            key: 'total_vacation_days'
        },
        {
            text: t('total_work'),
            key: 'sum_total_work'
        },
        {
            text: t('total_work_days'),
            key: 'total_work_days'
        },
    ]
})

const initLoadStatistics = async (isSearch) => {
    try {
        items.value = []

        let query = {}

        if (filterParams.year !== defaultYear) query.year = filterParams.year
        if (isSet(filterParams.month)) query.month = filterParams.month

        router.push({ query })

        const data = await loadStatistic({ ...query, year: filterParams.year })

        items.value = data.data

        if (isSearch) {
            isOpenFilter.value = false
        }
    } catch (e) {
        notify({ type: "error", text: e.message })
    }
}

const fieldsForYearsAndMonth = computed(() => {
    return [
        {
            text: t('date'),
            key: 'date'
        },
        {
            text: t('start_work_time'),
            key: 'date_start'
        },
        {
            text: t('stop_work_time'),
            key: 'date_stop'
        },

        {
            text: t('total_work'),
            key: 'total_work'
        },
        {
            text: t('total_pause'),
            key: 'total_pause'
        },
        {
            text: t('current_status'),
            key: 'current_status'
        },
        {
            text: t('comments'),
            key: 'comments'
        },
    ]
})

onMounted(async () => {
    if (years.includes(+route.query.year)) filter.year = route.query.year

    if (months.find(i => i.id === route.query.month)) {
        filter.month = route.query.month
    }

    Object.assign(filterParams, filter)

    initLoadStatistics()
})
</script>

<template>
    <div class="app-container">
        <div class="d-flex align-items-center justify-content-between">
            <h2 class="section-title">{{$t('statistics')}}</h2>
            <button class="btn btn-blue" @click="isOpenFilter = true">{{ $t('filter') }}</button>
        </div>
        
        <AppTable
            v-if="items.length && filterParams.month && !isLoading"
            class-wrap="mt-4 pt-2"
            type="horizontal-scroll" 
            :fields="fieldsForYearsAndMonth" 
            :data="[
                {
                    total: true,
                    total_work: items.reduce((sum, current) => sum + current.work_minutes, 0) * 60,
                    total_pause: items.reduce((sum, current) => sum + current.pause_minutes, 0) * 60,
                },
                ...items
            ]"
        >
            <template #date="{ item }">
                <template v-if="item.total">
                    {{$t('total')}}
                </template>
                <template v-else>
                    {{ `${$t(item.date.split(',')[0])},  ${item.date.split(',')[1]}` }}
                </template>
            </template>
            <template #date_start="{ item }">
                {{ item.date_start }}
            </template>
            <template #date_stop="{ item }">
                {{ item.date_stop }}
            </template>
            <template #total_work="{ item }">
                <template v-if="item.total">
                    <TimeSpent :value="item.total_work" />
                </template>
                <template v-else>
                    {{ item.total_work }}
                </template>
            </template>
            <template #total_pause="{ item }">
                <template v-if="item.total">
                    <TimeSpent :value="item.total_pause" />
                </template>
                <template v-else>
                    {{ item.total_pause }}
                </template>
            </template>
            <template #current_status="{ item }">
                <template v-if="!item.total">
                    {{ $t(item.current_status) }}
                </template>
            </template>
            <template #comments="{ item }">
                {{ item.comments }}
            </template>
        </AppTable>

        <AppTable
            v-if="items.length && !filterParams.month && !isLoading"
            class-wrap="mt-4 pt-2"
            type="horizontal-scroll" 
            :fields="fieldsForYears" 
            :data="items"
        >
            <template #date="{ item }">
                {{ $t(item.date) }}
            </template>
            <template #sum_total_pause="{ item }">
                {{ item.sum_total_pause }}
            </template>
            <template #total_sick_days="{ item }">
                {{ item.total_sick_days }}
            </template>
            <template #total_vacation_days="{ item }">
                {{ item.total_vacation_days }}
            </template>
            <template #sum_total_work="{ item }">
                {{ item.sum_total_work }}
            </template>
            <template #total_work_days="{ item }">
                {{ item.total_work_days }}
            </template>
        </AppTable>

        <p v-if="!isLoading && !items.length" class="mt-4 pt-2">{{ $t('no_posts') }}</p>

        <AppFilter
            :is-open="isOpenFilter"
            :is-loading="isLoading"
            @close="isOpenFilter = false"
            @reset="Object.assign(filter, initialStateFilter())"
            @search="searchFilter"
        >
            <div class="mb-3">
                <p class="app-label">{{ $t('year') }}</p>
                <AppFormSelect
                    v-model="filter.year"
                    :options="years"
                    :reduce="option => option"
                />
            </div>
            <div>
                <p class="app-label">{{ $t('month') }}</p>
                <AppFormSelect
                    v-model="filter.month"
                    :options="[
                        {
                            id: null,
                            name: 'no_selected'
                        },
                        ...months
                    ]"
                    :getOptionLabel="option => $t(option.name)"
                />
            </div>
        </AppFilter>
    </div>
</template>