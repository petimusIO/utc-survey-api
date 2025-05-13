const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    first_name: String,
    gender: String,
    age: Number,
    age_group: String,
    comm_handler: String,
    comm_feeling: String,
    current_feeling: String,
    feeling_convo: String,
    goal_focus: String,
    feeling_handler: String,
    mh_importance: String,
    stressor: String,
    statement: String,
    xp: Array,
    c_xp: Array,

});

module.exports = mongoose.model('User', userSchema);