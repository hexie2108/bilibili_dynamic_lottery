<script setup>


import { ref, inject, onMounted } from 'vue'

import { get_by_fetch } from '@/utils/request-by-fetch';
import { INJECTION_KEY } from '@/constants/injection-key';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faRightToBracket, faRepeat } from "@fortawesome/free-solid-svg-icons";


const login_user = inject(INJECTION_KEY.LOGIN_USER)


</script>

<template>

    <div class="row">
        <template v-if="login_user.id > 0">
            <div class="col-auto">
                <img :src="login_user.avatar" class="avatar rounded-circle " style="width: 25px; height: 25px;"
                    referrerpolicy="no-referrer" crossorigin="anonymous" />
            </div>
            <div class="col-auto">
                {{ login_user.user_name }}
            </div>
            <div class="col-auto">
                <font-awesome-icon :icon="faRepeat" class="align-middle me-1" /> 切换账号
            </div>

        </template>
        <template v-else>
            <div class="col-auto">
                <font-awesome-icon :icon="faRightToBracket" class="align-middle me-1" /> 登陆B站账号
            </div>
        </template>

    </div>

</template>