import React from 'react'
import { Container, Flex, Image, Box, Heading, Text } from '@chakra-ui/react'
import { Link } from 'react-router-dom'
import { userIsAuthenticated } from '../helper/auth'
import moment from 'moment'


const DiscoverEvents = ({ eventData }) => {
  return (
    <Container display='flex' flexDirection='column' mb='16' name='discover' maxW='container.lg' mt='' m='0' p='0'>
      {userIsAuthenticated()
        ?
        <Heading textAlign={{ base: 'center', md: 'left' }} mt='10' mb='5' size='lg'>Discover more challenges</Heading>
        :
        <Heading color='white' textAlign='center' mt='5' mb='8' size='lg'>Discover challenges</Heading>
      }
      <Flex name='discover-container' alignItems='center' w='100%' justify='space-between' flexDirection={{ base: 'column', md: 'row', lg: 'row' }} flexWrap='wrap' mt='4' mb='6'>
        <>
          {eventData.map(event => {
            const { name, startDate, endDate, _id, picture } = event
            return (
              <Flex key={_id} name="actions" mb='5' bgGradient='linear(to-r, white, gray.100)' width='300px' height='280px' flexDirection='column' alignItems='center' justifyContent='flex-start' boxShadow='2xl' borderRadius='10'>
                <Link to={`/events/${_id}`}>
                  <Image src={picture} alt={name} />
                  <Box name="headline" pl='4' pr='4' mb='4' width=''>
                    <Heading textAlign='center' name='eventName' color='primary' mt='4' size='md'>{name}</Heading>
                    <Text textAlign='center' mt='4' color='gray.500'> {moment.utc(startDate).format('MMM Do')} - {moment.utc(endDate).format('MMM Do')}</Text>
                  </Box>
                </Link>
              </Flex>
            )
          })}
        </>
        <Box width='100%' zIndex='-1' position='absolute' top='0' left='0' bgGradient='linear(to-b, third, second)' height={{ base: '100%', md: '100%', lg: '100%' }}>
          <Text opacity='30%' color='first' fontSize='400px'>30</Text>
        </Box>
      </Flex>
    </Container>
  )
}

export default DiscoverEvents


