import express = require('express');
import diagnosisService from '../services/diagnosisService';

const router = express.Router();

router.get('/', (_, response) => {
  response.send(diagnosisService.getDiagonses());
});

export default router;