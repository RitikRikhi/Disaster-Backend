const Incident = require('../models/incident');
const Resource = require('../models/resource');
const Event = require('../models/event');

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

exports.getIncidents = async (req, res) => {
  await delay(500);
  try {
    const incidents = await Incident.find({});
    const incidentsObj = {};
    incidents.forEach(inc => {
      incidentsObj[inc.id] = {
        id: inc.id,
        title: inc.title,
        location: inc.location,
        position: inc.position,
        priority: inc.priority,
        assignedUnits: inc.assignedUnits,
        aiRecommendation: inc.aiRecommendation,
        log: inc.log
      };
    });
    res.json(incidentsObj);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getResources = async (req, res) => {
  await delay(500);
  try {
    const resources = await Resource.find({});
    // Simulate resource movement
    resources.forEach(r => {
      if (r.status !== 'On Scene') {
        r.position = [r.position[0] + (Math.random() - 0.5) * 0.001, r.position[1] + (Math.random() - 0.5) * 0.001];
      }
    });
    res.json(resources);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getEvents = async (req, res) => {
  await delay(500);
  try {
    const events = await Event.find({}).sort({ createdAt: -1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createIncident = async (req, res) => {
  await delay(500);
  try {
    const incidentData = {
      title: req.body.title || 'Untitled Incident',
      location: req.body.location || 'Unknown Location',
      position: req.body.position || [0, 0],
      priority: req.body.priority || 'LOW',
      aiRecommendation: req.body.aiRecommendation || ''
    };
    const newId = `INC-${Math.floor(Math.random() * 9000) + 1000}`;
    const newIncident = new Incident({
      id: newId,
      ...incidentData,
      assignedUnits: [],
      log: [`${new Date().toLocaleTimeString('en-GB')} - Incident created`],
    });
    await newIncident.save();
    const newEvent = new Event({
      id: `evt-${Date.now()}`,
      time: new Date().toLocaleTimeString('en-GB'),
      text: `New incident created: ${incidentData.title}`,
      type: 'critical',
      incidentId: newId,
    });
    await newEvent.save();
    res.json({ success: true, newEvent, newIncident });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateIncidentPriority = async (req, res) => {
  await delay(500);
  try {
    const { id } = req.params;
    const { priority } = req.body;
    const incident = await Incident.findOneAndUpdate({ id }, { priority }, { new: true });
    if (!incident) {
      return res.status(404).json({ error: 'Incident not found' });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateResourceStatus = async (req, res) => {
  await delay(500);
  try {
    const { id } = req.params;
    const { status } = req.body;
    const resource = await Resource.findOneAndUpdate({ id }, { status }, { new: true });
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.dispatchUnit = async (req, res) => {
  await delay(500);
  try {
    const { incidentId, resourceId } = req.params;
    const resource = await Resource.findOne({ id: resourceId });
    const incident = await Incident.findOne({ id: incidentId });
    if (!resource || !incident) {
      return res.status(404).json({ error: 'Invalid ID' });
    }
    resource.status = 'En Route';
    resource.location = incidentId;
    if (!incident.assignedUnits.includes(resourceId)) {
      incident.assignedUnits.push(resourceId);
    }
    const logEntry = `${new Date().toLocaleTimeString('en-GB')} - ${resourceId} dispatched`;
    incident.log.push(logEntry);
    await resource.save();
    await incident.save();
    const newEvent = new Event({
      id: `evt-${Date.now()}`,
      time: new Date().toLocaleTimeString('en-GB'),
      text: `${resourceId} dispatched to ${incidentId}.`,
      type: 'dispatch',
      incidentId,
    });
    await newEvent.save();
    res.json({ success: true, newEvent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.recallUnit = async (req, res) => {
  await delay(500);
  try {
    const { incidentId, resourceId } = req.params;
    const resource = await Resource.findOne({ id: resourceId });
    const incident = await Incident.findOne({ id: incidentId });
    if (!resource || !incident) {
      return res.status(404).json({ error: 'Invalid ID' });
    }
    resource.status = 'Available';
    resource.location = 'Station 1';
    incident.assignedUnits = incident.assignedUnits.filter(id => id !== resourceId);
    const logEntry = `${new Date().toLocaleTimeString('en-GB')} - ${resourceId} recalled`;
    incident.log.push(logEntry);
    await resource.save();
    await incident.save();
    const newEvent = new Event({
      id: `evt-${Date.now()}`,
      time: new Date().toLocaleTimeString('en-GB'),
      text: `${resourceId} recalled from ${incidentId}.`,
      type: 'info',
      incidentId,
    });
    await newEvent.save();
    res.json({ success: true, newEvent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
