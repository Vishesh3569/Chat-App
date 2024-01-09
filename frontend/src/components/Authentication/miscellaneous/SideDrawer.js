import {  Avatar, Box, Button, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip} from '@chakra-ui/react';
import { Center } from '@chakra-ui/react'
import {ChevronDownIcon ,BellIcon, Search2Icon  } from '@chakra-ui/icons'
import { Input } from "@chakra-ui/input";
import React, { useState } from 'react'
import { Flex, Spacer } from '@chakra-ui/react'
import {ChatState} from '../../../Context/ChatProvider';
import ProfileModal from './ProfileModal';
import { useNavigate } from 'react-router-dom';
import { useDisclosure } from "@chakra-ui/hooks";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import axios from "axios";
import { useToast } from "@chakra-ui/toast";
import ChatLoading from '../../ChatLoading';
import UserListItem from '../../UserAvatar/UserListItem';
import { getSender } from '../../../config/ChatLogics';





const SideDrawer = () => {
  const [search,setSearch]=useState("");
  const [searchResult,setSearchResult]=useState();
  const [loading,setLoading]=useState(false);
  const [loadingChat,setLoadingChat]=useState();
  const navigate=useNavigate();
  
  const {user,setSelectedChat,chats,setChats,notification,setNotification}=ChatState();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const logoutHandler = () =>{
    localStorage.removeItem('userInfo');
    navigate('/',{replace:true})
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }
  

    try {
      setLoading(true);

      const config = {
       
        headers: {
          Authorization: `Bearer ${user.token}`,
          
        },
      };
      // console.log(user.token);
      // console.log("This is the config : "+ config);
      // console.log(await axios.get(`/api/user?search=${search}`, config))
      const { data } = await axios.get(`/api/user?search=${search}`, config);
      // console.log(data);
      // if(!chats.find((c)=> c._id === data._id)) setChats([data,...chats]);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (userId) => {
    // console.log(userId);
    // console.log(searchResult);
  try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post("/api/chat",  {userId} , config);
      // console.log("this is the fucking data id " +data._id);
      // if (!chats.find((c) => c._id === data._id)) {console.log(data._id)}
      // else{
      //   console.log("Id not found");
      // }
     
      if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
      
       setSelectedChat(data);
      setLoadingChat(false);
      onClose();
  }
  catch(error) {
    toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
  };
}

  
  return (
    < >
    
    <Box
    d="flex"
    justifyContent="space-between"
    alignItems="center"
    bg="white"
    w="100%"
    p="5px 10px 5px 10px"
    borderWidth="5px">
      <Flex>
      <Tooltip
      label="Serch user to Chat"
      hasArrow
      placement='bottom-end'>
        <Button variant="ghost" onClick={onOpen}>
          <Search2Icon />
      {/* <i class="fa-duotone fa-magnifying-glass"></i> */}
      <Text display={{base:"none", md:"flex"}} px="4">
        Search User
      </Text>
        </Button>
      </Tooltip>
      <Spacer/>
     
      <Center><Text alignItems="center" font-size="2xl" fontFamily="Work-Sans">
       College Chat App 
      </Text>
        </Center>  
     
      
      
      

      <div>
        <Menu>
          <MenuButton p={1}>
            
            <BellIcon fontSize="2xl" m={2} />
            
           
          </MenuButton>
          <MenuList pl={2}>
            {!notification.length && "No New Messages"}
            {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
          </MenuList>

          
          {/* <MenuIcon></MenuIcon> */}
        </Menu>
         <Menu>
          <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
        <Avatar size="sm" cursor="pointer" name={user.name}/>
            
          </MenuButton>
          <MenuList>
            <ProfileModal user={user}>
            <MenuItem>My Profile</MenuItem>
            </ProfileModal>
            <MenuDivider/>
            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            
          </MenuList>

          
          {/* <MenuIcon></MenuIcon> */}
        </Menu>
      </div>
      </Flex>
    </Box>

     <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box d="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button 
              onClick={handleSearch}
              >Go</Button>
            </Box>
            {loading ? 
              <ChatLoading />
             : (
                searchResult?.map((user) =>(
                  <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => accessChat(user._id)}
                />
                ))
              )}
            {loadingChat && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    
    </>
  )
}

export default SideDrawer