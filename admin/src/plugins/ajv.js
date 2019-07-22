import Ajv from 'ajv'
import rawUserSchema from '@/schemas/rawuser.json'
import rawCourseSchema from '@/schemas/rawcourse.json'

const ajv = new Ajv()

export const isRawUser = ajv.compile(rawUserSchema)
export const isRawCourse = ajv.compile(rawCourseSchema)
