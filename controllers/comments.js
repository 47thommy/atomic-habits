import Event from '../models/event.js'
import User from '../models/user.js'

// Comments controllers

export const addComment = async (req, res) => {
  try {
    const { eventId } = req.params
    const event = await Event.findById(eventId)
    const commentToAdd = { ...req.body, owner: req.currentUser._id }
    event.comments.push(commentToAdd)
    await event.save()
    return res.status(201).json(event)
  } catch (err) {
    console.log(err)
  }
}

export const getAllComments = async (req, res) => {
  try {
    const { eventId } = req.params
    const event = await Event.findById(eventId).populate('comments.owner')
    const commentsToFetch = event.comments
    return res.status(200).json(commentsToFetch)
  } catch (err) {
    console.log(err)
  }
}