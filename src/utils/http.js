import axios from "axios";
import { Message } from "element-plus";

// 创建一个 axios 实例
export const service = axios.create({
    // baseURL
    baseURL: "",
    // 请求头
    headers: {

    },
    // 超时
    timeout: 40000
});

// 请求拦截
service.interceptors.request.use((config) => {
    // config.headers.token = "";
    return config;
}, (error) => {
    return Promise.reject(error);
});

// 返回拦截
service.interceptors.response.use((response) => {
    return response;
}, (error) => {
    return Promise.reject(error);
})