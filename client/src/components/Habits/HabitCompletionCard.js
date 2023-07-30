import React from 'react'
import { Box, Link, Avatar, Text, Image } from '@chakra-ui/react'
import { habitDateFormat } from '../helper/eventData'

const HabitCompletionCard = ({ habit, allProfileData }) => {

  return (
    <Box name="habit-box" key={habit._id} mt='5' borderWidth='1px' width='100%' borderRadius='lg' overflow='hidden' backgroundColor='white'>
      <Box pl='6' mt='6' name="event-owner" display='flex'>
        <Link to={`/profile/${Object.keys(allProfileData).length && allProfileData.filter(user => user._id === habit.owner)[0]._id}`}>
          <Avatar size='md' src={Object.keys(allProfileData).length ? allProfileData.filter(user => user._id === habit.owner)[0].profilePicture : ''} />
        </Link>
        <Box name='habitOwner' ml='2' display='flex' flexDirection='column'>
          <Box>
            <Link to={`/profile/${Object.keys(allProfileData).length && allProfileData.filter(user => user._id === habit.owner)[0]._id}`}>
              <Text fontWeight='bold' color='third'>{Object.keys(allProfileData).length ? allProfileData.filter(user => user._id === habit.owner)[0].firstName : ''} {Object.keys(allProfileData).length ? allProfileData.filter(user => user._id === habit.owner)[0].lastName : ''}</Text>
            </Link>
          </Box>
          <Box>
            <Text fontSize='sm' color='gray.500'>{habitDateFormat(habit)}</Text>
          </Box>
        </Box>
      </Box>
      <Box pl='6' mt='5' name='comment'>
        <Text color='gray.500' pb='6'>{habit.comment}</Text>
      </Box>
      <Image src={habit.picture} alt='habit-pic' width='100%' maxH='400px' objectFit='cover' />
    </Box>
  )

}

export default HabitCompletionCard