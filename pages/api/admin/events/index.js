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
    name: 'updating..',
    slug: 'updating..-' + Math.random().toString(),
    image: '/images/blank.jpg',
    firstimage: '/images/blank.jpg',
    secondimage: '/images/blank.jpg',
    thirdimage: '/images/blank.jpg',
    
    category: 'sample category',
    
    description: 'sample description',
    
    
    
  });

  const event = await newEvent.save();
  await db.disconnect();
  res.send({ message: 'Event created successfully', event });
};
const getHandler = async (req, res) => {
  await db.connect();
  const products = await Event.find({});
  await db.disconnect();
  res.send(products);
};
export default handler;