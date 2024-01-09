import React ,{useState} from 'react'
import axios from "axios";
import {useNavigate} from 'react-router-dom';

import {
    Button,
  FormControl,
  FormLabel,
//   FormErrorMessage,
//   FormHelperText,
  Input,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react'
import { VStack } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'



const Signup = () => {
     const [show,setShow]=useState(false);
    const [name,setName]=useState();
    const [email,setEmail]=useState();
    const [password,setPassword]=useState();
    // const [pic,SetPic]=useState();
    const [confirmpassword,setConfirmpassword]=useState();
    const [loading,setLoading]=useState(false);
    const toast = useToast();
    const navigate = useNavigate();

    const handleClick =() => setShow(!show);

    // const postDetails =(pics) => {
    //   setLoading(true);
    //   if(pic===undefined){
    //     toast({
    //       title: "Please select an Image!",
    //       status:"warning",
    //       duration: 5000,
    //       isClosable: true,
    //       position: "bottom"
    //     });
    //     return;
    //   }

    //   if(pics.type === "image/jpeg" || pics.type ==="image/png"){
    //     const data = new FormData();
    //     data.append("file",pics);
    //     data.append("upload_preset","College-Chat-App");
    //     data.append("cloud_name","dqutnjt6d");
    //     fetch("https://api.cloudinary.com/v1_1/dqutnjt6d/image/upload",{
    //       method:'post',
    //       body:data,
    //     }).then((res)=>res.json())
    //     .then((data)=>{
    //       SetPic(data.url.toString());
    //       setLoading(false);
    //     })
    //     .catch((err) =>{
    //       console.log(err);
    //       setLoading(false);
    //     });
    //   }
    //   else{
    //     toast({
    //       title:"please Select an Image",
    //       status:"warning",
    //       duration: 5000,
    //       isClosable: true,
    //       position:"bottom",
    //     });
    //     setLoading(false);
    //     return;
    //   }
    // };
    const submitHandler = async() => {
      setLoading(true);
      if(!name || !email || !password || !confirmpassword){
        toast({
          title: " Please Fill all the Fields",
          status:"warning",
          duration:5000,
          isClosable:true,
          position:"bottom",
        });
        setLoading(false);
        return;
      }
      if(password !== confirmpassword){
         toast({
          title: " Password do not match",
          status:"warning",
          duration:5000,
          isClosable:true,
          position:"bottom",
        });
        return;
      }

      try{
        const config = {
          header: {
            "Content-type":"application/json",
          },

        };
        const { data } = await axios.post("/api/user",{name,email,password},config);
        toast({
          title: " Registration Successful",
          status:"success",
          duration:5000,
          isClosable:true,
          position:"bottom",
        });
        localStorage.setItem("userInfo",JSON.stringify(data));
        setLoading(false);
        navigate('/chats',{replace: true});
      }
      catch(error) {
         toast({
          title: "Error Occured",
          description:error.response.data.message,
          status:"error",
          duration:5000,
          isClosable:true,
          position:"bottom",
        });
        setLoading(false);
      }
    };

  return (
     <VStack spacing="5px">
        <FormControl id="first-Name" isRequired>
            <FormLabel>Name</FormLabel>
            <Input placeholder='Enter Your Name' onChange={e => setName(e.target.value)}
              />
        </FormControl>
        <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input placeholder='Enter Your email' onChange={e => setEmail(e.target.value)}
              />
        </FormControl>
        <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup> 
            <Input type={show?"text" : "password"} placeholder='Enter Your Password' onChange={e => setPassword(e.target.value)}/>
            <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClick}>
                    {show ? "Hide" : "Show"}
                </Button>
            </InputRightElement>
              </InputGroup>
           
        </FormControl>
        <FormControl id="confirm-password" isRequired>
            <FormLabel>Confirm Password</FormLabel>
            <InputGroup> 
            <Input type={show?"text" : "password"} placeholder='Confirm Password' onChange={e => setConfirmpassword(e.target.value)}/>
            <InputRightElement width="4.5rem">
                <Button h="1.75rem" size="sm" onClick={handleClick}>
                    {show ? "Hide" : "Show"}
                </Button>
            </InputRightElement>
              </InputGroup>
           
        </FormControl>
        
        {/* <FormControl id="pic" isRequired>
            <FormLabel>Upload your picture</FormLabel>
            <Input type="file" p={1.5} accept="image/*" onChange={e => postDetails(e.target.files[0])}
              />
        </FormControl> */}
        <Button colorScheme="green"
        width="100%"
        style={{marginTop: 15}}
        onClick={submitHandler}>
            Sign up

        </Button>
        
    </VStack>
  )
}

export default Signup