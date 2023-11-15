const _ = require('lodash')

exports.getUserProfile = (req, res) => {
  const user = req.user

  const propertiesToInclude = [
    'email',
    'firstName',
    'lastName',
    'dateOfBirth',
    'createdAt',
  ]

  const responseData = _.pick(user, propertiesToInclude)

  res.status(200).json(responseData)
}
