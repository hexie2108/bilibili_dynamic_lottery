import { provide, reactive, ref } from 'vue'
import { INJECTION_KEY } from '@/constants/injection-key'


import { Detail_Model } from '@/model/detail-model';


function useProvideFormOptions() {
    const video_id = ref('');
    provide(INJECTION_KEY.VIDEO_ID, video_id)

    const video_url =  ref('');
    provide(INJECTION_KEY.VIDEO_URL, video_url)

    const video_detail = reactive(new Detail_Model())
    provide(INJECTION_KEY.VIDEO_DETAIL, video_detail)


    const enable_comment_list = ref(false);
    const enable_forward_list = ref(false);
    const enable_like_list = ref(false);

    provide(INJECTION_KEY.ENABLE_COMMENT_LIST, enable_comment_list)
    provide(INJECTION_KEY.ENABLE_FORWARD_LIST, enable_forward_list)
    provide(INJECTION_KEY.ENABLE_LIKE_LIST, enable_like_list)

}







export { useProvideFormOptions }
