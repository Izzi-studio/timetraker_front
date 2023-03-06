<script setup>
import { onMounted, ref, watch } from 'vue'
import { notify } from '@kyvg/vue3-notification'
import { setItem, removeItem, getItem } from '@/helpers/persistanceStorage'
import { useCustomerStore } from '@/stores/customer'

import AppFormTextarea from '@/components/UI/AppFormTextarea'

const customerStore = useCustomerStore()
const { availableActions, tracker, updateComments } = customerStore

const actions = ref([])
const currentDay = ref(null)
const comments = ref('')
const trackerId = ref(null)

onMounted(async () => {
    try {
        const data = await availableActions()

        actions.value = data.actions
        currentDay.value = data.current_day
        trackerId.value = data.current_day.id

        if (!data.current_day.date_start) removeItem('comments')

        if (data.current_day.date_stop) {
            comments.value = data.comments
        } else {
            comments.value = getItem('comments') || ''
        }

        watch(() => comments.value, (val) => {
            setItem('comments', val)
        })
    } catch (e) {
        notify({ type: "error", text: e.message })
    }
})

const initTracker = async (typeAction) => {
    if (typeAction === 'stop_day') {
        try {
            await updateComments({
                trackerId: trackerId.value, 
                comments: comments.value
            })
        } catch (e) {
            notify({ type: "error", text: e.message })
        }
    }

    try {
        const data = await tracker(typeAction)

        actions.value = data.actions
        currentDay.value = data.current_day
    } catch (e) {
        notify({ type: "error", text: e.message })
    }
}
</script>

<template>
    <div class="container">
        <h2 class="section-title">{{$t('time_tracking')}}</h2>
        <template v-if="currentDay">
            <h3 v-if="currentDay.date_start && currentDay.date_stop" class="mt-4">{{$t('work_time_closed')}}</h3>
            <div v-else class="row">
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
        </template>
    </div>
</template>