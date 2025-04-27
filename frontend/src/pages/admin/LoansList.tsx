import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  useToast,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Badge,
  Select,
  FormControl,
  FormLabel,
  Flex,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface Loan {
  id: number;
  book: {
    id: number;
    title: string;
  };
  user: {
    id: number;
    name: string;
  };
  loan_date: string;
  return_date: string;
  status: string;
}

interface User {
  id: number;
  name: string;
}

const LoansList = () => {
  const [loans, setLoans] = useState<Loan[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedUser, setSelectedUser] = useState('all');
  const [deleteLoanId, setDeleteLoanId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const cancelRef = React.useRef<HTMLButtonElement>(null);
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchLoans();
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchLoans = async () => {
    try {
      setIsLoading(true);
      const url = isAdmin ? '/loans' : `/loans/user/${user?.id}`;
      const response = await api.get(url);
      setLoans(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch loans',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    }
  };

  const handleDelete = async () => {
    if (!deleteLoanId) return;
    
    try {
      await api.delete(`/loans/${deleteLoanId}`);
      setLoans(loans.filter((loan) => loan.id !== deleteLoanId));
      toast({
        title: 'Loan deleted',
        description: 'The loan has been successfully deleted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete loan',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsDialogOpen(false);
      setDeleteLoanId(null);
    }
  };

  const handleStatusChange = async (loanId: number, newStatus: string) => {
    try {
      await api.patch(`/loans/${loanId}/status`, { status: newStatus });
      
      // Update local state
      setLoans(
        loans.map((loan) =>
          loan.id === loanId ? { ...loan, status: newStatus } : loan
        )
      );
      
      toast({
        title: 'Status updated',
        description: `Loan status updated to ${newStatus}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      
      // Refresh loans to update book stock if needed
      fetchLoans();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update loan status',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getStatusBadge = (status: string) => {
    let colorScheme = 'gray';
    switch (status) {
      case 'borrowed':
        colorScheme = 'green';
        break;
      case 'returned':
        colorScheme = 'blue';
        break;
      case 'pending':
        colorScheme = 'yellow';
        break;
      default:
        colorScheme = 'gray';
    }
    return <Badge colorScheme={colorScheme}>{status}</Badge>;
  };

  const applyFilters = () => {
    let filtered = [...loans];
    
    if (selectedStatus !== 'all') {
      filtered = filtered.filter((loan) => loan.status === selectedStatus);
    }
    
    if (selectedUser !== 'all') {
      filtered = filtered.filter((loan) => loan.user.id === parseInt(selectedUser));
    }
    
    return filtered;
  };

  const filteredLoans = applyFilters();

  return (
    <DashboardLayout activePage="loans">
      <Box mb={6}>
        <HStack justifyContent="space-between">
          <Heading size="lg">Loan Management</Heading>
          <Button colorScheme="blue" onClick={() => navigate('/dashboard/loans/add')}>
            Add Loan
          </Button>
        </HStack>
      </Box>

      {isAdmin && (
        <Box mb={6} p={4} bg="gray.50" borderRadius="md">
          <Flex direction={{ base: 'column', md: 'row' }} gap={4}>
            <FormControl>
              <FormLabel>Filter by Status</FormLabel>
              <Select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="borrowed">Borrowed</option>
                <option value="returned">Returned</option>
              </Select>
            </FormControl>
            
            <FormControl>
              <FormLabel>Filter by User</FormLabel>
              <Select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
              >
                <option value="all">All Users</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Flex>
        </Box>
      )}

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Book</Th>
            <Th>User</Th>
            <Th>Loan Date</Th>
            <Th>Return Date</Th>
            <Th>Status</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {filteredLoans.map((loan) => (
            <Tr key={loan.id}>
              <Td>{loan.book.title}</Td>
              <Td>{loan.user.name}</Td>
              <Td>{new Date(loan.loan_date).toLocaleDateString()}</Td>
              <Td>{new Date(loan.return_date).toLocaleDateString()}</Td>
              <Td>{getStatusBadge(loan.status)}</Td>
              <Td>
                <HStack spacing={2}>
                  {isAdmin && loan.status === 'pending' && (
                    <Button
                      size="sm"
                      colorScheme="green"
                      onClick={() => handleStatusChange(loan.id, 'borrowed')}
                    >
                      Accept
                    </Button>
                  )}
                  
                  {loan.status === 'borrowed' && (
                    <Button
                      size="sm"
                      colorScheme="blue"
                      onClick={() => handleStatusChange(loan.id, 'returned')}
                    >
                      Return
                    </Button>
                  )}
                  
                  {isAdmin && (
                    <>
                      <Button
                        size="sm"
                        colorScheme="yellow"
                        onClick={() => navigate(`/dashboard/loans/edit/${loan.id}`)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="red"
                        onClick={() => {
                          setDeleteLoanId(loan.id);
                          setIsDialogOpen(true);
                        }}
                      >
                        Delete
                      </Button>
                    </>
                  )}
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Loan
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? You can't undo this action afterwards.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={handleDelete} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </DashboardLayout>
  );
};

export default LoansList;
