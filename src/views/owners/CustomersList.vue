<script setup>
import { onMounted, computed, ref, reactive, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { notify } from '@kyvg/vue3-notification'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import { useOwnersStore } from '@/stores/owners'
import { months, years } from '@/helpers/vars'
import isSet from '@/helpers/isSet'

import AppFormSelect from '@/components/UI/AppFormSelect'
import AppTable from '@/components/UI/AppTable'
import AppFilter from '@/components/AppFilter'
import AppModal from '@/components/UI/AppModal'

const { t } = useI18n()

const router = useRouter()
const route = useRoute()

const ownersStore = useOwnersStore()
const { loadCustomers, deleteCustomer } = ownersStore
const { isLoading, isShowModalDeleteCustomer } = storeToRefs(ownersStore)

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
            key: 'sum_pause',
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

        const data = await loadCustomers({ ...query, year: filterParams.year })

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

watch(() => isShowModalDeleteCustomer.value, (val) => {
    if(!val) deleteItemId.value = null
})
</script>

<template>
    <div class="app-container">
        <div class="d-flex align-items-center justify-content-between">
            <h2 class="section-title">{{$t('customers')}}</h2>
            <button class="btn btn-blue" @click="isOpenFilter = true">{{ $t('filter') }}</button>
        </div>

        <div class="mt-4">
            <RouterLink class="btn btn-blue" :to="{ name: 'owner-create-customer'}">{{$t('create')}}</RouterLink>
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
                    {{ item.name }}
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
                <template #sum_pause="{ item }">
                    {{ item.sum_pause }}
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
                    <button class="btn btn-icon btn-blue">
                        <i class="fa-solid fa-eye"></i>
                    </button>
                    <button @click="deleteItemId = item.id; isShowModalDeleteCustomer = true" class="btn btn-icon btn-blue ms-2">
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

        <AppModal v-model="isShowModalDeleteCustomer">
            <template v-slot:title><span v-html="$t('are_you_sure_you_want_delete_customer')"></span></template>
            <div class="mt-2 d-flex justify-content-start">
                <button @click="initDeleteCustomer" class="btn btn-red">{{ $t('yes') }}</button>
                <button @click="isShowModalDeleteCustomer = false" class="btn btn-blue ms-3">{{ $t('cancel') }}</button>
            </div>
        </AppModal>
    </div>
</template>