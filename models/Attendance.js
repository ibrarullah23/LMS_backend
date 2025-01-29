const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const attendanceSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  classId: { type: Schema.Types.ObjectId, ref: 'Class', required: true },
  status: { type: String, enum: ['Present', 'Absent'], required: true ,default: 'Absent'},
}, { timestamps: true });

const Attendance = mongoose.model('Attendance', attendanceSchema);
module.exports = Attendance;


// const attendanceSchema = new Schema({
//   userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
//   date: { type: Date, required: true },
//   status: { type: String, enum: ['present', 'absent'], required: true ,default: 'absent'},
// }, { timestamps: true });


// add
// update
// all