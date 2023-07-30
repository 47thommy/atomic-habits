import React, { useState, useEffect } from 'react'
import {
    Flex,
    Box,
    Heading,
    FormControl,
    FormLabel,
    Input,
    Button,
    Alert,
    Spinner,
    AlertIcon

} from '@chakra-ui/react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { ImageUpload } from '../helper/ImageUpload'


const EditProfile = () => {

    const navigate = useNavigate()
    const params = useParams()
    const [imageUploading, setImageUploading] = useState(false)
    const [alert, setAlert] = useState(false)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        profilePicture: '',
    })

    const [formError, setFormError] = useState({
        firstName: '',
        lastName: '',
        email: '',
        profilePicture: '',
    })
    const handleChange = (e) => {
        const newObj = { ...formData, [e.target.name]: e.target.value } //Spreading formData makes sure we maintain the data structure of formData
        setFormData(newObj)

        setFormError({ ...formError, [e.target.name]: '' })
    }

    useEffect(() => {
        const getProfileData = async () => {
            try {
                const token = localStorage.getItem('tinyhabits-token')
                console.log(token)
                const { data } = await axios.get('/api/profile', {
                    'headers': {
                        'Authorization': 'Bearer ' + token
                    }
                })
                // console.log('data', data)
                const filterData = { firstName: data.firstName, lastName: data.lastName, email: data.email, profilePicture: data.profilePicture }
                setFormData(filterData)
            } catch (err) {
                console.log(err)
                setFormError(err.response)


            }
        }
        getProfileData()
    }, []) // Only on first render


    const handleSubmit = async (e) => {
        e.preventDefault()
        if (formData.profilePicture){
            try {
                const token = localStorage.getItem('tinyhabits-token')
                await axios.put('/api/profile', formData,
                    {
                        'headers': {
                            'Authorization': 'Bearer ' + token
                        }
                    }) //Posting the data from the form
                navigate(`/profile/${params.userId}`)
            } catch (err) {
                console.log('form error ->', formError)
                console.log(err.response)
                setFormError(err.response.data.message)
            }
        } else setAlert(true)
        setTimeout(() => {
          setAlert(false)
        }, 2000)
        
    }

    const handleImageUrl = url => {
        setFormData({ ...formData, profilePicture: url })
    }

    console.log(formData)
    return (
        <><Flex width="full" align="center" justifyContent="center">
            <Box width='100%' backgroundColor='white' p={8} maxWidth="500px" borderWidth={1} borderRadius={8} boxShadow="lg">
                <>
                    <Box textAlign="center">
                        <Heading>Update Profile</Heading>
                    </Box>
                    <Box my={4} textAlign="left">
                        <form onSubmit={handleSubmit}>
                            {/* FirstName */}
                            <FormControl isRequired>
                                <FormLabel htmlFor='firstName'>Firstname</FormLabel>
                                <Input onChange={handleChange} type="firstName" name="firstName" placeholder='Firstname' defaultValue={formData.firstName} />
                                {formError.firstName && <Alert status='error' mt={4}>{formError.firstName}</Alert>}
                            </FormControl>
                            {/* LastName */}
                            <FormControl isRequired>
                                <FormLabel htmlFor='lastName'>Lastname</FormLabel>
                                <Input onChange={handleChange} type="lastName" name="lastName" placeholder='Lastname' defaultValue={formData.lastName} />
                                {formError.lastName && <Alert status='error' mt={4}>{formError.lastName}</Alert>}
                            </FormControl>
                            {/* Email */}
                            <FormControl isRequired>
                                <FormLabel htmlFor='email'>Email</FormLabel>
                                <Input onChange={handleChange} type="email" name="email" placeholder='Email' defaultValue={formData.email} />
                                {formError.email && <Alert status='error' mt={4}>{formError.email}</Alert>}
                            </FormControl>
                            <FormControl mt={6}>
                                <FormLabel htmlFor='profilePicture'>Add Profile Picture</FormLabel>
                                <ImageUpload
                                    value={formData.profilePicture}
                                    name='profilePicture'
                                    handleImageUrl={handleImageUrl}
                                    setImageUploading={setImageUploading}
                                    alert={alert} />
                            </FormControl>
                            {/* Error + Button */}
                            {!imageUploading ?
                <Button type="submit" colorScheme='blue' width="full" mt={4}>Register</Button>
                :
                <Spinner mt='4' />
              }
              {alert &&
                <Alert status='error'>
                  <AlertIcon />
                  Please upload a profile photo
                </Alert>
              }
                            
                        </form>
                    </Box>
                </>
            </Box>
        </Flex><Box width='100%' zIndex='-1' position='absolute' top='0' left='0' bgGradient='linear(to-r, first, third)' height={{ base: '460px', md: '460x', lg: '460' }}>
            </Box>
            </>

    )
}

export default EditProfile