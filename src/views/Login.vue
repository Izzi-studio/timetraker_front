<script setup>
import { computed, reactive } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useRouter, useRoute } from 'vue-router'
import useVuelidate from '@vuelidate/core'
import { required, email, minLength } from '@vuelidate/validators'
import { notify } from '@kyvg/vue3-notification'
import { useAuthStore } from '@/stores/auth'

import AppFormInput from '@/components/UI/AppFormInput'

const { t } = useI18n()
const router = useRouter()
const route = useRoute()

const authStore = useAuthStore()

const { isLoading } = storeToRefs(authStore)
const { login } = authStore

const form = reactive({
    email: '',
    password: ''
})

const rules = {
    email: { email, required },
    password: { required, minLength: minLength(8) },
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
        await login(form.email, form.password)

        if (route.query.redirect) {
            router.push(route.query.redirect)
        } else {
            router.push({ name: 'home' })
        }
        
        notify({ type: "success", text: t('welcome') })
    } catch (e) {
        notify({ type: "error", text: t(e.message) })
    }
}
</script>

<template>
    <div class="container">
        <div class="login">
            <p class="login__inst">{{$t('login_text')}}</p>
            <form @submit.prevent="formHandler" novalidate class="login__form">
                <AppFormInput name="email" v-model="form.email" :placeholder="$t('email')"
                    :class-input="{ 'is-invalid': v$.email.$dirty && v$.email.$invalid }">
                    <template #input-bottom>
                        <div v-if="v$.email.$dirty && v$.email.required.$invalid" class="invalid-feedback">
                            {{ $t('required_filed') }}
                        </div>
                        <div v-else-if="v$.email.$dirty && v$.email.email.$invalid" class="invalid-feedback">
                            {{ $t('incorrect_field') }}
                        </div>
                    </template>
                </AppFormInput>
                <AppFormInput autocomplete="new-password" input-id="new-password" name="new-password" v-model="form.password" type="password" class="mt-4" :placeholder="$t('password')"
                    :class-input="{ 'is-invalid': v$.password.$dirty && v$.password.$invalid }">
                    <template #input-bottom>
                        <div v-if="v$.password.$dirty && v$.password.required.$invalid" class="invalid-feedback">
                            {{ $t('required_filed') }}
                        </div>
                        <div v-else-if="v$.password.$dirty && v$.password.minLength.$invalid" class="invalid-feedback">
                            {{ $t('minlenght_field', { count: 8 }) }}
                        </div>
                    </template>
                </AppFormInput>
                <div class="mt-4 mt-sm-5">
                    <button :disabled="isDisabled" class="btn btn-blue w-100">
                        <div v-if="isLoading" class="spinner-grow me-2"></div>
                        {{ $t('login') }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
