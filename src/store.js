import Vue from 'vue'
import Vuex from 'vuex'
import axios from './axios-auth'
import globalAxios from 'axios'
import router from './router'

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        idToken: null,
        userId: null,
        user: null
    },
    mutations: {
        authUser: (state, userData) => {
            state.idToken = userData.idToken;
            state.userId = userData.localId;
        },
        saveUser: (state, user) => {
            state.user = user;
        },
        clearUserData: (state) => {
            state.idToken = null;
            state.userId = null;
            state.user = null;
        }
    },
    actions: {
        setLogoutTimer: ({commit, dispatch}, duration) => {
          setTimeout(() => {
              dispatch('logout');
          }, duration * 1000);
        },
        logout: ({commit}) => {
            commit('clearUserData');
            router.replace('/signin');
        },
        login: ({commit, dispatch}, userData) => {
            axios
                .post("/verifyPassword?key=AIzaSyBNPfBvsv31ef_tByq0Wu7KyUr5Wv74gQ4", {
                    email: userData.email,
                    password: userData.password,
                    returnSecureToken: true
                })
                .then(res => {
                    console.log(res);
                    commit('authUser', res.data);
                    commit('saveUser', userData);
                    dispatch('setLogoutTimer', res.data.expiresIn);
                })
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
                    commit('authUser', res.data);
                    dispatch('storeUser', userData);
                })
                .catch(error => console.error(error));
        },
        fetchUser: ({commit, state}) => {
            if (!state.idToken) {
                return;
            }
            globalAxios.get('/users.json?auth=' + state.idToken)
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
        storeUser: ({commit, state}, userData) => {
            if (!state.idToken) {
                return;
            }
            globalAxios.post('/users.json?auth=' + state.idToken, userData)
                .then(res => console.log(res))
                .catch(err => console.error(err))
        }
    },
    getters: {
        user: (state) => {
            return state.user;
        },
        isAuthenticated: (state) => {
            return state.idToken !== null;
        }
    }
})