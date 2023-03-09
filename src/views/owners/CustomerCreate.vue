<script setup>
import { storeToRefs } from 'pinia'
import { reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { notify } from '@kyvg/vue3-notification'
import { useI18n } from 'vue-i18n'
import { useOwnersStore } from '@/stores/owners'
import { required, minLength, email } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import AppFormInput from '@/components/UI/AppFormInput'

const { t } = useI18n()

const router = useRouter()

const ownersStore = useOwnersStore()
const { createCustomer } = ownersStore
const { isLoading } = storeToRefs(ownersStore)

const form = reactive({
    name: '',
    email: '',
    position: '',
    password: '',
    password_confirmation: '',
})

const rules = {
    name: { required },
    email: { required, email },
    position: { required },
    password: { required, minLength: minLength(8) },
    password_confirmation: {
        required,
        minLength: minLength(8),
        confirmation: () => form.password === form.password_confirmation
    },
}

const v$ = useVuelidate(rules, form)

const isDisabled = computed(() => {
    return (v$.value.$dirty && v$.value.$invalid) || isLoading.value
})

const formHandler = async () => {
    if (v$.value.$invalid) {
        v$.value.$touch()
        return
    }

    try {
        await createCustomer(form)

        router.push({ name: 'company-customers' })

        notify({ type: "success", text: t('customer_created') })
    } catch (e) {
        notify({ type: "error", text: e.message })
    }
}
</script>

<template>
    <div class="container">
        <div class="breadcrumbs">
            <RouterLink :to="{name: 'company-customers'}">{{$t('customers')}}</RouterLink>
            <span>{{$t('create_customer')}}</span>
        </div>
        <form class="mt-4" @submit.prevent="formHandler">
            <AppFormInput
                v-model="form.name"
                :label="$t('name')" 
                :class-input="{ 'is-invalid': v$.name.$dirty && v$.name.$invalid }"
            >
                <template #input-bottom>
                    <div v-if="v$.name.$dirty && v$.name.required.$invalid" class="invalid-feedback">
                        {{ $t('required_filed') }}
                    </div>
                </template>
            </AppFormInput>
            <AppFormInput
                class="mt-4"
                v-model="form.email"
                :label="$t('email')" 
                :class-input="{ 'is-invalid': v$.email.$dirty && v$.email.$invalid }"
            >
                <template #input-bottom>
                    <div v-if="v$.email.$dirty && v$.email.required.$invalid" class="invalid-feedback">
                        {{ $t('required_filed') }}
                    </div>
                    <div v-else-if="v$.email.$dirty && v$.email.email.$invalid" class="invalid-feedback">
                        {{ $t('incorrect_field') }}
                    </div>
                </template>
            </AppFormInput>
            <AppFormInput
                class="mt-4"
                v-model="form.position"
                :label="$t('position')" 
                :class-input="{ 'is-invalid': v$.position.$dirty && v$.position.$invalid }"
            >
                <template #input-bottom>
                    <div v-if="v$.position.$dirty && v$.position.required.$invalid" class="invalid-feedback">
                        {{ $t('required_filed') }}
                    </div>
                </template>
            </AppFormInput>
            <AppFormInput
                class="mt-4"
                v-model="form.password"
                autocomplete="new-password" 
                input-id="new-password" 
                name="new-password"
                :label="$t('password')"
                type="password"
                :class-input="{ 'is-invalid': v$.password.$dirty && v$.password.$invalid }"
            >
                <template #input-bottom>
                    <div v-if="v$.password.$dirty && v$.password.required.$invalid" class="invalid-feedback">
                        {{ $t('required_filed') }}
                    </div>
                    <div v-else-if="v$.password.$dirty && v$.password.minLength.$invalid" class="invalid-feedback">
                        {{ $t('minlenght_field', { count: 8 }) }}
                    </div>
                </template>
            </AppFormInput>
            <AppFormInput
                class="mt-4"
                v-model="form.password_confirmation"
                autocomplete="confirmation-password" 
                input-id="confirmation-password" 
                name="confirmation-password"
                :label="$t('password_confirmation')"
                type="password"
                :class-input="{ 'is-invalid': v$.password_confirmation.$dirty && v$.password_confirmation.$invalid }"
            >
                <template #input-bottom>
                    <div v-if="v$.password_confirmation.$dirty && v$.password_confirmation.required.$invalid" class="invalid-feedback">
                        {{ $t('required_filed') }}
                    </div>
                    <div v-else-if="v$.password_confirmation.$dirty && v$.password_confirmation.confirmation.$invalid" class="invalid-feedback">
                        {{ $t('password_not_confirmation') }}
                    </div>
                </template>
            </AppFormInput>
            <button :disabled="isDisabled" class="btn btn-blue mt-4">
                <div v-if="isLoading" class="spinner-grow me-2"></div>
                {{$t('create')}}
            </button>
        </form>
    </div>
</template>