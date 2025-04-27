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
  FormControl,
  FormLabel,
  Input,
  Textarea,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  VStack,
  Divider,
} from '@chakra-ui/react';
import DashboardLayout from '../../components/DashboardLayout';
import api from '../../services/api';

interface Author {
  id: number;
  name: string;
  biography: string;
}

const AuthorsList = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState('');
  const [biography, setBiography] = useState('');
  const [editingAuthorId, setEditingAuthorId] = useState<number | null>(null);
  const [deleteAuthorId, setDeleteAuthorId] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const toast = useToast();
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !biography) {
      toast({
        title: 'Error',
        description: 'Name and biography are required',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const authorData = { name, biography };

    try {
      setIsSubmitting(true);
      if (editingAuthorId) {
        await api.put(`/authors/${editingAuthorId}`, authorData);
        toast({
          title: 'Success',
          description: 'Author updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        await api.post('/authors', authorData);
        toast({
          title: 'Success',
          description: 'Author added successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      resetForm();
      fetchAuthors();
    } catch (error) {
      toast({
        title: 'Error',
        description: editingAuthorId
          ? 'Failed to update author'
          : 'Failed to add author',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (author: Author) => {
    setName(author.name);
    setBiography(author.biography);
    setEditingAuthorId(author.id);
  };

  const handleDelete = async () => {
    if (!deleteAuthorId) return;
    
    try {
      await api.delete(`/authors/${deleteAuthorId}`);
      setAuthors(authors.filter((author) => author.id !== deleteAuthorId));
      toast({
        title: 'Author deleted',
        description: 'The author has been successfully deleted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete author',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsDialogOpen(false);
      setDeleteAuthorId(null);
    }
  };

  const resetForm = () => {
    setName('');
    setBiography('');
    setEditingAuthorId(null);
  };

  return (
    <DashboardLayout activePage="authors">
      <Box mb={6}>
        <Heading size="lg">Author Management</Heading>
      </Box>

      <Box mb={10}>
        <Button colorScheme="blue" onClick={() => window.scrollTo(0, document.body.scrollHeight)}>
          Add Author
        </Button>
        
        <Table variant="simple" mt={4}>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Biography</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {authors.map((author) => (
              <Tr key={author.id}>
                <Td>{author.name}</Td>
                <Td>{author.biography.substring(0, 100)}...</Td>
                <Td>
                  <HStack spacing={2}>
                    <Button
                      size="sm"
                      colorScheme="yellow"
                      onClick={() => handleEdit(author)}
                    >
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() => {
                        setDeleteAuthorId(author.id);
                        setIsDialogOpen(true);
                      }}
                    >
                      Delete
                    </Button>
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      <Divider my={6} />

      <Box>
        <Heading size="md" mb={4}>
          {editingAuthorId ? 'Edit Author' : 'Add Author'}
        </Heading>
        
        <Box maxW="xl">
          <VStack spacing={4} as="form" onSubmit={handleSubmit}>
            <FormControl id="name" isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>
            
            <FormControl id="biography" isRequired>
              <FormLabel>Biography</FormLabel>
              <Textarea
                value={biography}
                onChange={(e) => setBiography(e.target.value)}
                rows={4}
              />
            </FormControl>
            
            <HStack spacing={4} width="full">
              {editingAuthorId && (
                <Button
                  onClick={resetForm}
                  width="full"
                >
                  Cancel
                </Button>
              )}
              
              <Button
                type="submit"
                colorScheme="green"
                width="full"
                isLoading={isSubmitting}
              >
                {editingAuthorId ? 'Save Changes' : 'Save Author'}
              </Button>
            </HStack>
          </VStack>
        </Box>
      </Box>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDialogOpen(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Author
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure? This will also affect books associated with this author.
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

export default AuthorsList;
