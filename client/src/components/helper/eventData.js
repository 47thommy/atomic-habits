const options = { month: 'short', day: 'numeric', year: 'numeric' };


export const startDateFormat = (event) => {
  return new Date(event.startDate).toLocaleDateString('en-US', options)
}

export const endDateFormat = (event) => {
  return new Date(event.endDate).toLocaleDateString('en-US', options)
}

export const habitDateFormat = (habit) => {
  return new Date(habit.createdAt).toLocaleDateString('en-US', {  month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export const todayDateFormat = () => {
  return new Date().toLocaleDateString('en-US', options)
}

export const eventBeforeStartDate = (event) => {
  const currentDate = new Date()
  const startDate = new Date(event.startDate)
  const isBeforeStartDate = currentDate < startDate
  return isBeforeStartDate
}

export const eventAfterEndDate = (event) => {
  const currentDate = new Date()
  const endDate = new Date(event.endDate)
  const isAfterEndDate = currentDate > endDate
  return isAfterEndDate
}

export const daysLeftInEvent = (event) => {
  const currentDate = new Date()
  const endDate = new Date(event.endDate)
  const timeDifference = Math.abs(endDate - currentDate)
  const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24))
  return `${daysDifference} days`
}


export const daysLeftUntilEvent = (event) => {
  const currentDate = new Date()
  const startDate = new Date(event.startDate)
  const timeDifference = Math.abs(startDate - currentDate)
  const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24))
  return `${daysDifference} days`
}

