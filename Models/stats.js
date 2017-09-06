
const mongoose = require('mongoose');

const statSchema = new mongoose.Schema({
    activity: String,
    times: { type: Number},
    date: Date

})

const Stats = mongoose.model('Stats', statSchema);

module.exports = Stats;
