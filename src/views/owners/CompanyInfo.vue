<script setup>
import { reactive, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { notify } from '@kyvg/vue3-notification'
import { required, email } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import { useI18n } from 'vue-i18n'
import AppFormInput from '@/components/UI/AppFormInput'
import { useOwnersStore } from '@/stores/owners'

const { t } = useI18n()

const ownersStore = useOwnersStore()
const { loadCompanyInfo, updateCompanyInfo } = ownersStore
const { isLoading } = storeToRefs(ownersStore)

const form = reactive({
    company_email: '',
    company_name: '',
    company_phone: '',
    company_address: '',
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
        const data = await loadCompanyInfo()

        form.company_email = data.company_email
        form.company_name = data.company_name
        form.company_phone = data.company_phone
        form.company_address = data.company_address
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
        await updateCompanyInfo(form)

        notify({ type: "success", text: t('send_request_update_company_info') })
    } catch (e) {
        notify({ type: "error", text: e.message })
    }
}
</script>

<template>
    <div class="container">
        <h2 class="section-title">{{$t('company_info')}}</h2>
        <form class="mt-4" @submit.prevent="formHandler">
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
            <button :disabled="isDisabled" class="btn btn-blue mt-4">
                {{$t('update')}}
            </button>
        </form>
    </div>
</template>