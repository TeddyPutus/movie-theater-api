const { Show } = require('./Show')
const { User } = require('./User')

// Show.belongsTo(User)
// User.hasMany(Show)

Show.belongsToMany(User, {through: 'Show_User'});
User.belongsToMany(Show, {through: 'Show_User'});

module.exports = {Show, User}
