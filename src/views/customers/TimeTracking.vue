<script setup>
import { onMounted, ref } from 'vue'
import { notify } from '@kyvg/vue3-notification'
import { useCustomersStore } from '@/stores/customers'

import AppFormTextarea from '@/components/UI/AppFormTextarea'

const customersStore = useCustomersStore()
const { availableActions, tracker, updateComments } = customersStore

const actions = ref([])
const currentDay = ref(null)
const comments = ref('')
const trackerId = ref(null)
const isUpdatingComments = ref(false)

onMounted(async () => {
    try {
        const data = await availableActions()

        actions.value = data.actions
        currentDay.value = data.current_day
        trackerId.value = data.current_day.id
        comments.value = data.current_day.comments
    } catch (e) {
        notify({ type: "error", text: e.message })
    }
})

const initTracker = async (typeAction) => {
    try {
        const data = await tracker(typeAction)

        actions.value = data.actions
        currentDay.value = data.current_day
    } catch (e) {
        notify({ type: "error", text: e.message })
    }
}

const initUpdateComments = async () => {
    try {
        isUpdatingComments.value = true

        await updateComments({
            trackerId: trackerId.value, 
            comments: comments.value
        })
    } catch (e) {
        notify({ type: "error", text: e.message })
    } finally {
        isUpdatingComments.value = false
    }
} 
</script>

<template>
    <div class="container">
        <h2 class="section-title">{{$t('time_tracking')}}</h2>
        <template v-if="currentDay">
            <h3 v-if="currentDay.date_start && currentDay.date_stop" class="mt-4">{{$t('work_time_closed')}}</h3>
            <div v-else-if="actions" class="row">
                <div class="col-auto mt-4">
                    <button
                        @click="initTracker('start_day')"
                        :disabled="!actions.includes('start_day')" 
                        class="btn btn-blue"
                    >
                        {{$t('start_work_time_btn')}}
                    </button>
                </div>
                <div class="col-auto mt-4">
                    <button
                        v-if="actions.includes('unpause')" 
                        @click="initTracker('unpause')"
                        :disabled="!actions.includes('unpause')" 
                        class="btn btn-yellow"
                    >
                        {{$t('continue')}}
                    </button>
                    <button 
                        v-else
                        @click="initTracker('pause')"
                        :disabled="!actions.includes('pause')" 
                        class="btn btn-yellow"
                    >
                        {{$t('pause')}}
                    </button>
                </div>
                <div class="col-auto mt-4">
                    <button
                        @click="initTracker('stop_day')"
                        :disabled="!actions.includes('stop_day')" 
                        class="btn btn-red"
                    >
                        {{$t('stop_work_time_btn')}}
                    </button>
                </div>
            </div>
            <div v-if="currentDay.date_start" class="mt-4">
                <p><b>{{$t('start_work_time')}}:</b> {{ currentDay.date_start }}</p>
                <p v-if="currentDay.date_stop" class="mt-2"><b>{{$t('stop_work_time')}}:</b> {{ currentDay.date_stop }}</p>
            </div>
            <AppFormTextarea
                class="mt-4"
                :readonly="!!(!currentDay.date_start || currentDay.date_stop)"
                :label="$t('comments')"
                v-model="comments"
            />
            <button 
                v-if="currentDay.date_start && !currentDay.date_stop" 
                @click="initUpdateComments"
                :disabled="isUpdatingComments"
                class="btn btn-blue mt-4"
            >
                <div v-if="isUpdatingComments" class="spinner-grow me-2"></div>
                {{$t('update_comments')}}
            </button>
        </template>
    </div>
</template>