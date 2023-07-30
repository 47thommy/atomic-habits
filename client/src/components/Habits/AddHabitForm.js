import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'
import HabitFormTemplate from './HabitFormTemplate'
import { Box } from '@chakra-ui/react'

const AddHabitForm = () => {

  const navigate = useNavigate()

  const [habitFormData, setHabitFormData] = useState({
    comment: '',
    picture: '',
  })

  const [formErrors, setFormErrors] = useState({
    comment: '',
    picture: '',
  })

  const [backEndError, setBackEndError] = useState('')
  const [alert, setAlert] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [getEvent, setGetEvent] = useState([])



  function handleChange(e) {
    const newObj = { ...habitFormData, [e.target.name]: e.target.value }
    setHabitFormData(newObj)
    setFormErrors({ ...formErrors, [e.target.name]: '' })
  }

  const { eventId } = useParams()
  console.log(eventId)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (habitFormData.picture) {
      try {
        const token = localStorage.getItem('tinyhabits-token')
        console.log(token)

        await axios.post(`/api/events/${eventId}/habits`, habitFormData, {
          'headers': {
            'Authorization': 'Bearer ' + token
          }
        })

        const getProfileId = async () => {
          try {
            const token = localStorage.getItem('tinyhabits-token')
            console.log(token)
            const { data } = await axios.get('/api/profile', {
              'headers': {
                'Authorization': 'Bearer ' + token
              }
            })
            console.log('data', data.id)
            navigate(`/profile/${data.id}`)
          } catch (err) {
            console.log(err)
          }
        }
        getProfileId()

        // Redirect using the navigate variable, passing in the route we want to redirect to
      } catch (err) {
        console.log(err.response.data.message)
        setBackEndError(err.response.data.message)
        setFormErrors(err.response.data.errors)
      }
    } else setAlert(true)
    setTimeout(() => {
      setAlert(false)
    }, 2000)

  }

  const handleImageUrl = url => {
    setHabitFormData({ ...habitFormData, picture: url })
  }

  useEffect(() => {
    const getEventDetails = async () => {
      try {
        const { data } = await axios.get(`/api/events/${eventId}`)
        console.log(data)
        setGetEvent(data)
      } catch (error) {
        console.log(error)
      }
    }
    getEventDetails()
  }, [eventId])


  console.log(habitFormData)
  console.log(getEvent)
  console.log(backEndError)
  return (
    <><HabitFormTemplate
      handleSubmit={handleSubmit}
      handleChange={handleChange}
      formData={habitFormData}
      formErrors={formErrors}
      habitError={backEndError}
      handleImageUrl={handleImageUrl}
      setImageUploading={setImageUploading}
      imageUploading={imageUploading}
      alert={alert}
    />
      <Box width='100%' height='100vh' zIndex='-1' position='absolute' top='0' left='0' bgGradient='linear(to-r, first, third)' >
      </Box>
    </>

  )
}

export default AddHabitForm