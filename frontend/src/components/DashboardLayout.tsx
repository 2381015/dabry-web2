import React, { ReactNode } from 'react';
import {
  Box,
  Flex,
  Text,
  Button,
  Stack,
  useColorModeValue,
  Heading,
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface NavItemProps {
  children: ReactNode;
  to: string;
  isActive: boolean;
}

const NavItem = ({ children, to, isActive }: NavItemProps) => {
  return (
    <Box
      as={Link}
      to={to}
      p={3}
      borderRadius="md"
      transition="all 0.2s"
      fontWeight="medium"
      color={isActive ? 'white' : 'gray.600'}
      bg={isActive ? 'blue.600' : 'transparent'}
      _hover={!isActive ? { bg: 'blue.50', color: 'blue.500' } : {}}
      w="full"
    >
      {children}
    </Box>
  );
};

interface DashboardLayoutProps {
  children: ReactNode;
  activePage: string;
}

const DashboardLayout = ({ children, activePage }: DashboardLayoutProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Flex direction={{ base: 'column', md: 'row' }} h="100vh">
      {/* Sidebar */}
      <Box
        w={{ base: 'full', md: '200px' }}
        bg={useColorModeValue('blue.50', 'gray.900')}
        borderRight="1px"
        borderRightColor={useColorModeValue('gray.200', 'gray.700')}
      >
        <Stack spacing={1} p={4}>
          <Heading size="md" mb={4}>
            Dashboard
          </Heading>
          <NavItem to="/dashboard/books" isActive={activePage === 'books'}>
            Books
          </NavItem>
          {user?.role === 'admin' && (
            <>
              <NavItem to="/dashboard/users" isActive={activePage === 'users'}>
                Users
              </NavItem>
              <NavItem to="/dashboard/authors" isActive={activePage === 'authors'}>
                Authors
              </NavItem>
            </>
          )}
          <NavItem to="/dashboard/loans" isActive={activePage === 'loans'}>
            Loans
          </NavItem>
        </Stack>
      </Box>

      {/* Main Content */}
      <Box flex="1" overflow="auto">
        {/* Header */}
        <Box
          bg={useColorModeValue('blue.500', 'gray.800')}
          px={4}
          py={3}
          color="white"
        >
          <Flex justify="space-between" align="center">
            <Heading size="md">Library Application</Heading>
            <Flex align="center">
              {user && (
                <Text mr={4} fontSize="sm">
                  {user.role === 'admin' ? 'Admin' : 'User'}
                </Text>
              )}
              <Button size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </Flex>
          </Flex>
        </Box>

        {/* Page Content */}
        <Box p={6}>{children}</Box>
      </Box>
    </Flex>
  );
};

export default DashboardLayout;
