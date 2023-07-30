import React from "react";
import { Link, Box, Text, Button, Stack } from "@chakra-ui/react";
import { MenuToggle } from './MenuToggle'
import { userIsAuthenticated } from '../helper/auth'
import { useNavigate } from "react-router-dom"
import NavBarContainer from "./NavBarContainer"
import axios from 'axios'


import Logo from "./Logo";

const NavBar = (props) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <NavBarContainer {...props} pt='4'>
      <Logo
        w="100px"
        color={["white", "white", "primary.500", "primary.500"]}
      />
      <MenuToggle toggle={toggle} isOpen={isOpen} />
      <MenuLinks isOpen={isOpen} />
    </NavBarContainer>
  );
};

const MenuItem = ({ children, isLast, to = "/", ...rest }) => {
  return (
    <Link href={to}>
      <Text display="block" {...rest}>
        {children}
      </Text>
    </Link>
  );
};



const MenuLinks = ({ isOpen }) => {

  const navigate = useNavigate()
  // const location = useLocation()
  // console.log(location)

  const handleLogout = (e) => {
    e.preventDefault()
    // Remove token
    window.localStorage.removeItem('tinyhabits-token')
    // Redirect to the home page
    navigate('/')
  }

  //  const [userProfileId, setUserProfileId] = useState('null')

  const gotToUserProfile = (e) => {
    e.preventDefault()
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
        //  setUserProfileId(data.id)
      } catch (err) {
        console.log(err)
      }
    }
    getProfileId()

  }

  return (
    <Box 
      name="top"
      display={{ base: isOpen ? "flex" : "none", md: "block" }}
      flexBasis={{ base: "100%", md: "auto" }}
      justifyContent='flex-end'
    >
      <Stack
        spacing={8}
        justify={["center", "space-between", "flex-end", "flex-end"]}
        direction={["row", "row", "row", "row"]}
        pt={[4, 4, 0, 0]}
        alignItems='center'
      >
        {userIsAuthenticated() ?
          <Box name='subnav' w="100" display='flex' justifyContent='space-between'>
            <MenuItem mr='10' onClick={gotToUserProfile}>Profile </MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Box>
          :
          <>
            <MenuItem to="/login">Login</MenuItem>
            <MenuItem to="/register" isLast>
              <Button
                size="sm"
                rounded="md"
                color={["third", "third", "third", "third"]}
                bg={["white", "white", "primary.500", "primary.500"]}
                _hover={{
                  bg: ["primary.100", "primary.100", "primary.600", "primary.600"]
                }}
              >
                Register
              </Button>
            </MenuItem>
          </>
        }
      </Stack >
    </Box >
  )
}


export default NavBar;