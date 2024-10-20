import { provide, reactive, ref } from 'vue'
import { INJECTION_KEY } from '@/constants/injection-key'


function useProvideListOptions() {

    const show_list = ref(false);
    provide(INJECTION_KEY.SHOW_LIST, show_list)

    const comment_list = reactive([]);
    provide(INJECTION_KEY.COMMENT_LIST, comment_list)

    const like_list = reactive([]);
    provide(INJECTION_KEY.LIKE_LIST, like_list)

    const forward_list = reactive([]);
    provide(INJECTION_KEY.FORWARD_LIST, forward_list)

    const user_list = reactive([]);
    provide(INJECTION_KEY.USER_LIST, user_list)

    

}







export { useProvideListOptions }
