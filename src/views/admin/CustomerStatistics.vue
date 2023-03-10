<script setup>
import { onMounted, computed, ref, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { notify } from '@kyvg/vue3-notification'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import { useAdminStore } from '@/stores/admin'
import { months, years, trackerStatuses } from '@/helpers/vars'
import getFormattingTime from '@/helpers/getFormattingTime'
import isSet from '@/helpers/isSet'

import AppModal from '@/components/UI/AppModal'
import AppFormSelect from '@/components/UI/AppFormSelect'
import AppFormDatepicker from '@/components/UI/AppFormDatepicker'
import AppFormTextarea from '@/components/UI/AppFormTextarea'
import AppTable from '@/components/UI/AppTable'
import AppFilter from '@/components/AppFilter'
import TimeSpent from '@/components/TimeSpent'

const { t } = useI18n()

const router = useRouter()
const route = useRoute()

const adminStore = useAdminStore()
const { loadCustomerStatistic, loadCustomer, updateCustomerTracker, loadCompanyInfo } = adminStore
const { isLoading, isShowModalEditStatistic } = storeToRefs(adminStore)

const editTracker = ref(null)

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
    initLoadCustomerStatistic(true)
}

const companyName = ref('')
const customerName = ref('')

const items = ref([])

const fieldsForYears = computed(() => {
    return [
        {
            text: t('month'),
            key: 'date'
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
            text: t('total_pause'),
            key: 'sum_total_pause'
        },
        {
            text: t('total_work_days'),
            key: 'total_work_days'
        },
    ]
})

const initLoadCustomerStatistic = async (isSearch) => {
    try {
        items.value = []

        let query = {}

        if (filterParams.year !== defaultYear) query.year = filterParams.year
        if (isSet(filterParams.month)) query.month = filterParams.month

        router.push({ query })

        const data = await loadCustomerStatistic(route.params.customerId, { ...query, year: filterParams.year })

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
        {
            text: t('actions'),
            key: 'actions'
        },
    ]
})

onMounted(async () => {
    if (years.includes(+route.query.year)) filter.year = route.query.year

    if (months.find(i => i.id === route.query.month)) {
        filter.month = route.query.month
    }

    Object.assign(filterParams, filter)

    initLoadCustomerStatistic()
})

onMounted(async () => {
    try {
        const data = await loadCustomer(route.params.customerId)
        customerName.value = data.name
    } catch (e) {
        notify({ type: "error", text: e.message })
    }
})

onMounted(async () => {
    try {
        const data = await loadCompanyInfo(route.params.companyId)
        companyName.value = data.company_name
    } catch (e) {
        notify({ type: "error", text: e.message })
    }
})

const setEditTracker = (item) => {
    const obj = { ...item }

    obj.date_start = {
        hours: +item.date_start.split(':')[0],
        minutes: +item.date_start.split(':')[1],
    }

    obj.date_stop = {
        hours: +item.date_stop.split(':')[0],
        minutes: +item.date_stop.split(':')[1],
    }

    obj.total_pause = {
        hours: +item.total_pause.split(':')[0],
        minutes: +item.total_pause.split(':')[1],
    }

    editTracker.value = obj
}

const isInvalidDateStart = computed(() => {
    if(!editTracker.value) return true

    if (editTracker.value.date_start.hours > editTracker.value.date_stop.hours) return true
    
    if (
        editTracker.value.date_start.hours === editTracker.value.date_stop.hours &&
        editTracker.value.date_start.minutes > editTracker.value.date_stop.minutes
    ) {
        return true
    }

    return false
})

const isInvalidDateStop = computed(() => {
    if(!editTracker.value) return true

    if (editTracker.value.date_stop.hours < editTracker.value.date_start.hours) return true
    
    if (
        editTracker.value.date_stop.hours === editTracker.value.date_start.hours &&
        editTracker.value.date_stop.minutes < editTracker.value.date_start.minutes
    ) {
        return true
    }

    return false
})

const isInvalidTotalPause = computed(() => {
    if(!editTracker.value) return true

    if(isInvalidDateStart.value || isInvalidDateStop.value) return true

    let maxMinutesForMaxHour = editTracker.value.date_stop.minutes - editTracker.value.date_start.minutes
    let maxHour = editTracker.value.date_stop.hours - editTracker.value.date_start.hours

    if (maxMinutesForMaxHour < 0) {
        maxHour = maxHour - 1
        maxMinutesForMaxHour = 60 + maxMinutesForMaxHour
    }

    if (editTracker.value.total_pause.hours > maxHour) return true
    
    if (
        editTracker.value.total_pause.hours === maxHour &&
        editTracker.value.total_pause.minutes > maxMinutesForMaxHour
    ) {
        return true
    }

    return false
})

const isDisabledUpdateBtn = computed(() => {
    if(isLoading.value) return true

    if (!editTracker.value) return true

    if (editTracker.value.current_status !== 'stop_day') return false

    if (isInvalidDateStart.value || isInvalidDateStop.value || isInvalidTotalPause.value) return true

    return false
})

const initUpdateCustomerTracker = async () => {
    try {
        await updateCustomerTracker(editTracker.value.id, {
            date_start: getFormattingTime(editTracker.value.date_start.hours, editTracker.value.date_start.minutes),
            date_stop: getFormattingTime(editTracker.value.date_stop.hours, editTracker.value.date_stop.minutes),
            pause: getFormattingTime(editTracker.value.total_pause.hours, editTracker.value.total_pause.minutes),
            current_status: editTracker.value.current_status,
            comments: editTracker.value.comments,
        })

        initLoadCustomerStatistic()
    } catch (e) {
        notify({ type: "error", text: e.message })
    }
}
</script>

<template>
    <div class="app-container">
        <div class="breadcrumbs">
            <RouterLink :to="{name: 'companies'}">
                {{$t('companies')}}
            </RouterLink>
            <RouterLink :to="{name: 'admin-company-info', params: { id: route.params.companyId }}">
                {{ companyName }}
            </RouterLink>
            <RouterLink :to="{name: 'admin-company-customers', params: { id: route.params.companyId }}">
                {{$t('customers')}}
            </RouterLink>
            <span>{{ customerName }}</span>
        </div>
        
        <div class="d-flex align-items-center justify-content-between mt-4">
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
            <template #actions="{ item }">
                <template v-if="!item.total">
                    <button @click="setEditTracker(item); isShowModalEditStatistic = true" class="btn btn-icon btn-blue">
                        <i class="fa-solid fa-edit"></i>
                    </button>
                </template>
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

        <AppModal v-if="editTracker" v-model="isShowModalEditStatistic" @closed="editTracker = null">
            <template v-slot:title>
                <span>{{ `${$t(editTracker.date.split(',')[0])},  ${editTracker.date.split(',')[1]}` }}</span>
            </template>
            <template v-if="editTracker.current_status === 'stop_day'">
                <div class="app-field mb-4">
                    <p class="app-label">{{$t('start_work_time')}}</p>
                    <AppFormDatepicker
                        :auto-apply="true"
                        mode-height="120"
                        v-model="editTracker.date_start" 
                        time-picker
                    />
                    <div v-if="isInvalidDateStart" class="app-field__bottom">
                        <div class="invalid-feedback">{{$t('incorrect_field')}}</div>
                    </div>
                </div>
                <div class="app-field mb-4">
                    <p class="app-label">{{$t('stop_work_time')}}</p>
                    <AppFormDatepicker
                        :auto-apply="true"
                        mode-height="120"
                        v-model="editTracker.date_stop" 
                        time-picker
                    />
                    <div v-if="isInvalidDateStop" class="app-field__bottom">
                        <div class="invalid-feedback">{{$t('incorrect_field')}}</div>
                    </div>
                </div>
                <div class="app-field mb-4">
                    <p class="app-label">{{$t('total_pause')}}</p>
                    <AppFormDatepicker
                        :auto-apply="true"
                        mode-height="120"
                        v-model="editTracker.total_pause" 
                        time-picker
                    />
                    <div v-if="isInvalidTotalPause" class="app-field__bottom">
                        <div class="invalid-feedback">{{$t('incorrect_field')}}</div>
                    </div>
                </div>
            </template>
            <div class="mb-4">
                <p class="app-label">{{ $t('current_status') }}</p>
                <AppFormSelect 
                    v-model="editTracker.current_status"
                    :options="trackerStatuses"
                    :reduce="option => option"
                    :getOptionLabel="option => $t(option)"
                />
            </div>
            <AppFormTextarea
                :label="$t('comments')" 
                v-model="editTracker.comments" 
            />
            <div class="mt-3 d-flex justify-content-start">
                <button @click="isShowModalEditStatistic = false" class="btn btn-red">{{ $t('cancel') }}</button>
                <button @click="initUpdateCustomerTracker" :disabled="isDisabledUpdateBtn" class="btn btn-blue ms-3">{{ $t('update') }}</button>
            </div>
        </AppModal>
    </div>
</template>