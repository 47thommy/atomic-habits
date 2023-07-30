import mongoose from 'mongoose'

// State of event will change - need to think about this is rendered in DB and/or frontend

const { Schema } = mongoose

const likeSchema = new Schema({
  owner: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  event: { type: mongoose.Schema.ObjectId, ref: 'Event', required: true }
},
  {
    timestamps: true
  })

const commentSchema = new Schema({
  owner: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  reply: { type: Array },
},
  {
    timestamps: true,
  })

commentSchema.virtual('fullOwner', {
  ref: 'User',
  localField: 'owner',
  foreignField: '_id'
})


const eventSchema = new Schema({
  emoji: { type: String, required: true },
  name: { type: String, required: true, unique: true },
  subTitle: { type: String, required: true },
  description: { type: String, required: true, maxlength: 500 },
  frequency: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  picture: { type: String },
  owner: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
  comments: [commentSchema],
  likes: [likeSchema],
})

// * Add virtuals for calculating analytics...

eventSchema.virtual('isLive')
  .get(function () {
    const currentDate = new Date()
    if (currentDate >= Date.parse(this.startDate) && currentDate <= Date.parse(this.endDate)) {
      return true
    } else {
      console.log('false')
      return false
    }
  }
  )

eventSchema.virtual('eventMembers', {
  ref: 'User',
  localField: '_id',
  foreignField: 'events._id',
})

eventSchema.set('toJSON', {
  virtuals: true,
})



// pre save 
// check if the event is live 
// live => greater start date and less end date
// return true if it is live




export default mongoose.model('Event', eventSchema)