import React from "react"
import { CloseIcon, MenuIcon } from './MenuIcons'
import { Box } from "@chakra-ui/react"


export const MenuToggle = ({ toggle, isOpen }) => {
  return (
    <Box display={{ base: "block", md: "none" }} onClick={toggle}>
      {isOpen ? <CloseIcon /> : <MenuIcon />}
    </Box>
  );
};