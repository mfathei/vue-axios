import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import Vuelidator from 'vuelidate'

import router from './router'
import store from './store'

Vue.use(Vuelidator);

axios.defaults.baseURL = 'https://vue-axios-62ced.firebaseio.com';
// axios.defaults.headers.common['Authorization'] = 'Basic wtrgt4r564gtdgt4';
axios.defaults.headers.get['Accepts'] = 'application/json';

const reqInterceptor = axios.interceptors.request.use(config => {
    console.log(config);
    return config;
});

const resInterceptor = axios.interceptors.response.use(res => {
    console.log(res);
    return res;
});

axios.interceptors.request.eject(reqInterceptor);
axios.interceptors.response.eject(resInterceptor);

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
});
