import React from 'react';
import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  Button, 
  Flex, 
  SimpleGrid,
  HStack
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Box>
      {/* Header */}
      <Box bg="blue.500" color="white" py={4} px={8}>
        <Flex justify="space-between" align="center">
          <Heading size="md">Library Application</Heading>
          <HStack spacing={4}>
            {isAuthenticated ? (
              <Button 
                as={RouterLink} 
                to="/dashboard/books" 
                colorScheme="blue" 
                variant="outline"
                _hover={{ bg: 'blue.400' }}
              >
                Dashboard
              </Button>
            ) : (
              <>
                <Button 
                  as={RouterLink} 
                  to="/login" 
                  colorScheme="blue" 
                  variant="outline"
                  _hover={{ bg: 'blue.400' }}
                >
                  Login
                </Button>
                <Button 
                  as={RouterLink} 
                  to="/register" 
                  colorScheme="blue" 
                  variant="solid"
                  bg="blue.100"
                  color="blue.800"
                  _hover={{ bg: 'blue.200' }}
                >
                  Register
                </Button>
              </>
            )}
          </HStack>
        </Flex>
      </Box>

      {/* Hero Section */}
      <Container maxW="container.xl" py={20}>
        <Box textAlign="center" mb={16}>
          <Heading size="2xl" mb={4}>Welcome to Library Application</Heading>
          <Text fontSize="xl" color="gray.600">
            A modern library management system for seamless book lending and tracking
          </Text>
        </Box>

        {/* Features */}
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} mb={16}>
          <Box p={6} boxShadow="md" borderRadius="md" bg="white">
            <Heading size="md" mb={2}>User Management</Heading>
            <Text color="gray.600">
              Easily manage user accounts with role-based access controls for admins and regular users.
            </Text>
          </Box>
          
          <Box p={6} boxShadow="md" borderRadius="md" bg="white">
            <Heading size="md" mb={2}>Book Management</Heading>
            <Text color="gray.600">
              Maintain a comprehensive catalog of books with detailed information on authors and availability.
            </Text>
          </Box>
          
          <Box p={6} boxShadow="md" borderRadius="md" bg="white">
            <Heading size="md" mb={2}>Loan Management</Heading>
            <Text color="gray.600">
              Track all book loans, manage return dates, and monitor the status of each transaction.
            </Text>
          </Box>
        </SimpleGrid>

        <Box textAlign="center">
          <Heading size="lg" mb={4}>Built with Modern Technologies</Heading>
          <Text mb={6}>
            Our application leverages React.js for the frontend and NestJS for the backend, 
            providing a fast, secure, and scalable solution for library management needs.
          </Text>
          <Button 
            as={RouterLink} 
            to="/register" 
            size="lg" 
            colorScheme="blue"
          >
            Get Started
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage;
