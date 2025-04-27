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
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';

interface Book {
  id: number;
  title: string;
  author: {
    id: number;
    name: string;
  };
  publication_year: number;
  stock_quantity: number;
}

const BooksList = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteBookId, setDeleteBookId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/books');
      setBooks(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch books',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/dashboard/books/edit/${id}`);
  };

  const handleDelete = async () => {
    if (!deleteBookId) return;
    
    try {
      await api.delete(`/books/${deleteBookId}`);
      setBooks(books.filter((book) => book.id !== deleteBookId));
      toast({
        title: 'Book deleted',
        description: 'The book has been successfully deleted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete book',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsDialogOpen(false);
      setDeleteBookId(null);
    }
  };

  const handleBorrow = async (bookId: number) => {
    try {
      await api.post('/loans', {
        book_id: bookId,
        user_id: user?.id,
        loan_date: new Date().toISOString().split('T')[0],
        return_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      });
      
      // Refresh book list to update stock
      fetchBooks();
      
      toast({
        title: 'Book borrowed',
        description: 'Your loan request has been submitted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to borrow book',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <DashboardLayout activePage="books">
      <Box mb={6}>
        <HStack justifyContent="space-between">
          <Heading size="lg">Book List</Heading>
          {user?.role === 'admin' && (
            <Button colorScheme="blue" onClick={() => navigate('/dashboard/books/add')}>
              Add Book
            </Button>
          )}
        </HStack>
      </Box>

      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Title</Th>
            <Th>Author</Th>
            <Th>Year</Th>
            <Th>Stock</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {books.map((book) => (
            <Tr key={book.id}>
              <Td>{book.title}</Td>
              <Td>{book.author.name}</Td>
              <Td>{book.publication_year}</Td>
              <Td>{book.stock_quantity}</Td>
              <Td>
                <HStack spacing={2}>
                  <Button
                    size="sm"
                    colorScheme="blue"
                    isDisabled={book.stock_quantity <= 0}
                    onClick={() => handleBorrow(book.id)}
                  >
                    Borrow
                  </Button>
                  
                  {user?.role === 'admin' && (
                    <>
                      <Button
                        size="sm"
                        colorScheme="yellow"
                        onClick={() => handleEdit(book.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        colorScheme="red"
                        onClick={() => {
                          setDeleteBookId(book.id);
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
              Delete Book
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

export default BooksList;
