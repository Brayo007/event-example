import { getSession } from 'next-auth/react';
import Event from '../../../../../models/Event';
import db from '../../../../../utils/db';

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (!session || (session && !session.user.isAdmin)) {
    return res.status(401).send('signin required');
  }

  const { user } = session;
  if (req.method === 'GET') {
    return getHandler(req, res, user);
  } else if (req.method === 'PUT') {
    return putHandler(req, res, user);
  } else if (req.method === 'DELETE') {
    return deleteHandler(req, res, user);
  } else {
    return res.status(400).send({ message: 'Method not allowed' });
  }
};
const getHandler = async (req, res) => {
  await db.connect();
  const event = await Event.findById(req.query.id);
  await db.disconnect();
  res.send(event);
};
const putHandler = async (req, res) => {
  await db.connect();
  const event = await Event.findById(req.query.id);
  if (event) {
    event.name = req.body.name;
    event.slug = (req.body.name + Math.random().toString().substring(1,6)).replace(/\s+/g, '-').toLocaleLowerCase();
    event.category = req.body.category;
    //event.image = req.body.image;
    //event.simages = (event.simages).splice(0,(event.simages)).concat(req.body.maimage);
    const existingImages = event.simages; // Fetch the existing images from the database
    event.simages = existingImages;
    
    event.description = req.body.description;
    
    event.location = req.body.location;
    
    event.featured = req.body.featured === '1' ? true : false;
    await event.save();
    await db.disconnect();
    res.send({ message: 'Event updated successfully' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'Event not found' });
  }
};
const deleteHandler = async (req, res) => {
  await db.connect();
  const event = await Event.findById(req.query.id);
  if (event) {
    await event.remove();
    await db.disconnect();
    res.send({ message: 'Event deleted successfully' });
  } else {
    await db.disconnect();
    res.status(404).send({ message: 'Event not found' });
  }
};
export default handler;