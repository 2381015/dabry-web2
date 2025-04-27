import React, { useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Link,
  Text,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Cookies from 'js-cookie';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Trim inputs to remove any accidental spaces
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    
    if (!trimmedEmail) {
      toast({
        title: 'Error',
        description: 'Email is required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await api.post('/auth/login', { email: trimmedEmail, password: trimmedPassword });
      const { access_token, user } = response.data;
      
      Cookies.set('token', access_token, { expires: 1 }); // 1 day
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      // Store user in localStorage to prevent needing backend validation
      localStorage.setItem('currentUser', JSON.stringify(user));
      
      toast({
        title: 'Login successful',
        description: 'Welcome to the Library Management System',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Force navigation to dashboard with a slight delay to ensure toast is visible
      setTimeout(() => {
        navigate('/dashboard/books', { replace: true });
      }, 500);
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.response?.data?.message || 'Invalid email or password',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box minH="100vh" py={12}>
      <Box mb={8} textAlign="center">
        <Heading as={RouterLink} to="/" size="xl" cursor="pointer">
          Library Application
        </Heading>
        <Text color="blue.500" as={RouterLink} to="/register">
          Register
        </Text>
      </Box>

      <Container maxW="md">
        <Box p={8} borderWidth={1} borderRadius={8} boxShadow="lg">
          <VStack spacing={4} as="form" onSubmit={handleSubmit}>
            <Heading size="lg" textAlign="center">
              Login
            </Heading>
            
            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
            
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>
            
            <Button
              type="submit"
              colorScheme="blue"
              width="full"
              mt={4}
              isLoading={isSubmitting}
            >
              Login
            </Button>
            
            <Text mt={4}>
              Don't have an account?{' '}
              <Link as={RouterLink} to="/register" color="blue.500">
                Register here
              </Link>
            </Text>
          </VStack>
        </Box>
      </Container>
    </Box>
  );
};

export default Login;
