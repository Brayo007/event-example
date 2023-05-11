import Event from '../../../../models/Event';
import db from '../../../../utils/db';

const handler = async (req, res) => {
  res.setHeader('Cache-Control', 's-maxage=10')
  await db.connect();
  const event = await Event.findById(req.query.id);
  await db.disconnect();
  res.send(event);
};

export default handler;