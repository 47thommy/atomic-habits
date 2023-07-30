import User from '../models/user.js'
import Event from '../models/event.js'

// Habits completions controllers

export const getUserHabits = async (req, res) => {
  try {
    const currentUserProfile = await User.findById(req.currentUser._id).populate('habitCompletions.event').populate('habitCompletions.owner')
    const habitsForUser = currentUserProfile.habitCompletions
    console.log('user-habits', habitsForUser)
    return res.status(200).json(habitsForUser)
  } catch (err) {
    console.log(err)
  }
}

export const getUserSingleHabit = async (req, res) => {
  try {
    const { habitId } = req.params
    const currentUserProfile = await User.findById(req.currentUser._id).populate('habitCompletions')
    const singleHabitForUser = currentUserProfile.habitCompletions.id(habitId)
    if (!singleHabitForUser) throw new Error('Habit not found')
    console.log('singe-user-habits', singleHabitForUser)
    return res.status(200).json(singleHabitForUser)
  } catch (err) {
    console.log(err)
    return res.status(404).json({ message: err.message })
  }
}

export const addHabitComplete = async (req, res) => {
  try {
    const { eventId } = req.params
    const currentDate = new Date().toLocaleDateString()
    console.log('currentDate', currentDate)
    const event = await Event.findById(eventId)
    const currentUserProfile = await User.findById(req.currentUser._id)
    console.log('event =>', event)
    console.log('is event live? =>', event.isLive)
    if (!event.isLive) throw new Error('Event not live')
    // any of the created dates of habitcompletion === today?
    console.log('eventid', eventId)
    if (!currentUserProfile.events.some(event => event._id.equals(eventId))) { //If the user has not joined the event yet, it will add the user to the event
      currentUserProfile.events.push(eventId)
      console.log('curent user profile ->', currentUserProfile)
    } else console.log('Found')
    currentUserProfile.save()
    const userToFetch = await User.findById(req.currentUser._id).populate('habitCompletions')
    const filtered = userToFetch.habitCompletions.filter(habitCompletion => habitCompletion.event.equals(eventId))
    // console.log('filtered =>',filtered)
    const checkHabitToday = filtered.some(date => date.createdAt.toLocaleDateString() === currentDate)
    console.log('was habit doen already? =>', checkHabitToday)
    if (checkHabitToday) throw new Error('You already submitted a habit for today')

    const habitCompleteToadd = { ...req.body, owner: req.currentUser._id, firstName: currentUserProfile.firstName, lastName: currentUserProfile.lastName, profilePicture: currentUserProfile.profilePicture, event: eventId }
    userToFetch.habitCompletions.push(habitCompleteToadd)
    await userToFetch.save()
    return res.status(201).json(userToFetch)
  } catch (err) {
    console.log(err)
    return res.status(404).json({ message: err.message })
  }
}

export const updateHabitComplete = async (req, res) => {
  try {
    const { habitId } = req.params
    const userToFetch = await User.findById(req.currentUser._id)
    if (!userToFetch) throw new Error('Event not found')
    const habitCompletedToUpdate = userToFetch.habitCompletions.id(habitId)
    if (!habitCompletedToUpdate) throw new Error()
    Object.assign(habitCompletedToUpdate, req.body)
    await userToFetch.save()
    return res.status(200).json(userToFetch)
  } catch (err) {
    return res.status(404).json({ message: err.message })
  }
}

export const deleteSingleHabit = async (req, res) => {
  try {
    const { habitId } = req.params
    const currentUserProfile = await User.findById(req.currentUser._id)
    console.log(currentUserProfile)
    const singleHabitForUser = currentUserProfile.habitCompletions.id(habitId)
    if (!singleHabitForUser) throw new Error('Habit not found')
    console.log(singleHabitForUser)
    if (!singleHabitForUser.owner.equals(req.currentUser._id)) throw new Error('Unauthorised')
    await singleHabitForUser.remove()
    await currentUserProfile.save()
    return res.sendStatus(204)
  } catch (error) {
    console.log(error)
  }
}
