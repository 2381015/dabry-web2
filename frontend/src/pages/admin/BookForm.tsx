import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Select,
  VStack,
  useToast,
  HStack,
  NumberInput,
  NumberInputField,
} from '@chakra-ui/react';
import { useNavigate, useParams } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';

interface Author {
  id: number;
  name: string;
}

const BookForm = () => {
  const [title, setTitle] = useState('');
  const [authorId, setAuthorId] = useState('');
  const [publicationYear, setPublicationYear] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [authors, setAuthors] = useState<Author[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { id } = useParams();
  const toast = useToast();
  const navigate = useNavigate();
  const isEditMode = !!id;

  useEffect(() => {
    fetchAuthors();
    if (isEditMode) {
      fetchBook();
    }
  }, [id]);

  const fetchAuthors = async () => {
    try {
      const response = await api.get('/authors');
      setAuthors(response.data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch authors',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const fetchBook = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/books/${id}`);
      const book = response.data;
      setTitle(book.title);
      setAuthorId(book.author.id.toString());
      setPublicationYear(book.publication_year.toString());
      setStockQuantity(book.stock_quantity.toString());
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch book details',
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

    if (!title || !authorId || !publicationYear || !stockQuantity) {
      toast({
        title: 'Error',
        description: 'All fields are required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const bookData = {
      title,
      author_id: parseInt(authorId),
      publication_year: parseInt(publicationYear),
      stock_quantity: parseInt(stockQuantity),
    };

    try {
      setIsSubmitting(true);
      if (isEditMode) {
        await api.put(`/books/${id}`, bookData);
        toast({
          title: 'Book updated',
          description: 'The book has been successfully updated',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await api.post('/books', bookData);
        toast({
          title: 'Book added',
          description: 'The book has been successfully added',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      navigate('/dashboard/books');
    } catch (error) {
      toast({
        title: 'Error',
        description: isEditMode
          ? 'Failed to update book'
          : 'Failed to add book',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout activePage="books">
      <Box mb={6}>
        <Heading size="lg">{isEditMode ? 'Edit Book' : 'Add Book'}</Heading>
      </Box>

      <Box>
        <Button mb={6} onClick={() => navigate('/dashboard/books')}>
          Back
        </Button>

        <Box maxW="xl">
          <VStack spacing={4} as="form" onSubmit={handleSubmit}>
            <FormControl id="title" isRequired>
              <FormLabel>Title</FormLabel>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </FormControl>

            <FormControl id="author" isRequired>
              <FormLabel>Author</FormLabel>
              <Select
                placeholder="Select author"
                value={authorId}
                onChange={(e) => setAuthorId(e.target.value)}
              >
                {authors.map((author) => (
                  <option key={author.id} value={author.id}>
                    {author.name}
                  </option>
                ))}
              </Select>
            </FormControl>

            <FormControl id="year" isRequired>
              <FormLabel>Publication Year</FormLabel>
              <NumberInput min={1000} max={new Date().getFullYear()}>
                <NumberInputField
                  value={publicationYear}
                  onChange={(e) => setPublicationYear(e.target.value)}
                />
              </NumberInput>
            </FormControl>

            <FormControl id="stock" isRequired>
              <FormLabel>Stock Quantity</FormLabel>
              <NumberInput min={0}>
                <NumberInputField
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                />
              </NumberInput>
            </FormControl>

            <Button
              type="submit"
              colorScheme="green"
              width="full"
              mt={4}
              isLoading={isSubmitting}
            >
              Save Book
            </Button>
          </VStack>
        </Box>
      </Box>
    </DashboardLayout>
  );
};

export default BookForm;
