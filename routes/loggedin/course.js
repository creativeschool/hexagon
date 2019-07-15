const { courseSync } = require('../../schemas')

/**
 * @param {import('fastify').FastifyInstance} server
 * @param {any} opts
 */
module.exports = async (server, opts) => {
  /** @type {import('mongodb').Collection} */
  const userCourse = server.userCourse

  server.post('/sync', { schema: courseSync }, async (req) => {
    return userCourse.aggregate([
      { $match: { user: req.user } },
      { $lookup: { from: 'courses', localField: 'course', foreignField: '_id', as: 'course' } },
      { $unwind: '$course' },
      { $match: { 'course.updated': { $gt: req.body.last } } },
      { $addFields: { 'course.priv': '$priv' } },
      { $replaceRoot: { newRoot: '$course' } }
    ]).toArray()
  })
}
