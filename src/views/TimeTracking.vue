<script setup>
import { onMounted, ref } from 'vue'
import { notify } from '@kyvg/vue3-notification'
import { useCustomerStore } from '@/stores/customer'

const customerStore = useCustomerStore()
const { availableActions, tracker } = customerStore

const actions = ref([])
const currentDay = ref(null)

onMounted(async () => {
    try {
        const data = await availableActions()

        actions.value = data.actions
        currentDay.value = data.current_day
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
</script>

<template>
    <div class="container">
        <h2 class="section-title">{{$t('time_tracking')}}</h2>
        <template v-if="currentDay">
            <h3 v-if="currentDay.date_start && currentDay.date_stop" class="mt-4">{{$t('work_time_closed')}}</h3>
            <div v-else class="row mt-4">
                <div class="col-auto">
                    <button
                        @click="initTracker('start_day')"
                        :disabled="!actions.includes('start_day')" 
                        class="btn btn-blue"
                    >
                        {{$t('start_work_time_btn')}}
                    </button>
                </div>
                <div class="col-auto">
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
                <div class="col-auto">
                    <button
                        @click="initTracker('stop_day')"
                        :disabled="!actions.includes('stop_day')" 
                        class="btn btn-red"
                    >
                        {{$t('stop_work_time_btn')}}
                    </button>
                </div>
            </div>
            <div class="mt-4">
                <p v-if="currentDay.date_start"><b>{{$t('start_work_time')}}:</b> {{ currentDay.date_start }}</p>
                <p v-if="currentDay.date_stop" class="mt-2"><b>{{$t('stop_work_time')}}:</b> {{ currentDay.date_stop }}</p>
            </div>
        </template>
    </div>
</template>