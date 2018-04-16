import Vue from 'vue'
import Vuex from 'vuex'
import axios from './axios-auth'
import globalAxios from 'axios'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        idToken: null,
        userId: null,
        user: null
    },
    mutations: {
        authUser: (state, userData) => {
            state.idToken = userData.token;
            state.userId = userData.userId;
        },
        saveUser: (state, user) => {
            state.user = user;
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
        signup: ({commit, dispatch}, userData) => {
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
                    dispatch('storeUser', userData);
                })
                .catch(error => console.error(error));
        },
        fetchUser: ({commit}) => {
            globalAxios
                .get("/users.json")
                .then(res => {
                    console.log(res);
                    const data = res.data;
                    let users = [];
                    for (let key in data) {
                        const user = data[key];
                        user.id = key;
                        users.push(user);
                    }
                    commit('saveUser', users[0]);
                })
                .catch(err => console.error(err));
        },
        storeUser: ({commit}, userData) => {
            globalAxios.post('/users.json', userData)
                .then(res => console.log(res))
                .catch(err => console.error(err))
        }
    },
    getters: {
        user: (state) => {
            return state.user;
        }
    }
})