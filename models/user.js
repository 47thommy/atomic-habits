import mongoose from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'
import bcrypt from 'bcrypt'

const { Schema } = mongoose

const habitSchema = new Schema({
  owner: { type: mongoose.Schema.ObjectId, ref: 'User' },
  firstName: { type: String, maxlength: 30 },
  lastName: { type: String, maxlength: 30 },
  profilePicture: { type: String },
  picture: { type: String, required: true },
  comment: { type: String, required: true },
  event: { type: mongoose.Schema.ObjectId, ref: 'Event' },
},
{
  timestamps: true,
})

// const joinedGroupSchema = new Schema({
//   event: { type: mongoose.Schema.ObjectId, ref: 'Event' },
// })

const userSchema = new Schema({
  firstName: { type: String, required: true, maxlength: 30 },
  lastName: { type: String, required: true, maxlength: 30 },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profilePicture: { type: String },
  habitCompletions: [habitSchema],
  // events: [joinedGroupSchema],
  events: [{ event: { type: Schema.ObjectId, ref: 'Event' } }],
})

userSchema.set('toJSON', {
  virtuals: true,
  transform(_doc, json) {
    delete json.password
    return json
  },
})

//Virtual field for password confirmation
userSchema
  .virtual('passwordConfirmation')
  .set(function (passwordConfirmation) {
    this._passwordConfirmation = passwordConfirmation
  })

//Check if the password was modified and matches
userSchema
  .pre('validate', function (next) {
    if (this.isModified('password') && this.password !== this._passwordConfirmation) {
      this.invalidate('passwordConfirmation', 'Does not match password field')
    }
    next()
  })

//Encrypto password
userSchema
  .pre('save', function (next) {
    if (this.isModified('password')) {
      this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync())
    }
    next()
  })

//Validate if event is already in array of events


//Validate
userSchema.plugin(uniqueValidator)

userSchema.methods.validatePassword = function (password) {
  console.log(password)
  console.log(this.password)
  return bcrypt.compareSync(password, this.password)
}


export default mongoose.model('User', userSchema)