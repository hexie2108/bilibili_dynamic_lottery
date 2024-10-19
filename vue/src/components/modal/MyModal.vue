<script setup>

const emit = defineEmits([
    'close',
    'confirm',
])

const props = defineProps({
    title: {
        type: String,
        default: '',
    },
    title_class: {
        type: String,
        default: '',
    },
    content: {
        type: String,
        default: '',
    },
    content_class: {
        type: String,
        default: '',
    },
    show_cancel_button: {
        type: Boolean,
        default: false,
    },
    show_confirm_button: {
        type: Boolean,
        default: false,
    },
    show_loading_icon: {
        type: Boolean,
        default: false,
    },
    show: {
        type: Boolean,
        default: false,
    },
})


</script>

<template>
    <div v-show="props.show">
        <div class="modal fade my-modal" :class="{ 'show': show }" :style="{ 'display': show ? 'block' : 'none' }"
            tabindex="-1">
            <div class="modal-dialog mt-5">
                <div class="modal-content p-2">
                    <div class="modal-header">
                        <h5 class="modal-title" :class="title_class">{{ title }}</h5>
                        <button type="button" class="btn-close" :class="{ 'd-none': !show_cancel_button }"
                            @click="$emit('close')">
                        </button>
                    </div>
                    <div class="modal-body" :class="content_class">

                        <div v-show="show_loading_icon">
                            <div class="spinner-border text-miku mb-2 d-block mx-auto" role="status">
                            </div>
                        </div>
                        <div v-html="content"></div>
                        <slot name="content"></slot>
                        
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary px-4 me-2 cancel"
                            :class="{ 'd-none': !show_cancel_button }" @click="$emit('close')">关闭</button>
                        <button type="button" class="btn btn-primary px-4 me-2 confirm"
                            :class="{ 'd-none': !show_confirm_button }" @click="$emit('confirm')">确认</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-backdrop fade " :class="{ 'show': show }"></div>
    </div>

</template>

<style scoped></style>
