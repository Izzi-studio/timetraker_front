<script setup>
import { onMounted, computed, ref, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { notify } from '@kyvg/vue3-notification'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import { useAdminStore } from '@/stores/admin'
import { months, years } from '@/helpers/vars'
import isSet from '@/helpers/isSet'

import AppFormSelect from '@/components/UI/AppFormSelect'
import AppTable from '@/components/UI/AppTable'
import AppFilter from '@/components/AppFilter'
import AppModal from '@/components/UI/AppModal'

const { t } = useI18n()

const router = useRouter()
const route = useRoute()

const adminStore = useAdminStore()
const { loadCustomers, deleteCustomer, loadCompanyInfo } = adminStore
const { isLoading, isShowModalDeleteCustomer } = storeToRefs(adminStore)

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
    initLoadCustomers(true)
}

const companyName = ref('')

const deleteItemId = ref(null)

const items = ref([])

const sortParams = ref(null)

const fields = computed(() => {
    return [
        {
            text: t('name'),
            key: 'name'
        },
        {
            text: t('email'),
            key: 'email'
        },
        {
            text: t('position'),
            key: 'position'
        },
        {
            text: t('total_work'),
            key: 'sum_total_work',
            sortable: true,
        },
        {
            text: t('total_pause'),
            key: 'sum_total_pause',
            sortable: true,
        },
        {
            text: t('total_work_days'),
            key: 'work_days_count',
            sortable: true,
        },
        {
            text: t('total_sick_days'),
            key: 'sick_days_count',
            sortable: true,
        },
        {
            text: t('total_vacation_days'),
            key: 'vacation_days_count',
            sortable: true,
        },
        {
            text: t('weekend_days'),
            key: 'weekend_days_count',
            sortable: true,
        },
        {
            text: t('actions'),
            key: 'actions'
        },
    ]
})

const initLoadCustomers = async (isSearch) => {
    try {
        let query = {}

        if (filterParams.year !== defaultYear) query.year = filterParams.year
        if (isSet(filterParams.month)) query.month = filterParams.month

        if (sortParams.value) {
            query.order = sortParams.value.key
            query.sort = sortParams.value.sort
        }

        router.push({ query })

        const data = await loadCustomers({ ...query, year: filterParams.year, company_id: route.params.id })

        items.value = data.data

        if (isSearch) {
            isOpenFilter.value = false
        }
    } catch (e) {
        items.value = []

        notify({ type: "error", text: e.message })
    }
}

onMounted(async () => {
    if ((isSet(route.query.order) && isSet(route.query.sort))) {
        if (
            fields.value.filter(i => i.sortable).map(i => i.key).includes(route.query.order) &&
            ['asc', 'desc'].includes(route.query.sort)
        ) {
            sortParams.value = {
                key: route.query.order,
                sort: route.query.sort
            }
        }
    }

    if (years.includes(+route.query.year)) filter.year = route.query.year

    if (months.find(i => i.id === route.query.month)) {
        filter.month = route.query.month
    }

    Object.assign(filterParams, filter)

    initLoadCustomers()
})

const initDeleteCustomer = async () => {
    const id = deleteItemId.value

    try {
        await deleteCustomer(id)

        items.value = items.value.filter(i => i.id !== id)

        notify({ type: "success", text: t('customer_deleted') })
    } catch (e) {
        notify({ type: "error", text: t(e.message) })
    }
}

onMounted(async () => {
    try {
        const data = await loadCompanyInfo(route.params.id)
        companyName.value = data.company_name
    } catch (e) {
        notify({ type: "error", text: e.message })
    }
})
</script>

<template>
    <div class="app-container">
        <div class="breadcrumbs">
            <RouterLink :to="{name: 'companies'}">{{$t('companies')}}</RouterLink>
            <RouterLink :to="{name: 'admin-company-info', params: { id: route.params.id }}">
                {{ companyName }}
            </RouterLink>
            <span>{{$t('customers')}}</span>
        </div>

        <div class="d-flex align-items-center justify-content-between mt-4">
            <h2 class="section-title">{{$t('customers')}}</h2>
            <button class="btn btn-blue" @click="isOpenFilter = true">{{ $t('filter') }}</button>
        </div>

        <div class="mt-4">
            <RouterLink class="btn btn-blue" :to="{ name: 'admin-company-customers-create'}">{{$t('create')}}</RouterLink>
        </div>

        <div v-if="items.length" :class="{'state-update': isLoading}">
            <AppTable
                class-wrap="mt-4 pt-2"
                type="horizontal-scroll" 
                :fields="fields" 
                :data="items"
                :sort-params="sortParams"
                @update-sort-params="sortParams = $event; initLoadCustomers()"
            >
                <template #name="{ item }">
                    <span :class="{'color-blue': item.owner}">
                        {{ item.name }}
                        <sup v-if="item.owner">{{$t('owner')}}</sup>
                    </span>
                </template>
                <template #email="{ item }">
                    {{ item.email }}
                </template>
                <template #position="{ item }">
                    {{ item.position }}
                </template>
                <template #sum_total_work="{ item }">
                    {{ item.sum_total_work }}
                </template>
                <template #sum_total_pause="{ item }">
                    {{ item.sum_total_pause }}
                </template>
                <template #work_days_count="{ item }">
                    {{ item.work_days_count }}
                </template>
                <template #sick_days_count="{ item }">
                    {{ item.sick_days_count }}
                </template>
                <template #vacation_days_count="{ item }">
                    {{ item.vacation_days_count }}
                </template>
                <template #weekend_days_count="{ item }">
                    {{ item.weekend_days_count }}
                </template>
                <template #actions="{ item }">
                    <RouterLink 
                        :to="{
                            name: 'admin-company-customer-info', 
                            params: { companyId: route.params.id, customerId: item.id }
                        }" 
                        class="btn btn-icon btn-blue"
                    >
                        <i class="fa-solid fa-info"></i>
                    </RouterLink>
                    <RouterLink 
                        :to="{
                            name: 'admin-company-customer-statistics', 
                            params: { companyId: route.params.id, customerId: item.id }
                        }" 
                        class="btn btn-icon btn-blue ms-2"
                    >
                        <i class="fa-solid fa-table"></i>
                    </RouterLink>
                    <button :disabled="item.owner" @click="deleteItemId = item.id; isShowModalDeleteCustomer = true" class="btn btn-icon btn-blue ms-2">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </template>
            </AppTable>
        </div>

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

        <AppModal v-model="isShowModalDeleteCustomer" @closed="deleteItemId = null">
            <template v-slot:title><span v-html="$t('are_you_sure_you_want_delete_customer')"></span></template>
            <div class="mt-2 d-flex justify-content-start">
                <button @click="initDeleteCustomer" class="btn btn-red">{{ $t('yes') }}</button>
                <button @click="isShowModalDeleteCustomer = false" class="btn btn-blue ms-3">{{ $t('cancel') }}</button>
            </div>
        </AppModal>
    </div>
</template>