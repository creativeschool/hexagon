<template>
  <v-layout wrap align-content-start>
    <v-flex xs12 class="mb-2">
      <v-card>
        <v-card-text>
          <v-simple-table>
            <tbody>
              <tr>
                <td>课程总数：</td>
                <td>{{ courseCount }}</td>
              </tr>
            </tbody>
          </v-simple-table>
          <v-btn color="primary" class="ma-2" to="/course/import">导入课程</v-btn>
          <v-btn color="error" outlined class="ma-2" @click="loadList">加载课程列表</v-btn>
        </v-card-text>
        <v-overlay absolute :value="loading">
          <v-progress-circular indeterminate/>
          等待操作
        </v-overlay>
      </v-card>
    </v-flex>
    <v-flex xs12 class="mb-2">
      <v-card>
        <v-data-table :headers="headers" :items="courses">
          <template v-slot:item.created="{ item }">
            {{ formatDate(item.created) }}
          </template>
          <template v-slot:item.updated="{ item }">
            {{ formatDate(item.updated) }}
          </template>
        </v-data-table>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import { connection } from '@/db/index'
import { formatDate } from '@/plugins/formatter'

export default {
  name: 'course',
  data: () => ({
    loading: true,
    courseCount: NaN,
    courses: [],
    headers: [
      { text: '课程名', value: 'name' },
      { text: '创建', value: 'created' },
      { text: '更新', value: 'updated' }
    ]
  }),
  mounted () {
    connection.then(async ctx => {
      this.loading = false
      this.courseCount = await ctx.courses.countDocuments()
    })
  },
  methods: {
    loadList () {
      this.loading = true
      connection.then(async ctx => {
        this.courses = await ctx.courses.find().toArray()
      }).finally(() => { this.loading = false })
    },
    formatDate
  }
}
</script>
