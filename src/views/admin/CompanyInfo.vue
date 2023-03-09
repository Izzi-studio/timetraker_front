<script setup>
import { reactive, computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { notify } from '@kyvg/vue3-notification'
import { required, email } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useAdminStore } from '@/stores/admin'
import { companyStatuses } from '@/helpers/vars'

import AppFormInput from '@/components/UI/AppFormInput'
import AppFormSelect from '@/components/UI/AppFormSelect'

const { t } = useI18n()

const route = useRoute()

const adminStore = useAdminStore()
const { loadCompanyInfo, updateCompanyInfo, requestOnChangeCompanyInfo } = adminStore
const { isLoading } = storeToRefs(adminStore)

const info = ref(null)

const form = reactive({
    company_email: '',
    company_name: '',
    company_phone: '',
    company_address: '',
    status: '',
})

const rules = {
    company_name: { required },
    company_email: { required, email },
}

const v$ = useVuelidate(rules, form)

const isDisabled = computed(() => {
    return (v$.value.$dirty && v$.value.$invalid) || isLoading.value
})

onMounted(async () => {
    try {
        const data = await loadCompanyInfo(route.params.id)

        info.value = data

        form.company_email = info.value.company_email
        form.company_name = info.value.company_name
        form.company_phone = info.value.company_phone
        form.company_address = info.value.company_address
        form.status = info.value.active_company
    } catch (e) {
        notify({ type: "error", text: e.message })
    }
})

const formHandler = async () => {
    if (v$.value.$invalid) {
        v$.value.$touch()
        return
    }

    try {
        const data = await updateCompanyInfo(route.params.id, form)

        info.value = data

        notify({ type: "success", text: t('company_updated') })
    } catch (e) {
        notify({ type: "error", text: e.message })
    }
}

const initRequestOnChangeCompanyInfo = async (val) => {
    try {
        const data = await requestOnChangeCompanyInfo(info.value.company_request_update_info.id, val)

        info.value = data

        form.company_email = info.value.company_email
        form.company_name = info.value.company_name
        form.company_phone = info.value.company_phone
        form.company_address = info.value.company_address
        form.status = info.value.active_company
    } catch (e) {
        notify({ type: "error", text: e.message })
    }
}
</script>

<template>
    <div v-if="info" class="container">
        <div class="breadcrumbs">
            <RouterLink :to="{name: 'companies'}">{{$t('companies')}}</RouterLink>
            <span>{{ info.company_name }}</span>
        </div>
        <div v-if="info.company_request_update_info" class="wrapper mt-4">
            <h4>{{$t('request_on_change_data')}}</h4>
            <div class="mt-4">
                <div class="app-label">{{$t('company_email')}}</div>
                <div class="input-read-only" :class="{'border-blue': info.company_request_update_info.request_data_update.company_email !== info.company_email}">
                    {{ info.company_request_update_info.request_data_update.company_email }}
                </div>
            </div>
            <div class="mt-4">
                <div class="app-label">{{$t('company_name')}}</div>
                <div class="input-read-only" :class="{'border-blue': info.company_request_update_info.request_data_update.company_name !== info.company_name}">
                    {{ info.company_request_update_info.request_data_update.company_name }}
                </div>
            </div>
            <div class="mt-4">
                <div class="app-label">{{$t('company_phone')}}</div>
                <div class="input-read-only" :class="{'border-blue': info.company_request_update_info.request_data_update.company_phone !== info.company_phone}">
                    {{ info.company_request_update_info.request_data_update.company_phone }}
                </div>
            </div>
            <div class="mt-4">
                <div class="app-label">{{$t('company_address')}}</div>
                <div class="input-read-only" :class="{'border-blue': info.company_request_update_info.request_data_update.company_address !== info.company_address}">
                    {{ info.company_request_update_info.request_data_update.company_address }}
                </div>
            </div>
            <div class="d-flex mt-4">
                <button @click="initRequestOnChangeCompanyInfo('2')" :disabled="isLoading" class="btn btn-red">
                    {{$t('cancel')}}
                </button>
                <button @click="initRequestOnChangeCompanyInfo('1')" :disabled="isLoading" class="btn btn-blue ms-3">
                    {{$t('accept')}}
                </button>
            </div>
        </div>
        <form class="mt-4" @submit.prevent="formHandler">
            <div>
                <div class="app-label">{{$t('created_at')}}</div>
                <div class="input-read-only">{{ info.created_at }}</div>
            </div>
            <AppFormInput
                class="mt-4"
                v-model="form.company_email"
                :label="$t('company_email')" 
                :class-input="{ 'is-invalid': v$.company_email.$dirty && v$.company_email.$invalid }"
            >
                <template #input-bottom>
                    <div v-if="v$.company_email.$dirty && v$.company_email.required.$invalid" class="invalid-feedback">
                        {{ $t('required_filed') }}
                    </div>
                    <div v-else-if="v$.company_email.$dirty && v$.company_email.email.$invalid" class="invalid-feedback">
                        {{ $t('incorrect_field') }}
                    </div>
                </template>
            </AppFormInput>
            <AppFormInput
                v-model="form.company_name"
                class="mt-4"
                :label="$t('company_name')" 
                :class-input="{ 'is-invalid': v$.company_name.$dirty && v$.company_name.$invalid }"
            >
                <template #input-bottom>
                    <div v-if="v$.company_name.$dirty && v$.company_name.required.$invalid" class="invalid-feedback">
                        {{ $t('required_filed') }}
                    </div>
                </template>
            </AppFormInput>
            <AppFormInput
                v-model="form.company_phone"
                class="mt-4"
                :label="$t('company_phone')" 
            />
            <AppFormInput
                v-model="form.company_address"
                class="mt-4"
                :label="$t('company_address')" 
            />
            <div class="mt-4">
                <p class="app-label">{{ $t('status') }}</p>
                <AppFormSelect
                    v-model="form.status"
                    :options="companyStatuses"
                    :getOptionLabel="option => $t(option.name)"
                    
                />
            </div>
            <div class="mt-4">
                <div class="app-label">{{$t('customers_count')}}</div>
                <div class="input-read-only">{{ info.customers_count }}</div>
            </div>
            <button :disabled="isDisabled" class="btn btn-blue mt-4">
                {{$t('update')}}
            </button>
        </form>
    </div>
</template>