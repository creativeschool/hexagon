<template>
  <v-layout wrap align-content-start>
    <v-flex xs12 class="mb-2">
      <v-card>
        <v-card-text>
          <v-simple-table>
            <tbody>
              <tr>
                <td>总数：</td>
                <td>{{ userCount }}</td>
              </tr>
            </tbody>
          </v-simple-table>
          <v-btn color="primary" class="ma-2" to="/user/import">导入</v-btn>
        </v-card-text>
        <v-overlay absolute :value="loading">
          <v-progress-circular indeterminate/>
          等待操作
        </v-overlay>
      </v-card>
    </v-flex>
    <v-flex xs12 class="mb-2">
      <v-card>
        <v-layout row justify-start>
          <v-btn color="error" class="ma-2" @click="loadList">查询</v-btn>
          <v-checkbox v-model="filter" label="启用筛选"></v-checkbox>
        </v-layout>
        <v-divider/>
        <v-fade-transition>
          <v-card-text v-show="filter">
            <v-checkbox label="使用Regex" v-model="useRegex"/>
            <v-layout row justify-start>
              <v-text-field label="名" class="ma-2" v-model="filters.name"></v-text-field>
              <v-text-field label="登录号" class="ma-2" v-model="filters.login"></v-text-field>
              <v-text-field label="邮箱" class="ma-2" v-model="filters.email"></v-text-field>
            </v-layout>
            <v-divider/>
            <v-text-field label="标签" placeholder="tag1,tag2" v-model="filters.tags"></v-text-field>
          </v-card-text>
        </v-fade-transition>
        <v-divider/>
        <v-data-table dense :headers="headers" :items="users">
          <template v-slot:item.created="{ item }">
            {{ formatDate(item.created) }}
          </template>
          <template v-slot:item.updated="{ item }">
            {{ formatDate(item.updated) }}
          </template>
          <template v-slot:item.tags="{ item }">
            {{ item.tags.join(', ') }}
          </template>
          <template v-slot:item._actions="{ item }">
            <v-btn icon :to="'user/edit/' + item._id">
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </template>
        </v-data-table>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { connection } from '@/db/index'
import { formatDate } from '@/plugins/formatter'
import escape from 'escape-string-regexp'

export default {
  name: 'user',
  data: () => ({
    loading: true,
    userCount: NaN,
    users: [],
    headers: [
      { text: '名称', value: 'name' },
      { text: '登录号', value: 'login' },
      { text: '邮箱', value: 'email' },
      { text: '创建', value: 'created' },
      { text: '更新', value: 'updated' },
      { text: '标签', value: 'tags', sortable: false },
      { text: '操作', value: '_actions', sortable: false }
    ],
    filter: false,
    useRegex: false,
    filters: {
      name: null,
      login: null,
      email: null,
      tags: null
    }
  }),
  mounted () {
    connection.then(async ctx => {
      this.userCount = await ctx.users.countDocuments()
      this.loading = false
    })
  },
  methods: {
    loadList () {
      this.loading = true
      const query = {}
      if (this.filter) {
        ['name', 'login', 'email'].forEach(x => {
          if (this.filters[x]) {
            query[x] = { $regex: this.useRegex ? this.filters[x] : escape(this.filters[x]) }
          }
        })
        if (this.filters.tags) {
          query.tags = {
            $all: this.filters.tags.split(',').map(x => x.trim()).filter(x => x.length)
          }
        }
      }
      connection.then(async ctx => {
        this.users = await ctx.users.find(query).toArray()
      }).finally(() => { this.loading = false })
    },
    formatDate
  }
}
</script>
