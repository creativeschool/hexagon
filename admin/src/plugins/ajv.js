import Ajv from 'ajv'
import rawUserSchema from '@/schemas/rawuser.json'

const ajv = new Ajv()

export const isRawUser = ajv.compile(rawUserSchema)
