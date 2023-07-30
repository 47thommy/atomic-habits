import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Select, Spinner, VStack, Box, Heading, Flex, Avatar, Text, Image, Button } from '@chakra-ui/react'
import { Link, useParams } from 'react-router-dom'
import { getTokenFromLocalStorage, userIsAuthenticated } from '../helper/auth'
import { habitDateFormat } from '../helper/eventData'


const SingleProfile = () => {

  const [profileData, setProfileData] = useState(null)
  const [loggedInProfile, setLoggedInProfile] = useState(null)
  const [eventData, setEventData] = useState([])
  const [filterHabits, setFilterHabits] = useState({
    event: '',
    date: ''
  })
  const [habitsFiltered, setHabitsFiltered] = useState(null)
  const [hasError, setHasError] = useState({ error: false, message: '' })

  const { userId } = useParams()

  useEffect(() => {

    const getEventsData = async () => {
      try {
        const { data } = await axios.get(`/api/events`)
        setEventData(data)
      } catch (err) {
        setHasError({ error: true, message: 'Server error' })
      }
    }
    getEventsData()

    const getProfileData = async () => {
      try {
        const token = localStorage.getItem('tinyhabits-token')
        console.log(token)
        const { data } = await axios.get(`/api/profile/${userId}`)
        console.log('data', data)
        setProfileData(data)
      } catch (err) {
        console.log(err)
      }
    }
    getProfileData()
  }, [userId])

  useEffect(() => {
    const getLoggedInProfile = async () => {
      try {
        const token = localStorage.getItem('tinyhabits-token')
        console.log(token)
        const { data } = await axios.get(`/api/profile`, {
          headers: {
            Authorization: `Bearer ${getTokenFromLocalStorage()}`,
          }
        })
        setLoggedInProfile(data)
      } catch (err) {
        console.log(err)
      }
    }
    getLoggedInProfile()
  }, [])

  function filterHabitsFunction(e) {
    console.log(e.target.value)
    console.log(e.target.name)
    setFilterHabits({ ...filterHabits, [e.target.name]: e.target.value })
  }

  let userEvents
  if (profileData) {
    userEvents = eventData.filter(event => {
      return profileData.events.some(item => item._id === event._id)
    })
  }

  useEffect(() => {
    if (profileData && eventData.length) {
      let filteredHabits
      if ((filterHabits.event === 'All' | filterHabits.event === '') && (filterHabits.date === 'All' | filterHabits.date === '')) {
        filteredHabits = profileData.habitCompletions
      } else if (filterHabits.event === 'All' | filterHabits.event === '') {
        filteredHabits = profileData.habitCompletions.filter(habit => new Date(habit.createdAt).toLocaleDateString() === filterHabits.date)
      } else if (filterHabits.date === 'All' | filterHabits.date === '') {
        filteredHabits = profileData.habitCompletions.filter(habit => eventData.filter(event => event._id === habit.event)[0].name === filterHabits.event)
      } else {
        filteredHabits = profileData.habitCompletions.filter(habit => (new Date(habit.createdAt).toLocaleDateString() === filterHabits.date) && (eventData.filter(event => event._id === habit.event)[0].name === filterHabits.event))
      }
      console.log('filtered habits ->', filteredHabits)
      setHabitsFiltered(filteredHabits)
    }


  }, [filterHabits, profileData, eventData])

  return (
    <>
      {profileData && eventData.length && Object.keys(profileData).length ?
        <>
          <Flex zIndex='0' p='0' mt='5' name="wrapper" width='80%' flexDirection='column'>
            <Flex zIndex='0' width='100%' p='0' mt='5' alignItems='center' name="wrapper" direction={{ base: 'column', md: 'row' }}>
              <VStack display='flex' name="content" direction='column' alignItems={{ base: 'center', md: 'flex-start' }}>
                <Box width='100%' name="header" mb='25px' >
                  <Flex flexDirection={{ base: 'column', md: 'row' }} alignItems={{ base: 'center', md: 'center' }}>
                    <Box name="image">
                      <Avatar
                        borderRadius='full'
                        boxSize='80px'
                        src={profileData.profilePicture !== '' ? profileData.profilePicture : ''}
                        alt='profile picture' />
                    </Box>
                    <Box display='flex' justify='center' flexDirection='column'>
                      <Box name="username">
                        <Heading ml={{ base: '0', md: '6' }} justify='center' textAlign={{ base: 'center', md: 'left' }} color='white' mt='2' as='h1' fontSize={{ base: '20px', md: '24px', lg: '30px' }} mb='2'>{profileData.firstName + ' ' + profileData.lastName}</Heading>
                      </Box>
                    </Box>
                    <Box>
                      {loggedInProfile && userIsAuthenticated() && loggedInProfile.id === userId ?
                        <Link to={`/profile/${profileData.id}/edit-profile`}>
                          <Button mt='2' ml='6' boxShadow='lg' rounded='md' size='sm' width='80px' colorScheme='blue'>Edit</Button>
                        </Link>
                        : <Box h='48px'></Box>}
                    </Box>
                  </Flex>
                </Box>
                <Heading mb='3' color='white' textAlign={{ base: 'center', sm: 'left', md: 'left', lg: 'left' }} size='md'>Joined events</Heading>
                <Flex name='joinedEvents' width='100%'>
                  <Flex name='discover-container' alignItems='center' w='100%' justifyContent={{ base: 'center', sm: 'left', md: 'left', lg: 'left' }} flexDirection={{ base: 'column', md: 'row', lg: 'row' }} flexWrap='wrap' mt='4' mb='6'>
                    <>
                      {eventData.length && profileData && userEvents.map(event => {
                        return (
                          <Flex key={event._id} name="actions" mr={{ base: '0', md: '6' }} mb='5' bgGradient='linear(to-r, white, gray.100)' width='150px' height='120px' flexDirection='column' alignItems='center' justifyContent='flex-start' boxShadow='2xl' borderRadius='10'>
                            <Box name="headline" mb='4' width='100%'>
                              <Link to={`/events/${event._id}`}>
                                <Image src={event.picture} alt={event.name} w='100%' />
                                <Heading textAlign='center' name='eventName' color='primary' mt='2' size='sm'>{event.name}</Heading>
                              </Link>
                            </Box>
                          </Flex>
                        )
                      })}
                    </>
                    <Box width='100%' zIndex='-1' position='absolute' top='0' left='0' bgGradient='linear(to-r, first, third)' height={{ base: '460px', md: '460x', lg: '460' }}>
                      <Text opacity='30%' color='first' fontSize='400px'>30</Text>
                    </Box>
                  </Flex>
                </Flex>
                <Box>
                  <Box width={{ base: '100%', md: '80%' }}>
                    <Flex name='habits' flexDirection='column' justifyContent='flex-start'>
                      {habitsFiltered && habitsFiltered.length ?
                        <>
                          <Box name="habits-completed-box" mt='8' color='black' borderTopRadius='10'>
                            <Heading my='3' textAlign={{ base: 'center', md: 'left' }} size='md'>Habits Completed</Heading>
                            <Flex flexDirection={{ base: 'column', md: 'row' }}>
                              <Select mr={{ base: 0, md: 1 }} mb={{ base: '2', md: '0' }} className='filterHabit' name="event" id="event" onChange={filterHabitsFunction}>
                                {console.log(profileData.events.filter(joinedEvent => habitsFiltered.some(habit => habit.event.includes(joinedEvent._id))))}
                                <option hidden>Event</option>
                                <option>All</option>
                                {profileData.events.filter(object => habitsFiltered.some(habit => habit.event.includes(object._id))).map(joinedEvent => {
                                  return (
                                    <option key={joinedEvent._id}>{eventData.length && eventData.filter(event => event._id === joinedEvent._id)[0].name}</option>
                                  )
                                })}
                              </Select>
                              <Select ml={{ base: 0, md: 1 }} width={{ base: '100%', md: '30%' }} className='filterHabit' name="date" id="date" onChange={filterHabitsFunction}>
                                <option hidden>Date</option>
                                <option>All</option>
                                {profileData.habitCompletions.sort(function (a, b) {
                                  return new Date(b.createdAt) - new Date(a.createdAt)
                                }).map(habit => {
                                  return (
                                    <option key={habit._id}>{new Date(habit.createdAt).toLocaleDateString()}</option>
                                  )
                                })}
                              </Select>
                            </Flex>
                          </Box>
                          <Flex name='widget' bg='white' w='100%' mb='14' flexDirection='column' alignItems='center' rounded='md'>
                            {habitsFiltered && habitsFiltered.sort(function (a, b) {
                              return new Date(b.createdAt) - new Date(a.createdAt)
                            }).map(habit => {
                              return (habitsFiltered ?
                                <Box name="habit-box" key={habit._id} mt='5' borderWidth='1px' width='100%' borderRadius='lg' overflow='hidden'>
                                  <Box name="habit-header" pl='6' pt='26' pb='1'>
                                    <Box name='event-widget' display='flex'>
                                      <Box name="event-emoji">
                                        <Heading size='md'>{eventData.length ? eventData.filter(event => event._id === habit.event)[0].emoji : '...'}</Heading>
                                      </Box>
                                      <Box name="event-name" ml='4'>
                                        <Heading size='md'>{eventData.length ? eventData.filter(event => event._id === habit.event)[0].name : '...'}</Heading>
                                      </Box>
                                    </Box>
                                    <Box ml='9' mt='2' name="date" justifyContent="flex-end">
                                      <Text fontSize='xs' color='gray.500'>{habitDateFormat(habit)}</Text>
                                    </Box>
                                    <Box mt='4' ml='9' name='comment'>
                                      <Text color='gray.500' pb='4'>{habit.comment}</Text>
                                    </Box>
                                    {loggedInProfile && userIsAuthenticated() && loggedInProfile.id === userId &&
                                      <Box>
                                        <Flex flexDirection='row' ml='2' mb='5' justifyContent='left'>
                                          <Box mr='2'>
                                            <Link to={`/profile/${profileData.id}/${habit.event}/${habit._id}/edit`}>
                                              <Button mt='2' ml='6' boxShadow='lg' rounded='md' size='sm' width='80px' colorScheme='blue'>Edit</Button>
                                            </Link>
                                          </Box>
                                          <Box mr='2'>
                                            <Link to={`/profile/${profileData.id}/${habit.event}/${habit._id}/delete-habit`}>
                                              <Button mt='2' ml='6' boxShadow='lg' rounded='md' size='sm' width='80px' colorScheme='blue'>Delete</Button>
                                            </Link>
                                          </Box>
                                        </Flex>
                                      </Box>
                                    }
                                  </Box>
                                  <Image src={habit.picture} alt='habit-pic' width='100%' />
                                </Box>
                                :
                                <Text mb='4' color='black' fontSize='md'>No habits completed</Text>
                              )
                            }
                            )}
                          </Flex>
                        </>
                        :
                        ''}
                    </Flex>
                  </Box>
                </Box>
              </VStack>
            </Flex>
          </Flex>
          <Box name='background' width='100%' zIndex='-1' position='absolute' top='0' left='0' bgGradient='linear(to-r, first, third)' height={{ base: '460px', md: '460x', lg: '460' }}>
          </Box>
        </>
        :
        <Flex flexDirection='row' justifyContent='center'>
          <Spinner />
        </Flex>
      }

    </>
  )
}

export default SingleProfile