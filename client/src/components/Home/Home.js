import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Box, Container, Text, Spinner } from '@chakra-ui/react'
import Dashboard from './Dashboard.js'
import DiscoverEvents from './DiscoverEvents'

const Home = () => {
  const [eventData, setEventData] = useState([])
  const [hasError, setHasError] = useState({ error: false, message: '' })


  useEffect(() => {
    const getEvents = async () => {
      try {
        const { data } = await axios.get('/api/events')
        setEventData(data)
        console.log(data)
      } catch (err) {
        setHasError({ error: true, message: err.message })
      }
    }
    getEvents()
  }, [])

  return (
    <>
      {eventData.length ?
        <>
          <Dashboard eventData={eventData} />
          <DiscoverEvents eventData={eventData} />
          <Box width='100%' zIndex='-1' position='absolute' top='0' left='0' bgGradient='linear(to-b, third, second)' height={{ base: '100%', md: '100%', lg: '100%' }}>
            <Text opacity='30%' color='first' fontSize='400px'>30</Text>
          </Box>
        </>
        :
        <Container>
          {hasError.error ? <p>{hasError.message}</p> : <Spinner />}
        </Container>
      }
    </>
  )
}

export default Home


