import Vue from 'vue'
import Vuex from 'vuex'
import axios from './axios-auth';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        idToken: '',
        userId: ''
    },
    mutations: {
        authUser: (state, userData) => {
            state.idToken = userData.token;
            state.userId = userData.userId;
        }
    },
    actions: {
        login: ({commit}, userData) => {
            axios
                .post("/verifyPassword?key=AIzaSyBNPfBvsv31ef_tByq0Wu7KyUr5Wv74gQ4", {
                    email: userData.email,
                    password: userData.password,
                    returnSecureToken: true
                })
                .then(res => console.log(res))
                .catch(error => console.error(error));
        },
        signup: ({commit}, userData) => {
            axios
                .post("/signupNewUser?key=AIzaSyBNPfBvsv31ef_tByq0Wu7KyUr5Wv74gQ4", {
                    email: userData.email,
                    password: userData.password,
                    returnSecureToken: true
                })
                .then(res => {
                    console.log(res);
                    commit('authUser', {
                        token: res.data.idToken,
                        userId: res.data.localId
                    });
                })
                .catch(error => console.error(error));
        }
    },
    getters: {}
})