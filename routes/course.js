const { ObjectID } = require('mongodb')
const { syncCourse } = require('../schemas')

/**
 * @param {import('fastify').FastifyInstance<Server, IncomingMessage, ServerResponse>} server
 * @param {any} opts
 */
module.exports = async (server, opts) => {
  /** @type {import('mongodb').Collection} */
  const courses = server.db.collection('courses')
  /** @type {import('mongodb').Collection} */
  const userCourse = server.db.collection('user_course')

  server.post('/sync', { schema: syncCourse }, async (req) => {
    return userCourse.aggregate([
      { $match: { user: new ObjectID(req.body.id) } },
      { $lookup: { from: 'courses', localField: 'course', foreignField: '_id', as: 'course' } },
      { $unwind: '$course' },
      { $match: { 'course.updated': { $gt: req.body.last } } },
      { $project: { _id: false, user: false } }
    ]).toArray()
  })

  server.get('/list', async (req) => {
    return courses.find()
  })
}
