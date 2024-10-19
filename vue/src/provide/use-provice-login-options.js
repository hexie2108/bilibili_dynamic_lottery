import { inject, provide, reactive } from 'vue'
import { INJECTION_KEY } from '@/constants/injection-key'

import { get_by_fetch } from '@/utils/request-by-fetch';
import { API_ENDPOINT, API_ROOT_URL } from '@/constants/constants';

function useProvideLoginOptions() {


    const login_user = reactive({
        id: 0,
        user_name: '',
        avatar: '',
    });


    provide(INJECTION_KEY.LOGIN_USER, login_user)

    //检测用户是否登陆
    setLoginUserInfo(login_user);
}

/**
 * 请求登陆用户信息
 * @param {object} login_user
 */
function setLoginUserInfo(login_user) {

    //获取登陆用户信息,如果用户有登陆
    get_by_fetch(
        API_ROOT_URL,
        {
            action: API_ENDPOINT.GET_LOGGED_USER_INFO,
        },
        () => {

        },
        (response_data) => {

            //设置登陆用户信息
            login_user.id = response_data.id;
            login_user.user_name = response_data.user_name;
            login_user.avatar = response_data.avatar;

        },
        (error) => {

        },
        () => {

        }
    );


}



export { useProvideLoginOptions, setLoginUserInfo }
