import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Container, Flex, Box, Heading, Wrap, WrapItem, Spinner, Text, Button, Image } from '@chakra-ui/react'
import { useNavigate, Link } from "react-router-dom"
import { getTokenFromLocalStorage, userIsAuthenticated } from '../helper/auth'
import { HabitsCompletedDashboard } from '../helper/habitStats'
import EventDropdown from '../helper/eventDropdown'
import { daysLeftUntilEvent, daysLeftInEvent, eventBeforeStartDate, eventAfterEndDate } from '../helper/eventData'


const Dashboard = ({ eventData }) => {
  const [profileData, setProfileData] = useState({})
  const [userEvents, setUserEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState({})
  const [eventHabitCompletions, setEventHabitCompletions] = useState([])
  const [widget, setWidget] = useState([])
  const [hasError, setHasError] = useState({ error: false, message: '' })
  const navigate = useNavigate()

  // Fetching user profile data if user is logged in
  useEffect(() => {
    const getProfileData = async () => {
      try {
        const res = await axios.get('/api/profile', {
          headers: {
            Authorization: `Bearer ${getTokenFromLocalStorage()}`,
          },
        })
        console.log('response', res)
        setProfileData(res.data)
      } catch (err) {
        setHasError({ error: true, message: err.message })
      }
    }
    getProfileData()
  }, [navigate])

  // Setting the list of events user has joined and initially populating the selected event
  useEffect(() => {
    if (eventData.length && Object.keys(profileData).length) {
      const filtered = eventData.filter(event => profileData.events.some(ev => ev._id === event._id))
      setUserEvents(filtered)
      const sortFiltered = filtered.sort(function (a, b) {
        return new Date(a.startDate) - new Date(b.startDate)
      })
      setSelectedEvent(sortFiltered[0])
    }
  }, [profileData, eventData])

  // Changing the selected event on user's input
  const handleOptionChange = (e) => {
    const filtered = userEvents.filter(event => event.name === e.target.value)
    setSelectedEvent(filtered[0])
  }

  // Calculating the user's best habit completion streak
  const calcStreak = () => {
    console.log(selectedEvent)
    if (!eventHabitCompletions.length) return 0
    if (selectedEvent && Object.keys(selectedEvent).length) {
      const strDate = Date.parse(selectedEvent.startDate)
      const endDate = Date.parse(selectedEvent.endDate)
      const days = []
      for (let i = new Date(strDate); i <= endDate; i.setDate(i.getDate() + 1)) {
        days.push(new Date(i).toLocaleDateString())
      }
      console.log(days)
      const completedDates = eventHabitCompletions.map(habit => new Date(habit.createdAt).toLocaleDateString())
      console.log(completedDates)
      const mapped = days.map(date => {
        return completedDates.includes(date) ? 1 : 0
      })
      let streaks = mapped.reduce((res, n) =>
        (n ? res[res.length - 1]++ : res.push(0), res)
        , [0])
      console.log(streaks.join(","))
      return Math.max(...streaks)
    }
  }

  // Fetching the habit completion data for the selected event
  useEffect(() => {
    if (profileData.habitCompletions && selectedEvent && Object.keys(selectedEvent).length) {
      const filtered = profileData.habitCompletions.filter(habit => habit.event === selectedEvent._id)
      setEventHabitCompletions(filtered)
    }
  }, [profileData, selectedEvent])

  // Generating the circle progress widget
  useEffect(() => {
    const arr = []
    if (selectedEvent && Object.keys(selectedEvent).length) {
      const strDate = Date.parse(selectedEvent.startDate)
      const endDate = Date.parse(selectedEvent.endDate)
      const days = []
      for (let i = new Date(strDate); i <= endDate; i.setDate(i.getDate() + 1)) {
        days.push(new Date(i).toLocaleDateString())
      }
      days.forEach((day, i) => {
        arr.push(<WrapItem h='20px' w='20px' backgroundColor='gray.200' borderRadius='50%' justifyContent='center' key={day} id={day}></WrapItem>)
      })
      if (eventHabitCompletions.length) {
        const completedDates = eventHabitCompletions.map(habit => new Date(habit.createdAt).toLocaleDateString())
        arr.filter(obj => completedDates.includes(obj.key)).forEach(obj => {
          arr[arr.indexOf(obj)] = <WrapItem h='20px' w='20px' backgroundColor='fifth' borderRadius='50%' justifyContent='center' key={obj.key} id={obj.key}></WrapItem>
        })
        setWidget(arr)
      } else {
        setWidget(arr)
      }
    }
  }, [selectedEvent, eventHabitCompletions])

  const toAddHabitPage = () => {
    navigate(`/events/${selectedEvent.id}/AddHabitCompletion`)
  }

  return (
    <>
      {userIsAuthenticated() && userEvents.length ?
        <>
          {Object.keys(selectedEvent).length ?
            <Container name='header' justifyContent={{ sm: 'center', md: 'center', lg: 'space-between' }} alignItems={{ base: 'center', md: 'center', lg: 'flex-start' }} p='0' mt='15' display='flex' flexDirection={{ base: 'column', md: 'row' }} maxW='container.lg' flexWrap='wrap'>
              <Flex name='welcome-header' alignItems={{ base: 'center', md: 'center', lg: 'flex-start' }} justifyContent={{ sm: 'center', md: 'center', lg: 'flex-start' }} width={{ lg: '55%' }} pb='50' pt={{ base: 0, md: 0 }} mr='0' display='flex' flexDirection='column'>
                <Heading fontWeight='regular' size='md' mt={{ base: '5', md: '20' }} mb='3' textAlign={{ xs: 'center', sm: 'left', md: 'center', lg: 'left' }} color='second'>Welcome {profileData.firstName}!</Heading>
                {selectedEvent.isLive &&
                  <Text fontSize='2.3em' fontWeight='bold' name='event-selector' mb='5' color='second' textAlign={{ base: 'center', sm: 'center', md: 'center', lg: 'left' }}>You have {daysLeftInEvent(selectedEvent)} left in your challenge!</Text>}
                {!selectedEvent.isLive && eventBeforeStartDate(selectedEvent) &&
                  <Text fontSize='2.3em' fontWeight='bold' name='event-selector' mb='5' color='second' textAlign={{ base: 'center', sm: 'center', md: 'center', lg: 'left' }}>Your challenge starts in {daysLeftUntilEvent(selectedEvent)}!</Text>
                }
                {!selectedEvent.isLive && eventAfterEndDate(selectedEvent) && <Text fontSize={{ base: '12px', md: '16px', xl: '24px' }} fontWeight='bold' textAlign='center'>The challenge is over</Text>}
                <EventDropdown mt='5' handleOptionChange={handleOptionChange} selectedEvent={selectedEvent} userEvents={userEvents} />
              </Flex>
              <Flex name="actions" mt='5' bg='white' width={{ md: '450px', lg: '600px', xl: '450px' }} mx={{ md: 'auto' }} flexDirection='column' alignItems='center' justifyContent='space-evenly' boxShadow='2xl' borderRadius='10'>
                <Box name="widget-header" display='flex' flexDirection='column' w='100%' minHeight='300px' justifyContent='space-evenly' borderTopRadius='10' backgroundColor='#F56565' >
                  <Link to={`/events/${selectedEvent._id}`}>
                    {/* bgGradient='linear(to-r, , white)' */}
                    <Image src={selectedEvent.picture} alt={selectedEvent.name} w='100%' />
                    <Box name="headline" pl='4' pr='4' mb='2' width=''>
                      <Heading textAlign='center' name='eventName' color='white' mt='2' size='lg'>{selectedEvent.name}</Heading>
                      <Text textAlign='center' name='subtitle' mt='3' fontSize='14px' color='second'>{selectedEvent.subTitle}</Text>
                    </Box>
                    {selectedEvent.isLive && userIsAuthenticated() &&
                      <Box name='progress' pl='4' pr='4' mb='6' >
                        <HabitsCompletedDashboard eventHabitCompletions={eventHabitCompletions} />
                      </Box>
                    }
                  </Link>
                </Box>
                {selectedEvent.isLive && userIsAuthenticated() ?
                  <>
                    <Box name='widget-footer' display='flex' h='250px' flexDirection='column' p='6' alignItems='center' justifyContent='flex-end'>
                      <Text fontSize='sm' color='gray.500'>Your best streak: {calcStreak()}</Text>
                      <Wrap p='4'>{widget}</Wrap>
                      <Button onClick={toAddHabitPage} fontSize='16px' fontWeight='bold' w='60%' backgroundColor='fourth' boxShadow='2xl' p='6' rounded='md' bg='white' color='white'>Add habit for today</Button>
                    </Box>
                  </>
                  :
                  <>
                    <Box display='flex' flexDirection='column' p='6' alignItems='center'>
                      <Link to={`/events/${selectedEvent._id}`} >
                        < Button fontSize='16px' fontWeight='bold' backgroundColor='fourth' p='6' rounded='md' mt='2' bg='white' color='white'>View event</Button>
                      </Link>
                    </Box>
                  </>
                }
              </Flex>
            </Container>
            :
            hasError.error ?
              <p>{hasError.message}</p> : <Spinner />
          }
        </>
        :
        userIsAuthenticated() ?
          <Box m='6' >
            <Heading color='white' textAlign='center' as='h1' mb='4' mt='14' size='2xl'>Welcome {profileData.firstName}</Heading>
            <Text textAlign='center' fontSize='xl' color='white'>More than 352 people have created a new habit in 30 days</Text>
          </Box>
          :
          <Box m='6'>
            <Heading color='white' textAlign='center' as='h1' mb='4' mt='14' size='2xl'>Welcome to TinyHabit</Heading>
            <Text textAlign='center' fontSize='xl' color='white'>More than 352 people have created a new habit in 30 days</Text>
          </Box>
      }
    </>
  )
}

export default Dashboard