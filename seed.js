const mongoose = require('mongoose');
const Incident = require('./models/incident');
const Resource = require('./models/resource');
const Event = require('./models/event');

const incidentsData = {
  'INC-0834': {
    id: 'INC-0834',
    title: 'Structure Fire',
    location: '123 Market St, Nottingham',
    position: [30.71510, 76.75591],
    priority: 'CRITICAL',
    assignedUnits: ['ENG-01', 'TRK-01'],
    aiRecommendation: 'Recommend immediate evacuation of adjacent buildings due to wind conditions.',
    log: ['20:01 - Initial call received', '20:03 - ENG-01, TRK-01 dispatched'],
  },
  'INC-0835': {
    id: 'INC-0835',
    title: 'Traffic Collision',
    location: 'Derby Road & Triumph Road',
    position: [30.7189, 76.7612],
    priority: 'HIGH',
    assignedUnits: [],
    aiRecommendation: 'High traffic area. Recommend diverting traffic and dispatching traffic control unit.',
    log: ['20:15 - Report of two-vehicle collision'],
  },
};

const resourcesData = [
    { id: 'ENG-01', type: 'Engine', status: 'On Scene', location: 'INC-0834', position: [30.71510, 76.75591] },
    { id: 'TRK-01', type: 'Truck', status: 'On Scene', location: 'INC-0834', position: [30.71510, 76.75591] },
    { id: 'AMB-01', type: 'Ambulance', status: 'Available', location: 'Station 2', position: [30.7200, 76.7500] },
    { id: 'FRU-01', type: 'Fast Response Unit', status: 'Available', location: 'Station 1', position: [30.7100, 76.7600] },
    { id: 'CMD-01', type: 'Command', status: 'Available', location: 'HQ', position: [30.7150, 76.7500] },
];

const eventsData = [
  { id: 'evt-1', time: '20:15', text: 'New incident reported: Traffic Collision at Derby Road & Triumph Road.', type: 'critical', incidentId: 'INC-0835' },
  { id: 'evt-2', time: '20:03', text: 'ENG-01, TRK-01 dispatched to INC-0834.', type: 'dispatch', incidentId: 'INC-0834' },
  { id: 'evt-3', time: '20:01', text: 'New incident reported: Structure Fire at 123 Market St.', type: 'critical', incidentId: 'INC-0834' },
];

async function seed() {
  try {
    await mongoose.connect('mongodb://localhost:27017/resqai', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Clear existing data
    await Incident.deleteMany({});
    await Resource.deleteMany({});
    await Event.deleteMany({});

    // Insert incidents
    for (const key in incidentsData) {
      const incident = new Incident(incidentsData[key]);
      await incident.save();
    }

    // Insert resources
    for (const resource of resourcesData) {
      const res = new Resource(resource);
      await res.save();
    }

    // Insert events
    for (const event of eventsData) {
      const evt = new Event(event);
      await evt.save();
    }

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed();
