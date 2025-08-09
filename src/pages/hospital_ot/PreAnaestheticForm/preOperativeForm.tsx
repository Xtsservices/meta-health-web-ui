import React, { useState } from "react";
import { TextField, Container, Grid } from "@mui/material";
import { PreAnaestheticData } from "./preAnaestheticForm";

function PreoperativeInstructionsForm() {
  const [instructions, setInstructions] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInstructions(e.target.value);
    PreAnaestheticData.instructions = e.target.value;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission, for example, send data to backend
    // You can also add additional logic here, such as displaying a confirmation message
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={6}
              label="Preoperative Instructions"
              variant="outlined"
              value={instructions}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}

export default PreoperativeInstructionsForm;
