const express = require('express');
const router = express.Router();
const {
  getIncidents,
  getResources,
  getEvents,
  createIncident,
  updateIncidentPriority,
  updateResourceStatus,
  dispatchUnit,
  recallUnit
} = require('../controllers/resqaiController');

// Middleware to log requests to the router
router.use((req, res, next) => {
  console.log(`Router received: ${req.method} ${req.url}`);
  next();
});

router.get('/incidents', getIncidents);
router.get('/resources', getResources);
router.get('/events', getEvents);
router.post('/incidents', createIncident);
router.put('/incidents/:id/priority', updateIncidentPriority);
router.put('/resources/:id/status', updateResourceStatus);
router.post('/incidents/:incidentId/dispatch/:resourceId', dispatchUnit);
router.post('/incidents/:incidentId/recall/:resourceId', recallUnit);

module.exports = router;
