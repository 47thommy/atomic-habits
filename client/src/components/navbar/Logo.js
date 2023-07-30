import React from "react"
import { Box, Image, Link } from "@chakra-ui/react"

const Logo = (props) => {
  return (
    <Box {...props} >
      <Link href='/'>
        <Box width='160px'>
          <Image src='https://res.cloudinary.com/dmbkzjwzq/image/upload/v1645186990/project_3_sei61/logo_tfdfy1.png' width='160px' alt='logo' />
        </Box>
      </Link>
    </Box>
  )
}

export default Logo