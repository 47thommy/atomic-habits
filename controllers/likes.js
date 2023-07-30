import Event from '../models/event.js'


export const toggleLike = async (req, res) => {
  try {
    const { eventId } = req.params
    const event = await Event.findById(eventId)
    if (!event.likes.some(like => req.currentUser.equals(like.owner))) {
      event.likes.push({ owner: req.currentUser._id, event: eventId })
    } else {
      const filtered = event.likes.filter(like => req.currentUser.equals(like.owner))
      event.likes.splice(event.likes.indexOf(filtered[0]), 1)
    }
    await event.save()
    console.log('after', event.likes)
    return res.status(201).json(event)
  } catch (err) {
    console.log(err)
  }
}

// export const manageLike = async (req, res) => {
//   try {
//     const { eventId } = req.params
//     const event = await Event.findById(eventId)
//     if (!event) throw new Error('Event not found')
//     const filtered = event.likes.filter(like => req.currentUser.equals(like.owner))
//     if (!filtered.length) throw new Error('Like not found')
//     console.log('filtered=>', filtered)
//     console.log(event.likes.indexOf(filtered[0]))
//     event.likes.splice(event.likes.indexOf(filtered[0]), 1)
//     await event.save()
//     console.log('event likes=>', event.likes)
//     console.log('successful')
//     return res.status(204)
//   } catch (err) {
//     return res.status(404).json(err.message)
//   }
// }

export const getLikes = async (req, res) => {
  try {
    const { eventId } = req.params
    const event = await Event.findById(eventId)
    res.status(200).json(event.likes)
  } catch (err) {
    console.log(err)
  }
}