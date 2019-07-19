import Vue from 'vue'

export const bus = new Vue()

bus.$on('error', err => console.log(err))
