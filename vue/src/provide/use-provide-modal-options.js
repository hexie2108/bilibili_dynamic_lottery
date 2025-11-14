import { provide, reactive } from 'vue'
import { INJECTION_KEY } from '@/constants/injection-key'


function useProvideModalOptions() {


    const loading_modal_options = reactive({
        title: '加载中',
        title_class: '',
        content: '',
        content_class: 'text-center',
        show_cancel_button: false,
        show_loading_icon: true,
        show: false,
    })

    /**
     * 更新加载模态窗数据
     * @param {boolean} show 
     * @param {string} content 
     */
    function show_loading_modal(show, content = '') {
        if (show !== null) {
            loading_modal_options.show = show;
        }

        loading_modal_options.content = content;
    }


    provide(INJECTION_KEY.LOADING_MODAL_OPTIONS, loading_modal_options)
    provide(INJECTION_KEY.SHOW_LOADING_MODAL, show_loading_modal)



    const error_modal_options = reactive({
        title: '错误',
        title_class: 'text-danger',
        content: '',
        content_class: 'text-danger',
        show_cancel_button: true,
        show_loading_icon: false,
        show: false,

    })

    /**
     * 更新错误模态窗数据
     * @param {string} content 
     * @param {boolean} show 
     */
    function show_error_modal(show, content = '') {

        if (show !== null) {
            error_modal_options.show = show;
        }

        error_modal_options.content = content;
    }


    provide(INJECTION_KEY.ERROR_MODAL_OPTIONS, error_modal_options)
    provide(INJECTION_KEY.SHOW_ERROR_MODAL, show_error_modal)




    const login_modal_options = reactive({
        title: '登陆B站账号',
        title_class: '',
        content: '',
        content_class: '',
        show_cancel_button: true,
        show_confirm_button: true,
        show_loading_icon: false,
        show: false,

    })

    /**
     * 显示登陆模态窗
     * @param {boolean} show 
     */
    function show_login_modal(show) {

        login_modal_options.show = show;

    }

    provide(INJECTION_KEY.LOGIN_MODAL_OPTIONS, login_modal_options)
    provide(INJECTION_KEY.SHOW_LOGIN_MODAL, show_login_modal)



    // const request_warning_modal_options = reactive({
    //     title: '请求数量提示',
    //     title_class: 'text-danger',
    //     content: '',
    //     content_class: 'text-start',
    //     show_cancel_button: true,
    //     show_confirm_button: true,
    //     show_loading_icon: false,
    //     show: false,
    //     confirm_handler: null,
    //     cancel_handler: null,
    // })

    // function show_request_warning_modal(show) {
    //     request_warning_modal_options.show = show;
    // }

    // provide(INJECTION_KEY.REQUEST_WARNING_MODAL_OPTIONS, request_warning_modal_options)
    // provide(INJECTION_KEY.SHOW_REQUEST_WARNING_MODAL, show_request_warning_modal)


}

export { useProvideModalOptions }
