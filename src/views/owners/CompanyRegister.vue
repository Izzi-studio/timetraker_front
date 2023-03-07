<script setup>
import axiosHelper from '@/helpers/axios'
import { reactive, computed, ref } from 'vue'
import { notify } from '@kyvg/vue3-notification'
import { required, minLength, email } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import AppFormInput from '@/components/UI/AppFormInput'

const isLoading = ref(false)
const isCreated = ref(false)

const form = reactive({
    'owner[name]': '',
    'owner[email]': '',
    'owner[password]': '',
    'owner[password_confirmation]': '',
    'company[company_email]': '',
    'company[company_name]': '',
    'company[company_phone]': '',
    'company[company_address]': '',
})

const rules = {
    'owner[name]': { required },
    'owner[email]': { email },
    'owner[password]': { required, minLength: minLength(8) },
    'owner[password_confirmation]': {
        required,
        minLength: minLength(8),
        confirmation: () => form['owner[password]'] === form['owner[password_confirmation]']
    },
    'company[company_name]': { required },
    'company[company_email]': { required, email },
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
        isLoading.value = true

        await axiosHelper.post('/register', form)

        isCreated.value = true        
    } catch (e) {
        notify({ type: "error", text: e.message })
    } finally {
        isLoading.value = false
    }
}
</script>

<template>
    <div class="container">
        <h2 v-if="isCreated" class="section-title text-center">{{$t('company_registered')}}</h2>
        <template v-else>
            <h2 class="section-title text-center">{{$t('company_register')}}</h2>
            <div class="row mt-4 justify-content-center">
                <div class="col-xl-6">
                    <form @submit.prevent="formHandler">
                        <AppFormInput
                            v-model="form['owner[name]']"
                            :label="$t('name')" 
                            :class-input="{ 'is-invalid': v$['owner[name]'].$dirty && v$['owner[name]'].$invalid }"
                        >
                            <template #input-bottom>
                                <div v-if="v$['owner[name]'].$dirty && v$['owner[name]'].required.$invalid" class="invalid-feedback">
                                    {{ $t('required_filed') }}
                                </div>
                            </template>
                        </AppFormInput>
                        <AppFormInput
                            class="mt-4"
                            v-model="form['owner[email]']"
                            :label="$t('email')" 
                            :class-input="{ 'is-invalid': v$['owner[email]'].$dirty && v$['owner[email]'].$invalid }"
                        >
                            <template #input-bottom>
                                <div v-if="v$['owner[email]'].$dirty && v$['owner[email]'].email.$invalid" class="invalid-feedback">
                                    {{ $t('incorrect_field') }}
                                </div>
                            </template>
                        </AppFormInput>
                        <AppFormInput
                            class="mt-4"
                            v-model="form['owner[password]']"
                            autocomplete="new-password" 
                            input-id="new-password" 
                            name="new-password"
                            :label="$t('password')"
                            type="password"
                            :class-input="{ 'is-invalid': v$['owner[password]'].$dirty && v$['owner[password]'].$invalid }"
                        >
                            <template #input-bottom>
                                <div v-if="v$['owner[password]'].$dirty && v$['owner[password]'].required.$invalid" class="invalid-feedback">
                                    {{ $t('required_filed') }}
                                </div>
                                <div v-else-if="v$['owner[password]'].$dirty && v$['owner[password]'].minLength.$invalid" class="invalid-feedback">
                                    {{ $t('minlenght_field', { count: 8 }) }}
                                </div>
                            </template>
                        </AppFormInput>
                        <AppFormInput
                            class="mt-4"
                            v-model="form['owner[password_confirmation]']"
                            autocomplete="confirmation-password" 
                            input-id="confirmation-password" 
                            name="confirmation-password"
                            :label="$t('password_confirmation')"
                            type="password"
                            :class-input="{ 'is-invalid': v$['owner[password_confirmation]'].$dirty && v$['owner[password_confirmation]'].$invalid }"
                        >
                            <template #input-bottom>
                                <div v-if="v$['owner[password_confirmation]'].$dirty && v$['owner[password_confirmation]'].required.$invalid" class="invalid-feedback">
                                    {{ $t('required_filed') }}
                                </div>
                                <div v-else-if="v$['owner[password_confirmation]'].$dirty && v$['owner[password_confirmation]'].confirmation.$invalid" class="invalid-feedback">
                                    {{ $t('password_not_confirmation') }}
                                </div>
                            </template>
                        </AppFormInput>
                        <AppFormInput
                            class="mt-4"
                            v-model="form['company[company_email]']"
                            :label="$t('company_email')" 
                            :class-input="{ 'is-invalid': v$['company[company_email]'].$dirty && v$['company[company_email]'].$invalid }"
                        >
                            <template #input-bottom>
                                <div v-if="v$['company[company_email]'].$dirty && v$['company[company_email]'].required.$invalid" class="invalid-feedback">
                                    {{ $t('required_filed') }}
                                </div>
                                <div v-else-if="v$['company[company_email]'].$dirty && v$['company[company_email]'].email.$invalid" class="invalid-feedback">
                                    {{ $t('incorrect_field') }}
                                </div>
                            </template>
                        </AppFormInput>
                        <AppFormInput
                            v-model="form['company[company_name]']"
                            class="mt-4"
                            :label="$t('company_name')" 
                            :class-input="{ 'is-invalid': v$['company[company_name]'].$dirty && v$['company[company_name]'].$invalid }"
                        >
                            <template #input-bottom>
                                <div v-if="v$['company[company_name]'].$dirty && v$['company[company_name]'].required.$invalid" class="invalid-feedback">
                                    {{ $t('required_filed') }}
                                </div>
                            </template>
                        </AppFormInput>
                        <AppFormInput
                            v-model="form['company[company_phone]']"
                            class="mt-4"
                            :label="$t('company_phone')" 
                        />
                        <AppFormInput
                            v-model="form['company[company_address]']"
                            class="mt-4"
                            :label="$t('company_address')" 
                        />
                        <button :disabled="isDisabled" class="btn btn-blue mt-4">
                            <div v-if="isLoading" class="spinner-grow me-2"></div>
                            {{$t('register')}}
                        </button>
                    </form>
                </div>
            </div>
        </template>
    </div>
</template>