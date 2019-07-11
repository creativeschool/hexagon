const { syncCourse } = require('../schemas')

/**
 * @param {import('fastify').FastifyInstance} server
 * @param {any} opts
 */
module.exports = async (server, opts) => {
  /** @type {import('mongodb').Collection} */
  const courses = server.db.collection('courses')
  /** @type {import('mongodb').Collection} */
  const userCourse = server.db.collection('user_course')

  server.post('/sync', { schema: syncCourse }, async (req) => {
    return userCourse.aggregate([
      { $match: { user: req._id } },
      { $lookup: { from: 'courses', localField: 'course', foreignField: '_id', as: 'course' } },
      { $unwind: '$course' },
      { $match: { 'course.updated': { $gt: req.body.last } } },
      { $project: { _id: 0, user: 0 } }
    ]).toArray()
  })

  server.get('/list', async (req) => {
    return courses.find().toArray()
  })
}
