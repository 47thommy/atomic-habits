import mongoose from 'mongoose'
import eventData from './data/events.js'
import userData from './data/users.js'
import Event from '../models/event.js'
import User from '../models/user.js'
import 'dotenv/config'

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.DB_URI)
    console.log('Database connected')
    await mongoose.connection.db.dropDatabase()
    console.log('Database dropped')
    const usersAdded = await User.create(userData)
    const eventWithOwners = eventData.map(event => {
      return { ...event, owner: usersAdded[0]._id }
    })
    const eventsAdded = await Event.create(eventWithOwners)
    await mongoose.connection.close()
    console.log('Bye')

  } catch (err) {
    console.log(err)
    await mongoose.connection.close()
  }
}

seedDatabase()