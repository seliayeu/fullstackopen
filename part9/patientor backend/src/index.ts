import express = require('express');
import cors = require('cors');
import diagnosisRouter from './routes/diagnoses';
import patientRouter from './routes/patients';

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3001;

app.get("/api/ping", (_, response) => {
  response.send("pong");
});

app.use('/api/diagnoses/', diagnosisRouter);
app.use('/api/patients/', patientRouter);

app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
}); 