import React, { useState, useEffect } from 'react';
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

const EditStudentModal = ({ open, onClose, student, subjects, onSave, effect, setEffect }) => {
  const [editedStudent, setEditedStudent] = useState({
    name: '',
    selectedSubjectsAndGrades: [],
  });

  const [ selectedSubject, setSelectedSubject] = useState('Select a subject');

  useEffect(() => {
    if (student) {
      setEditedStudent({
        name: student.Student_name,
        selectedSubjectsAndGrades: student.Subject_key.map((subjectKey, index) => ({
          subjectKey,
          grade: student.Grade[index],
        })),
      });
    }
  }, [student]);

  const handleStudentNameChange = (event) => {
    setEditedStudent((prevStudent) => ({
      ...prevStudent,
      name: event.target.value,
    }));
  };

  const handleSubjectChange = (event) => {
    const subjectKey = event.target.value;
    setSelectedSubject(subjectKey.Subject_name);

    if (subjectKey) {
      setEditedStudent((prevStudent) => ({
        ...prevStudent,
        selectedSubjectsAndGrades: [
          ...prevStudent.selectedSubjectsAndGrades,
          { subjectKey: subjectKey._id, grade: '' },
        ],
      }));
    }
  };

  const handleGradeChange = (event, index) => {
    const newSelectedSubjectsAndGrades = [...editedStudent.selectedSubjectsAndGrades];
    newSelectedSubjectsAndGrades[index].grade = event.target.value;
    setEditedStudent((prevStudent) => ({
      ...prevStudent,
      selectedSubjectsAndGrades: newSelectedSubjectsAndGrades,
    }));
  };

  const handleRemoveSubject = (index) => {
    const newSelectedSubjectsAndGrades = [...editedStudent.selectedSubjectsAndGrades];
    newSelectedSubjectsAndGrades.splice(index, 1);
    setEditedStudent((prevStudent) => ({
      ...prevStudent,
      selectedSubjectsAndGrades: newSelectedSubjectsAndGrades,
    }));
  };

  const handleSaveStudent = async () => {
    // Implement logic to save the edited student data to the server
    console.log('Edited Student Name:', editedStudent.name);
    console.log('Edited Selected Subjects and Grades:', editedStudent.selectedSubjectsAndGrades);

    const subjectKeys = [];
    const grades = [];

    for (let i = 0; i < editedStudent.selectedSubjectsAndGrades.length; i++) {
      subjectKeys.push(editedStudent.selectedSubjectsAndGrades[i].subjectKey);
      grades.push(editedStudent.selectedSubjectsAndGrades[i].grade);
    }

    // api call

    const res = await axios.post(`https://test-api-h83g.onrender.com/update_student`, {
      name: editedStudent.name,
      subjectKeys,
      grades,
      id: student._id
    });

    if (res.status === 200) {
      // Clear the form after saving
      setEditedStudent({
        name: '',
        selectedSubjectsAndGrades: [],
      });
      alert('Student edited successfully');
      setEffect(!effect)
      onSave(); // Inform the parent component about the edit
    }

    // Close the modal
    onClose();
  };

  const subjectSeleted = (subject) => {
    return editedStudent.selectedSubjectsAndGrades.some(s => s.subjectKey === subject._id)
  }
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Edit Student</DialogTitle>
      <DialogContent dividers>
        <TextField
          required
          label="Student Name"
          value={editedStudent.name}
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
        {editedStudent.selectedSubjectsAndGrades.map((item, index) => (
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

export default EditStudentModal;
