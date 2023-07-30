import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import HabitFormTemplate from './HabitFormTemplate'
import { Box } from '@chakra-ui/react'

const EditHabit = () => {

  const params = useParams()
  const navigate = useNavigate()
  const [alert, setAlert] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [singleHabitData, setSingleHabitData] = useState({
    comment: '',
    picture: '',
  })

  const [formErrors, setFormErrors] = useState({
    comment: '',
    picture: '',
  })

  const [habitError, setHabitError] = useState('')

  useEffect(() => {
    const getSingleHabitDetails = async () => {
      try {
        const token = localStorage.getItem('tinyhabits-token')
        console.log(token)
        const { data } = await axios.get(`/api/events/${params.eventId}/habits/${params.habitId}`, {
          'headers': {
            'Authorization': 'Bearer ' + token
          }
        })
        // console.log('data', data)
        const filterData = { comment: data.comment, picture: data.picture }
        setSingleHabitData(filterData)
      } catch (err) {
        console.log(err)
        setHabitError(err.response)


      }
    }
    getSingleHabitDetails()
  }, [params]) // Only on first render


  const handleSubmit = async (e) => {
    e.preventDefault() // prevent reload
    if (singleHabitData.picture) {
      try {
        const token = localStorage.getItem('tinyhabits-token')

        await axios.put(`/api/events/${params.eventId}/habits/${params.habitId}`, singleHabitData, {
          'headers': {
            'Authorization': 'Bearer ' + token
          }
        })
        navigate(`/profile/${params.userId}`)
      } catch (err) {
        console.log(err.response.data.message)
        setFormErrors(err.response.data.errors)
      }
    }

  }

  const handleChange = (e) => {
    setSingleHabitData({ ...singleHabitData, [e.target.name]: e.target.value })
    setFormErrors({ ...formErrors, [e.target.name]: '' })
  }

  const handleImageUrl = url => {
    setSingleHabitData({ ...singleHabitData, picture: url })
  }

  console.log(singleHabitData)
  return (
    <><HabitFormTemplate
      handleSubmit={handleSubmit}
      handleChange={handleChange}
      formData={singleHabitData}
      formErrors={formErrors}
      habitError={habitError}
      handleImageUrl={handleImageUrl}
      setImageUploading={setImageUploading}
      imageUploading={imageUploading}
      alert={alert}
    />
      <Box width='100%' zIndex='-1' position='absolute' top='0' left='0' bgGradient='linear(to-r, first, third)' height={{ base: '460px', md: '460x', lg: '460' }}>
      </Box></>
  )
}

export default EditHabit