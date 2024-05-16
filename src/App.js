import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Button,
  Pagination,
  IconButton,
} from '@mui/material';
import { CgAdd } from 'react-icons/cg';
import AddStudentModal from './components/AddStudent';
import AddSubjectModal from './components/AddSubjects';
import { BiCollapse, BiExpand } from 'react-icons/bi';
import { ImBin, ImPencil } from 'react-icons/im';
import EditStudentModal from './components/EditStudent';

console.log(process.env.REACT_APP_url)

const App = () => {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValue, setFilterValue] = useState('all');
  const [editingStudent, setEditingStudent] = useState(null);
  const [currentItems, setCurrentItems] = useState([]);
  const [effect, setEffect] = useState(false);
  const [openAddStudentModal, setOpenAddStudentModal] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [openAddSubjectModal, setOpenAddSubjectModal] = useState(false);
  const rowsPerPage = 4;

  useEffect(() => {
    fetchData();
  }, [effect]);

  useEffect(() => {
    const indexOfLastItem = currentPage * rowsPerPage;
    const indexOfFirstItem = indexOfLastItem - rowsPerPage;
    setCurrentItems(filteredStudents.slice(indexOfFirstItem, indexOfLastItem));
  }, [students, currentPage, filterValue, searchTerm]);

  const handleOpenAddSubjectModal = () => {
    setOpenAddSubjectModal(true);
  };

  const handleCloseAddSubjectModal = () => {
    setOpenAddSubjectModal(false);
  };

  const handleOpenAddStudentModal = () => {
    setOpenAddStudentModal(true);
  };

  const handleCloseAddStudentModal = () => {
    setOpenAddStudentModal(false);
  };

  const handleAddSubject = async (data) => {
    const res = await axios.post(`https://test-api-h83g.onrender.com/add_subject`, { subjectName: data.name });
    if (res.status === 200) {
      fetchData();
      alert('Subject added successfully');
    }
  };

  const fetchData = async () => {
    try {
      const studentsResponse = await axios.get(`https://test-api-h83g.onrender.com/get_students`);
      const subjectsResponse = await axios.get(`https://test-api-h83g.onrender.com/get_subjects`);
      setStudents(studentsResponse.data.result);
      setSubjects(subjectsResponse.data.result);

      // Calculate the total number of pages
      const totalStudents = studentsResponse.data.result.length;
      const calculatedTotalPages = Math.ceil(totalStudents / rowsPerPage);
      setTotalPages(calculatedTotalPages);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilterValue(event.target.value);
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const filteredStudents = students.filter((student) => {
    const nameMatches = student.Student_name?.toLowerCase().includes(searchTerm?.toLowerCase());
    if (filterValue === 'all') {
      return nameMatches;
    } else if (filterValue === 'pass') {
      return student.Overall_remark === 'PASS' && nameMatches;
    } else if (filterValue === 'fail') {
      return student.Overall_remark === 'FAIL' && nameMatches;
    }
    return false;
  });

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom align="center" color="primary">
        Student Grades
      </Typography>
      <TextField
        label="Search Student"
        value={searchTerm}
        onChange={handleSearch}
        fullWidth
        margin="normal"
        variant="outlined"
      />
      <FormControl fullWidth margin="normal" variant="outlined">
        <InputLabel id="filter-label">Filter</InputLabel>
        <Select labelId="filter-label" value={filterValue} onChange={handleFilterChange} label="Filter">
          <MenuItem value="all">All Students</MenuItem>
          <MenuItem value="pass">PASS Remarks</MenuItem>
          <MenuItem value="fail">FAIL Remarks</MenuItem>
        </Select>
      </FormControl>
      <TableContainer component={Paper} elevation={3} style={{ marginTop: '20px', padding: '10px' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Student Name</TableCell>
              <TableCell>Remark</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentItems.map((student) => (
              <StudentRow
                setEffect={setEffect}
                effect={effect}
                key={student._id}
                student={student}
                subjects={subjects}
                onEdit={handleEditStudent}
                editing={editingStudent === student}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box display="flex" justifyContent="center" marginTop={2}>
        <Pagination
          count={totalPages}
          page={currentPage}
          onChange={handlePageChange}
          color="primary"
          shape="rounded"
        />
      </Box>
      <Box display="flex" justifyContent="space-between" marginTop={2}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<CgAdd />}
          onClick={handleOpenAddStudentModal}
        >
          Add Student
        </Button>
        <AddStudentModal
          open={openAddStudentModal}
          onClose={handleCloseAddStudentModal}
          subjects={subjects}
          effect={effect}
          setEffect={setEffect}
        />
        <Button
          variant="contained"
          color="secondary"
          startIcon={<CgAdd />}
          onClick={handleOpenAddSubjectModal}
        >
          Add Subject
        </Button>
        <AddSubjectModal
          open={openAddSubjectModal}
          onClose={handleCloseAddSubjectModal}
          onAddSubject={handleAddSubject}
        />
      </Box>
    </Container>
  );
};

const StudentRow = ({ student, subjects, onEdit, editing, setEffect, effect }) => {
  const [expanded, setExpanded] = useState(false);
  const [ openEditModal, setOpenEditModal ] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleEditClick = () => {
    onEdit(student);
    setOpenEditModal(true);
  };

  const handleDeleteClick = async () => {
    const res = await axios.post(`https://test-api-h83g.onrender.com/delete_student`, { id: student._id })

    if (res.status === 200) {
      setEffect(!effect)
      alert('Student deleted successfully');
    }
  }

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };

  const handleSaveStudent = async (editedStudent) => {
    // Implement logic to save the edited student data to the server
    console.log('Edited Student:', editedStudent);

    // Update the student data in the state
    const res = await axios.post(`https://test-api-h83g.onrender.com/update_student`, editedStudent);

    if (res.status === 200) {
      setEffect(!effect)
      alert('Student updated successfully');
    }
  };

  return (
<>
      <TableRow>
        <TableCell>
          <IconButton onClick={handleExpandClick}>
            {expanded ? <BiCollapse /> : <BiExpand />}
          </IconButton>
        </TableCell>
        <TableCell>{student.Student_name}</TableCell>
        <TableCell>{student.Overall_remark}</TableCell>
        <TableCell>
          <IconButton onClick={handleEditClick}>
            <ImPencil />
          </IconButton>
          <IconButton onClick={handleDeleteClick}>
            <ImBin />
          </IconButton>
        </TableCell>
      </TableRow>
      {expanded && (
        <TableRow>
          <TableCell colSpan={4}>
            <Box padding={2} bgcolor="#f9f9f9" borderRadius="8px">
              <div style={{ display: 'flex', flexDirection: 'row', overflowX: 'auto', justifyContent: 'space-evenly' }}>
                {student.Subject_key.map((subjectKey, index) => (
                  <Box key={subjectKey} margin={1} padding={1} border="1px solid #ddd" borderRadius="4px" bgcolor="#fff">
                    <Typography variant="subtitle1" fontWeight="bold">
                      {subjects.find((subject) => subject._id === subjectKey)?.Subject_name}
                    </Typography>
                    <Typography variant="body2">Grade: {student.Grade[index]}</Typography>
                    <Typography variant="body2">Remarks: {student.Remarks[index]}</Typography>
                  </Box>
                ))}
              </div>
            </Box>
          </TableCell>
        </TableRow>
      )}
      <EditStudentModal
        effect={effect}
        setEffect={setEffect}
        open={openEditModal}
        onClose={handleCloseEditModal}
        student={student}
        subjects={subjects}
        onSave={handleSaveStudent}
      />
    </>
  );
};

export default App;
