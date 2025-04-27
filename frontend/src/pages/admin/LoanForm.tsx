import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Select,
  VStack,
  useToast,
  Input,
  HStack,
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface Book {
  id: number;
  title: string;
  stock_quantity: number;
}

interface User {
  id: number;
  name: string;
}

const LoanForm = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedBookId, setSelectedBookId] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [loanDate, setLoanDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { id } = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  
  const isEditMode = !!id;
  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    fetchBooks();
    if (isAdmin) {
      fetchUsers();
    } else {
      setSelectedUserId(user?.id?.toString() || '');
    }
    
    if (isEditMode) {
      fetchLoan();
    } else {
      // Set default date values
      const today = new Date();
      setLoanDate(today.toISOString().split('T')[0]);
      
      const twoWeeksLater = new Date();
      twoWeeksLater.setDate(today.getDate() + 14);
      setReturnDate(twoWeeksLater.toISOString().split('T')[0]);
    }
  }, [id, isAdmin, user]);

  const fetchBooks = async () => {
    try {
      const response = await api.get('/books');
      // Filter out books with zero stock when not in edit mode
      const availableBooks = isEditMode 
        ? response.data 
        : response.data.filter((book: Book) => book.stock_quantity > 0);
      setBooks(availableBooks);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch books',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const fetchLoan = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/loans/${id}`);
      const loan = response.data;
      
      setSelectedBookId(loan.book.id.toString());
      setSelectedUserId(loan.user.id.toString());
      setLoanDate(new Date(loan.loan_date).toISOString().split('T')[0]);
      setReturnDate(new Date(loan.return_date).toISOString().split('T')[0]);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch loan details',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedBookId || !selectedUserId || !loanDate || !returnDate) {
      toast({
        title: 'Error',
        description: 'All fields are required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const loanData = {
      book_id: parseInt(selectedBookId),
      user_id: parseInt(selectedUserId),
      loan_date: loanDate,
      return_date: returnDate,
    };

    try {
      setIsSubmitting(true);
      if (isEditMode) {
        await api.put(`/loans/${id}`, loanData);
        toast({
          title: 'Loan updated',
          description: 'The loan has been successfully updated',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await api.post('/loans', loanData);
        toast({
          title: 'Loan created',
          description: 'The loan has been successfully created',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      navigate('/dashboard/loans');
    } catch (error) {
      toast({
        title: 'Error',
        description: isEditMode
          ? 'Failed to update loan'
          : 'Failed to create loan',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout activePage="loans">
      <Box mb={6}>
        <Heading size="lg">{isEditMode ? 'Edit Loan' : 'Add Loan'}</Heading>
      </Box>

      <Box>
        <Button mb={6} onClick={() => navigate('/dashboard/loans')}>
          Back
        </Button>

        <Box maxW="xl">
          <VStack spacing={4} as="form" onSubmit={handleSubmit}>
            <FormControl id="book" isRequired>
              <FormLabel>Book</FormLabel>
              <Select
                placeholder="Select book"
                value={selectedBookId}
                onChange={(e) => setSelectedBookId(e.target.value)}
              >
                {books.map((book) => (
                  <option key={book.id} value={book.id}>
                    {book.title} {book.stock_quantity === 0 && '(Out of stock)'}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl id="user" isRequired>
              <FormLabel>User</FormLabel>
              <Select
                placeholder="Select user"
                value={selectedUserId}
                onChange={(e) => setSelectedUserId(e.target.value)}
                isDisabled={!isAdmin}
              >
                {isAdmin ? (
                  users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))
                ) : (
                  <option value={user?.id}>{user?.name}</option>
                )}
              </Select>
            </FormControl>

            <FormControl id="loanDate" isRequired>
              <FormLabel>Loan Date</FormLabel>
              <Input
                type="date"
                value={loanDate}
                onChange={(e) => setLoanDate(e.target.value)}
              />
            </FormControl>

            <FormControl id="returnDate" isRequired>
              <FormLabel>Return Date</FormLabel>
              <Input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="green"
              width="full"
              mt={4}
              isLoading={isSubmitting}
            >
              Save
            </Button>
          </VStack>
        </Box>
      </Box>
    </DashboardLayout>
  );
};

export default LoanForm;
