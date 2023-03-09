<script setup>
import { onMounted, computed, ref, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { notify } from '@kyvg/vue3-notification'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import { useAdminStore } from '@/stores/admin'
import { companyStatuses } from '@/helpers/vars'
import isSet from '@/helpers/isSet'

import AppPagination from '@/components/UI/AppPagination'
import AppFormInput from '@/components/UI/AppFormInput'
import AppFormCheckbox from '@/components/UI/AppFormCheckbox'
import AppFormSelect from '@/components/UI/AppFormSelect'
import AppTable from '@/components/UI/AppTable'
import AppFilter from '@/components/AppFilter'
import AppModal from '@/components/UI/AppModal'

const { t } = useI18n()

const router = useRouter()
const route = useRoute()

const adminStore = useAdminStore()
const { loadCompanies, deleteCompany } = adminStore
const { isLoading, isShowModalDeleteCompany } = storeToRefs(adminStore)

const perPage = ref(null)
const page = ref(route.query.page ? +route.query.page : 1)
const totalItems = ref(null)

const isOpenFilter = ref(false)
const initialStateFilter = () => ({
    search: '',
    status: null
})

const filter = reactive(initialStateFilter())
const filterParams = reactive(initialStateFilter())

const searchFilter = () => {
    Object.assign(filterParams, filter)
    initLoadCompanies(true)
}

const deleteItemId = ref(null)
const isAgreeDeleteCompany = ref(false)

const items = ref([])

const sortParams = ref(null)

const fields = computed(() => {
    return [
        {
            text: 'ID',
            key: 'id'
        },
        {
            text: t('name'),
            key: 'name'
        },
        {
            text: t('customers_count'),
            key: 'customers_count',
            sortable: true,
        },
        {
            text: t('status'),
            key: 'status',
        },
        {
            text: t('created_at'),
            key: 'created_at',
            sortable: true,
        },
        {
            text: t('actions'),
            key: 'actions'
        },
    ]
})

const initLoadCompanies = async (isSearch) => {
    try {
        let query = {}

        if (isSearch) page.value = 1

        if (filterParams.search.length) query.search = filterParams.search
        if (isSet(filterParams.status)) query.status = filterParams.status

        if (page.value > 1) query.page = page.value

        if (sortParams.value) {
            query.order = sortParams.value.key
            query.sort = sortParams.value.sort
        }

        router.push({ query })

        const data = await loadCompanies({...query})

        items.value = data.data

        page.value = data.meta.current_page
        perPage.value = data.meta.per_page
        totalItems.value = data.meta.total

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

    if (isSet(route.query.search)) filter.search = route.query.search

    if (companyStatuses.find(i => i.id === route.query.status)) {
        filter.status = route.query.status
    }

    Object.assign(filterParams, filter)

    initLoadCompanies()
})

const initDeleteCompany = async () => {
    const id = deleteItemId.value

    try {
        await deleteCompany(id)

        notify({ type: "success", text: t('company_deleted') })

        initLoadCompanies()
    } catch (e) {
        notify({ type: "error", text: t(e.message) })
    }
}
</script>

<template>
    <div class="app-container">
        <div class="d-flex align-items-center justify-content-between">
            <h2 class="section-title">{{$t('companies')}}</h2>
            <button class="btn btn-blue" @click="isOpenFilter = true">{{ $t('filter') }}</button>
        </div>

        <div v-if="items.length" :class="{'state-update': isLoading}">
            <AppTable
                class-wrap="mt-4 pt-2"
                type="horizontal-scroll" 
                :fields="fields" 
                :data="items"
                :sort-params="sortParams"
                @update-sort-params="sortParams = $event; initLoadCompanies()"
            >
                <template #id="{ item }">
                    {{ item.id }}
                </template>
                <template #name="{ item }">
                    {{ item.company_name }}
                </template>
                <template #customers_count="{ item }">
                    {{ item.customers_count }}
                </template>
                <template #status="{ item }">
                    {{ $t(`company_status_${item.active_company}`) }}
                </template>
                <template #created_at="{ item }">
                    {{ item.created_at }}
                </template>
                <template #actions="{ item }">
                    <RouterLink :to="{name: 'admin-company-info', params: { id: item.id }}" class="btn btn-icon btn-blue">
                        <i class="fa-solid fa-info"></i>
                    </RouterLink>
                    <!-- <RouterLink :to="{name: 'admin-company-info', params: { id: item.id }}" class="btn btn-icon btn-blue">
                        <i class="fa-solid fa-users"></i>
                    </RouterLink> -->
                    <button @click="deleteItemId = item.id; isShowModalDeleteCompany = true" class="btn btn-icon btn-blue ms-2">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </template>
            </AppTable>
            <div class="mt-4">
                <AppPagination
                    @update:modelValue="page = $event; initLoadCompanies()"
                    :model-value="page" 
                    :records="totalItems" 
                    :per-page="perPage"
                />
            </div>
        </div>

        <p v-if="!isLoading && !items.length" class="mt-4 pt-2">{{ $t('no_posts') }}</p>

        <AppFilter
            :is-open="isOpenFilter"
            :is-loading="isLoading"
            @close="isOpenFilter = false"
            @reset="Object.assign(filter, initialStateFilter())"
            @search="searchFilter"
        >
            <AppFormInput
                :label="$t('id_name_email')"
                v-model="filter.search"
            />
            <div class="mt-3">
                <p class="app-label">{{ $t('status') }}</p>
                <AppFormSelect
                    v-model="filter.status"
                    :options="[
                        {
                            id: null,
                            name: 'no_selected'
                        },
                        ...companyStatuses
                    ]"
                    :getOptionLabel="option => $t(option.name)"
                    
                />
            </div>
        </AppFilter>

        <AppModal v-model="isShowModalDeleteCompany" @closed="deleteItemId = null; isAgreeDeleteCompany = false">
            <template v-slot:title><span v-html="$t('are_you_sure_you_want_delete_company')"></span></template>
            <div class="mt-2">
                <AppFormCheckbox 
                    v-model="isAgreeDeleteCompany"
                    :label="$t('i_agree_delete_company')"
                />
            </div>
            <div class="mt-3 d-flex justify-content-start">
                <button :disabled="!isAgreeDeleteCompany" @click="initDeleteCompany" class="btn btn-red">{{ $t('yes') }}</button>
                <button @click="isShowModalDeleteCompany = false" class="btn btn-blue ms-3">{{ $t('cancel') }}</button>
            </div>
        </AppModal>
    </div>
</template>