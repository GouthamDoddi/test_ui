import React, { useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { IoRemoveCircle } from 'react-icons/io5';
import axios from 'axios';

const AddStudentModal = ({ open, onClose, subjects, effect, setEffect }) => {
  const [studentName, setStudentName] = useState('');
  const [selectedSubjectsAndGrades, setSelectedSubjectsAndGrades] = useState([]);
  const [ selectedSubject, setSelectedSubject ] = useState('Select Subject');

  const handleStudentNameChange = (event) => {
    setStudentName(event.target.value);
  };

  const handleSubjectChange = (event) => {
    const subjectKey = event.target.value;

    const subjectName = subjects.find(s => s._id === subjectKey._id).Subject_name;



    setSelectedSubject(subjectName);

    if (subjectKey) {
      setSelectedSubjectsAndGrades([
        ...selectedSubjectsAndGrades,
        { subjectKey: subjectKey?._id, grade: '' },
      ]);
    }
  };

  const handleGradeChange = (event, index) => {
    const newSelectedSubjectsAndGrades = [...selectedSubjectsAndGrades];
    newSelectedSubjectsAndGrades[index].grade = event.target.value;
    setSelectedSubjectsAndGrades(newSelectedSubjectsAndGrades);
  };

  const handleRemoveSubject = (index) => {
    const newSelectedSubjectsAndGrades = [...selectedSubjectsAndGrades];
    newSelectedSubjectsAndGrades.splice(index, 1);
    setSelectedSubjectsAndGrades(newSelectedSubjectsAndGrades);
  };

  const handleSaveStudent = async () => {
    // Implement logic to save the new student data to the server
    console.log('Student Name:', studentName);
    console.log('Selected Subjects and Grades:', selectedSubjectsAndGrades);

    const subjectKeys = [];
    const grades = [];

    for (let i = 0; i < selectedSubjectsAndGrades.length; i++) {
        subjectKeys.push(selectedSubjectsAndGrades[i].subjectKey);
        grades.push(selectedSubjectsAndGrades[i].grade);
    }

    // api call

    const res = await axios.post(`https://test-api-h83g.onrender.com/add_student`, { name: studentName, subjectKeys, grades })

    if (res.status === 200) {
        // Clear the form after saving
        setStudentName('');
        setSelectedSubjectsAndGrades([]);
        alert('Student added successfully');
        setEffect(!effect)
    }



    // Close the modal
    onClose();
  };

  const subjectSeleted = (subject) => {
    return selectedSubjectsAndGrades.some(s => s.subjectKey === subject._id)
  }
return(
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
  <DialogTitle>Add Student</DialogTitle>
  <DialogContent dividers>
    <TextField
      required
      label="Student Name"
      value={studentName}
      onChange={handleStudentNameChange}
      fullWidth
      margin="normal"
      variant="outlined"
    />
    <FormControl fullWidth margin="normal" variant="outlined">
      <InputLabel id="subject-label">Add Subject</InputLabel>
      <Select
        labelId="subject-label"
        value={selectedSubject}
        onChange={handleSubjectChange}
        label="Add Subject"
        >
        <MenuItem value={selectedSubject} disabled>
            {selectedSubject}
        </MenuItem>
        {subjects.map((subject, index) => {
            return subjectSeleted(subject) ? (
            <MenuItem key={index} disabled value={subject}>
                {subject.Subject_name}
            </MenuItem>
            ) : (
            <MenuItem key={index} value={subject}>
                {subject.Subject_name}
            </MenuItem>
            );
        })}
        </Select>
    </FormControl>
    {selectedSubjectsAndGrades.map((item, index) => (
      <Box key={index} display="flex" alignItems="center" marginTop={1}>
        <Typography variant="body1" marginRight={2}>
          {subjects.find((subject) => subject._id === item.subjectKey)?.Subject_name}
        </Typography>
        <TextField
          label="Grade"
          value={item.grade}
          onChange={(event) => handleGradeChange(event, index)}
          margin="normal"
          variant="outlined"
          style={{ flexGrow: 1, marginRight: '8px' }}
        />
        <IconButton onClick={() => handleRemoveSubject(index)} color="secondary">
          <IoRemoveCircle />
        </IconButton>
      </Box>
    ))}
  </DialogContent>
  <DialogActions>
    <Button onClick={onClose} color="secondary">
      Cancel
    </Button>
    <Button onClick={handleSaveStudent} color="primary" variant="contained">
      Save
    </Button>
  </DialogActions>
</Dialog>
);
};

export default AddStudentModal;