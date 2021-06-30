import axios from 'axios'
import { Message,Loading } from 'element-ui';
import router from './router'


let loading;
function startLoading(){
    loading=Loading.service({
        lock:true,
        text:'加载中。。。',
        background:'rgba(0,0,0,0,7)'
    });
}

function endLoading(){
    loading.close();
}
// 请求拦截
axios.interceptors.request.use(config=>{
    // 加载动画
    startLoading();
    if(localStorage.eleToken){
        // 设置统一的请求头
        config.headers.Authorization=localStorage.eleToken
    }
    return config
},err=>{
    return Promise.reject(err)
})

// 相应拦截
axios.interceptors.response.use(response=>{
    // 结束动画
    endLoading()
    return response
},err=>{
    // 错误提醒
    endLoading()
    Message.error(error.response.data)
    // 获取错误状态码
    const {status}=error.response
    if(status==401){
        Message.error('token失效，请重新登录')
        localStorage.removeItem('eleToken')
        // 跳转登录页面
        router.push('/login')
    }
    return Promise.reject(err)

})

export default axios;