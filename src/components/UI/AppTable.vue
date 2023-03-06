<script setup>
import { onMounted, onBeforeUnmount, ref, computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useMainStore } from '@/stores/main'
import { useAuthStore } from '@/stores/auth'
import AppRowDropdown from '@/components/UI/AppRowDropdown'

const mainStore = useMainStore()
const authStore = useAuthStore()
const { isRoot } = storeToRefs(authStore)
const { width } = storeToRefs(mainStore)

const props = defineProps({
    classTable: [String, Object, Array],
    classWrap: [String, Object, Array],
    sortParams: Object,
    fields: {
        type: Array,
        required: true,
    },
    data: {
        type: Array,
        required: true,
    },
    type: {
        required: true,
        validator(value) {
            return ['dropdown', 'horizontal-scroll'].includes(value)
        }
    }
})

const emit = defineEmits(['update-sort-params'])

const table = ref(null)

let pos = {
    top: 0,
    left: 0,
    x: 0,
    y: 0
}

const getSortAttr = (key, sortable) => {
    if (!sortable) return null

    if (!props.sortParams || key !== props.sortParams.key) return 'none'

    if (props.sortParams.sort === 'desc') return 'desc'

    if (props.sortParams.sort === 'asc') return 'asc'
}

const sortHandler = (key, sortable) => {
    if (!sortable) return

    let sort

    if (props.sortParams && key === props.sortParams.key) {
        if (props.sortParams.sort === 'asc') sort = 'desc'
        if (props.sortParams.sort === 'desc') {
            emit('update-sort-params', null)
            return
        }
    } else {
        sort = 'asc'
    }

    emit('update-sort-params', {
        key,
        sort
    })
}

const cursorHandler = () => {
    if (table.value.scrollWidth > table.value.clientWidth) {
        table.value.style.cursor = 'grab'
    } else {
        table.value.style.cursor = 'initial'
    }
}

const mouseDownHandler = (e) => {
    if(table.value.scrollWidth <= table.value.clientWidth) return

    table.value.style.cursor = 'grabbing'
    table.value.style.userSelect = 'none'

    pos = {
        left: table.value.scrollLeft,
        top: table.value.scrollTop,
        x: e.clientX,
        y: e.clientY,
    }

    document.addEventListener('mousemove', mouseMoveHandler)
    document.addEventListener('mouseup', mouseUpHandler)
}

const mouseMoveHandler = (e) => {
    const dx = e.clientX - pos.x
    const dy = e.clientY - pos.y

    table.value.scrollTop = pos.top - dy
    table.value.scrollLeft = pos.left - dx
}

const mouseUpHandler = () => {
    table.value.style.cursor = 'grab'
    table.value.style.removeProperty('user-select')

    document.removeEventListener('mousemove', mouseMoveHandler)
    document.removeEventListener('mouseup', mouseUpHandler)
}

onMounted(cursorHandler)

watch(() => width.value, cursorHandler)

onMounted(() => table.value.addEventListener('mousedown', mouseDownHandler))

onBeforeUnmount(() => table.value.removeEventListener('mousedown', mouseDownHandler))
</script>

<template>
    <div ref="table" class="wrap-table" :class="[`wrap-table_${type}`, classWrap]">
        <table class="table" :class="classTable">
            <thead>
                <tr>
                    <template
                        v-for="field in fields"
                        :key="field.key"
                    >
                        <th
                            v-if="field.key != 'company' || isRoot"
                            :class="`col-${field.key}`"
                            @click="sortHandler(field.key, field.sortable)"
                            :data-sort="getSortAttr(field.key, field.sortable)"
                        >
                            {{field.text}}
                        </th>
                    </template>
                    <th v-if="type == 'dropdown'" class="col-btn-dropdown"></th>
                </tr>
            </thead>
            <tbody>
                <template v-if="type == 'dropdown'">
                    <AppRowDropdown v-for="item in data" :colspan="fields.length" :key="item.id">
                        <template #default>
                            <template
                                v-for="field in fields"
                                :key="field.key"
                            >
                                <td
                                    v-if="field.key != 'company' || isRoot"
                                    :class="`col-${field.key}`"
                                >
                                    <slot :name="field.key" :item="item"></slot>
                                </td>
                            </template>
                        </template>
                        <template #table-inner>
                            <template
                                v-for="field in fields"
                                :key="field.key"
                            >
                                <tr
                                    v-if="field.key != 'company' || isRoot"
                                    :class="`row-${field.key}`"
                                >
                                    <td>{{field.text}}</td>
                                    <td>
                                        <slot :name="field.key" :item="item"></slot>
                                    </td>
                                </tr>
                            </template>
                        </template>
                    </AppRowDropdown>
                </template>
                <template v-if="type == 'horizontal-scroll'">
                    <tr v-for="item in data" :key="item.id">
                        <template
                            v-for="field in fields"
                            :key="field.key"
                        >
                            <td
                                v-if="field.key != 'company' || isRoot"
                                :class="`col-${field.key}`"
                            >
                                <slot :name="field.key" :item="item"></slot>
                            </td>
                        </template>
                    </tr>
                </template>
            </tbody>
        </table>
    </div>
</template>