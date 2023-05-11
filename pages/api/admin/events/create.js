import { getSession } from 'next-auth/react';
import Event from '../../../../models/Event';
import db from '../../../../utils/db';

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || !session.user.isAdmin) {
    return res.status(401).send('admin signin required');
  }
  // const { user } = session;
  if (req.method === 'GET') {
    return getHandler(req, res);
  } else if (req.method === 'POST') {
    return postHandler(req, res);
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};
const postHandler = async (req, res) => {
  await db.connect();
  const newEvent = new Event({
    name: req.body.name,
    slug: (req.body.name + Math.random().toString().substring(1,6)).replace(/\s+/g, '-').toLocaleLowerCase(),
    //image: req.body.image,
    simages: req.body.maimage,
    category: req.body.category,
    description: req.body.description,
    location: req.body.location,
    featured: req.body.featured === '1' ? true : false,
  });

  const event = await newEvent.save();
  await db.disconnect();
  res.send({ message: 'Event created successfully', event });
};
const getHandler = async (req, res) => {
  await db.connect();
  const events = await Event.find({});
  await db.disconnect();
  res.send(events);
};
export default handler;