import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useState } from "react";

const AddSubjectModal = ({ open, onClose, onAddSubject }) => {
    const [subjectName, setSubjectName] = useState('');
  
    const handleSubjectNameChange = (event) => {
      setSubjectName(event.target.value);
    };
  
    const handleSaveSubject = () => {
      // Implement logic to save the new subject data to the server
      console.log('Subject Name:', subjectName);
  
      // Call the onAddSubject callback with the new subject data
      onAddSubject({ name: subjectName });
  
      // Clear the form after saving
      setSubjectName('');
  
      // Close the modal
      onClose();
    };
  
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add Subject</DialogTitle>
        <DialogContent>
          <TextField
            label="Subject Name"
            value={subjectName}
            onChange={handleSubjectNameChange}
            fullWidth
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSaveSubject} color="primary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  export default AddSubjectModal;