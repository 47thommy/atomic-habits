import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Box, Flex } from '@chakra-ui/react'
import HabitCompletionCard from './HabitCompletionCard'
import LazyLoad from 'react-lazyload'


const HabitCompletions = ({ eventData, eventId }) => {

  const [habitsFiltered, setHabitsFiltered] = useState(null)
  const [allProfileData, setAllProfileData] = useState({})
  const [hasError, setHasError] = useState({ error: false, message: '' })

  useEffect(() => {
    const getAllProfiles = async () => {
      try {
        const { data } = await axios.get(`/api/profile/all`)
        setAllProfileData(data)
      } catch (err) {
        setHasError({ error: true, message: 'Server error' })
      }
    }
    getAllProfiles()

  }, [])

  useEffect(() => {
    let filteredHabits = []
    if (Object.keys(eventData).length) {
      (eventData.eventMembers)
        .map(member => member)
        .map(habit => habit.habitCompletions)
        .forEach(array => array.forEach(object => filteredHabits.push(object)))
      setHabitsFiltered(filteredHabits)
    }
  }, [eventData])

  return (
    <Flex name='widget' w='100%' flexDirection='column' alignItems='center' rounded='md'>
      {habitsFiltered && habitsFiltered.sort(function (a, b) {
        return new Date(b.createdAt) - new Date(a.createdAt)
      }).map(habit => {
        return (habit.event === eventId ?
          <Box w='100%'>
            <LazyLoad height={200} once >
              <HabitCompletionCard habit={habit} allProfileData={allProfileData} key={habit._id} />
            </LazyLoad>
          </Box>
          :
          ''
        )
      }
      )}
    </Flex>
  )
}

export default HabitCompletions

