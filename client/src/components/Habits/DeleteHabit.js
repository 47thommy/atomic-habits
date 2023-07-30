import React from 'react'
import axios from 'axios'
import { Box, Flex, Text, Button } from '@chakra-ui/react'
import { Link, useParams, useNavigate } from 'react-router-dom'

const DeleteHabit = () => {

  const params = useParams()
  const navigate = useNavigate()

  const deleteHabit = async (e) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem('tinyhabits-token')
      console.log(token)
      await axios.delete(`/api/events/${params.eventId}/habits/${params.habitId}`, {
        'headers': {
          'Authorization': 'Bearer ' + token
        }
      }) //Posting the data from the form
      console.log(params.userId)
      navigate(`/profile/${params.userId}`)
    } catch (err) {
      console.log(err.response)
    }
  }

  return (
    <>
      <Box>
        <Text fontSize='lg' mb='4' color='white'>Are you sure you want to delete this habit?</Text>
        <Box>
          <Flex flexDirection='row' justifyContent='center'>
            <Box w='100px' mr='3'>
              <Button onClick={deleteHabit} w='100%' mb='5' backgroundColor='#ffbb0f' boxShadow='lg' rounded='md' bg='white' color='white'>Yes</Button>
            </Box>
            <Box w='100px' mr='3'>
              <Link to={`/profile/${params.userId}`}>
                <Button w='100%' mb='5' backgroundColor='#ffbb0f' boxShadow='lg' rounded='md' bg='white' color='white'>No</Button>
              </Link>
            </Box>
          </Flex>
        </Box>
      </Box>
      <Box width='100%' zIndex='-1' position='absolute' top='0' left='0' bgGradient='linear(to-r, first, third)' height={{ base: '460px', md: '460x', lg: '460' }}>
      </Box>
    </>
  )
}

export default DeleteHabit