import React, { useState } from "react";
import {
  Flex,
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Alert,
  AlertIcon,
  Spinner,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ImageUpload } from "../helper/ImageUpload";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    profilePicture: "",
  });

  const [formError, setFormError] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirmation: "",
    profilePicture: "",
  });
  const handleChange = (e) => {
    const newObj = { ...formData, [e.target.name]: e.target.value };
    setFormData(newObj);
    setFormError({ ...formError, [e.target.name]: "" });
  };

  const [alert, setAlert] = useState(false);

  // Saves the token from handleSubmit in the localStorage
  const [imageUploading, setImageUploading] = useState(false);

  const setTokenToLocalStorage = (token) => {
    window.localStorage.setItem("tinyhabits-token", token);
  };

  const handleSubmit = async (e) => {
    // if (formData.password && formData.passwordConfirmation && formData.password !== formData.passwordConfirmation)
    //   setFormError({ ...formError, passwordConfirmation: 'passwords don\'t match' })
    e.preventDefault();
    if (formData.profilePicture) {
      try {
        const { data } = await axios.post("/api/register", formData);
        console.log("try"); //Posting the data from the form
        console.log("token", data.token);
        setTokenToLocalStorage(data.token); // pass on the token to the localStorage
        navigate("/");
      } catch (err) {
        const arr = Object.keys(err.response.data.errors);
        const key = arr[0];
        setFormError({ [key]: err.response.data.message });
      }
    } else {
      setAlert(true);
    }
    setTimeout(() => {
      setAlert(false);
    }, 2200);
  };

  const handleImageUrl = (url) => {
    console.log(url);
    setFormData({ ...formData, profilePicture: url });
  };
  return (
    <>
      <Flex width="full" align="center" justifyContent="center" mt="10">
        <Box
          background="white"
          p={8}
          maxWidth="500px"
          borderWidth={1}
          borderRadius={8}
          boxShadow="2xl"
        >
          <>
            <Box textAlign="center">
              <Heading>Register</Heading>
            </Box>
            <Box my={4} textAlign="left">
              <form onSubmit={handleSubmit}>
                {/* FirstName */}
                <FormControl isRequired>
                  <FormLabel htmlFor="firstName" mb="1">
                    Firstname
                  </FormLabel>
                  <Input
                    onChange={handleChange}
                    type="firstName"
                    name="firstName"
                    placeholder="Firstname"
                    defaultValue={formData.firstName}
                  />
                  {formError.firstName && (
                    <Alert status="error" mt={4}>
                      {formError.firstName}
                    </Alert>
                  )}
                </FormControl>
                {/* LastName */}
                <FormControl isRequired>
                  <FormLabel htmlFor="lastName" mb="1" mt={2}>
                    Lastname
                  </FormLabel>
                  <Input
                    onChange={handleChange}
                    type="lastName"
                    name="lastName"
                    placeholder="Lastname"
                    defaultValue={formData.lastName}
                  />
                  {formError.lastName && (
                    <Alert status="error" mt={4}>
                      {formError.lastName}
                    </Alert>
                  )}
                </FormControl>
                {/* Email */}
                <FormControl isRequired>
                  <FormLabel htmlFor="email" mt={2} mb="1">
                    Email
                  </FormLabel>
                  <Input
                    onChange={handleChange}
                    type="email"
                    name="email"
                    placeholder="Email"
                    defaultValue={formData.email}
                  />
                  {formError.email && (
                    <Alert status="error" mt={4}>
                      {formError.email}
                    </Alert>
                  )}
                </FormControl>
                {/* Password */}
                <FormControl isRequired mt={2} mb="1">
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <Input
                    onChange={handleChange}
                    type="password"
                    name="password"
                    placeholder="Password"
                    defaultValue={formData.password}
                  />
                  {formError.password && (
                    <Alert status="error" mt={4}>
                      {formError.password}
                    </Alert>
                  )}
                </FormControl>
                {/* Password Confirmation */}
                <FormControl isRequired mt={2}>
                  <FormLabel htmlFor="passwordConfirmation">
                    Password Confirmation
                  </FormLabel>
                  <Input
                    onChange={handleChange}
                    type="password"
                    name="passwordConfirmation"
                    placeholder="Password Confirmation"
                    defaultValue={formData.passwordConfirmation}
                  />
                  {formError.passwordConfirmation && (
                    <Alert status="error" mt={4}>
                      {formError.passwordConfirmation}
                    </Alert>
                  )}
                </FormControl>
                <FormControl isRequired mt={6}>
                  <FormLabel htmlFor="picture">Add Profile Picture</FormLabel>
                  <ImageUpload
                    value={formData.profilePicture}
                    name="picture"
                    handleImageUrl={handleImageUrl}
                    setImageUploading={setImageUploading}
                  />
                </FormControl>
                {/* Error + Button */}
                {!imageUploading ? (
                  <Button type="submit" colorScheme="blue" width="full" mt={4}>
                    Register
                  </Button>
                ) : (
                  <Spinner mt="4" />
                )}
                {alert && (
                  <Alert status="error">
                    <AlertIcon />
                    Please upload a profile photo
                  </Alert>
                )}
              </form>
            </Box>
          </>
        </Box>
      </Flex>
      <Box
        width="100%"
        height="100vh"
        zIndex="-1"
        position="absolute"
        top="0"
        left="0"
        bgGradient="linear(to-r, first, third)"
      ></Box>
    </>
  );
};

export default Register;
