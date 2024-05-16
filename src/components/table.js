// App.js
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  IconButton,
} from '@material-ui/core';
import { Edit as EditIcon, KeyboardArrowDown as ExpandIcon, KeyboardArrowUp as CollapseIcon } from '@material-ui/icons';
import axios from 'axios';

const App = () => {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValue, setFilterValue] = useState('all');
  const [editingStudent, setEditingStudent] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const studentsResponse = await axios.get('/students');
      const subjectsResponse = await axios.get('/subjects');
      setStudents(studentsResponse.data);
      setSubjects(subjectsResponse.data);
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

  const filteredStudents = students.filter((student) => {
    if (filterValue === 'all') {
      return student.Student_name.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (filterValue === 'pass') {
      return student.Remarks.some((remark) => remark === 'PASS') && student.Student_name.toLowerCase().includes(searchTerm.toLowerCase());
    } else if (filterValue === 'fail') {
      return student.Remarks.some((remark) => remark === 'FAIL') && student.Student_name.toLowerCase().includes(searchTerm.toLowerCase());
    }
    return false;
  });

  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Student Grades
      </Typography>
      <TextField label="Search Student" value={searchTerm} onChange={handleSearch} fullWidth margin="normal" />
      <FormControl fullWidth margin="normal">
        <InputLabel id="filter-label">Filter</InputLabel>
        <Select labelId="filter-label" value={filterValue} onChange={handleFilterChange}>
          <MenuItem value="all">All Students</MenuItem>
          <MenuItem value="pass">PASS Remarks</MenuItem>
          <MenuItem value="fail">FAIL Remarks</MenuItem>
        </Select>
      </FormControl>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Student Name</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents.map((student) => (
              <StudentRow
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
    </Container>
  );
};

const StudentRow = ({ student, subjects, onEdit, editing }) => {
  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleEditClick = () => {
    onEdit(student);
  };

  return (
    <>
      <TableRow>
        <TableCell>
          <IconButton onClick={handleExpandClick}>
            {expanded ? <CollapseIcon /> : <ExpandIcon />}
          </IconButton>
        </TableCell>
        <TableCell>{student.Student_name}</TableCell>
        <TableCell>
          <IconButton onClick={handleEditClick}>
            <EditIcon />
          </IconButton>
        </TableCell>
      </TableRow>
      {expanded && (
        <TableRow>
          <TableCell colSpan={3}>
            <Box>
              {student.Subject_keys.map((subjectKey, index) => (
                <div key={subjectKey}>
                  <Typography variant="subtitle1">
                    Subject: {subjects.find((subject) => subject.key === subjectKey)?.name}
                  </Typography>
                  <Typography variant="body1">Grade: {student.Grade[index]}</Typography>
                  <Typography variant="body1">Remarks: {student.Remarks[index]}</Typography>
                  {editing && (
                    <div>
                      {/* Add edit fields for subject, grade, and remarks */}
                      <Button>Save Changes</Button>
                    </div>
                  )}
                </div>
              ))}
            </Box>
          </TableCell>
        </TableRow>
      )}
    </>
  );
};

export default App;