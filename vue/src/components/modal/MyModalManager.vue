<script setup>

import { inject } from 'vue'
import { INJECTION_KEY } from '@/constants/injection-key'
import MyModal from '@/components/modal/MyModal.vue'
import MyModalLogin from '@/components/modal/MyModalLogin.vue';

const loading_modal_options = inject(INJECTION_KEY.LOADING_MODAL_OPTIONS)
const error_modal_options = inject(INJECTION_KEY.ERROR_MODAL_OPTIONS)
const login_modal_options = inject(INJECTION_KEY.LOGIN_MODAL_OPTIONS);
const request_warning_modal_options = inject(INJECTION_KEY.REQUEST_WARNING_MODAL_OPTIONS);

function handle_request_warning_confirm() {
    request_warning_modal_options.confirm_handler && request_warning_modal_options.confirm_handler();
    request_warning_modal_options.show = false;
}

function handle_request_warning_close() {
    request_warning_modal_options.cancel_handler && request_warning_modal_options.cancel_handler();
    request_warning_modal_options.show = false;
}

</script>


<template>
    <div>
        <my-modal-login v-if="login_modal_options.show"></my-modal-login>
        <my-modal v-bind="loading_modal_options" @close="loading_modal_options.show = false" />
        <my-modal v-bind="error_modal_options" @close="error_modal_options.show = false" />
        <my-modal v-bind="request_warning_modal_options" @close="handle_request_warning_close"
            @confirm="handle_request_warning_confirm" />
       
    </div>
  

</template>

<style scoped></style>
