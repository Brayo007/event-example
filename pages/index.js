
import { Inter } from 'next/font/google'

import EventItem from '../components/EventItem';
import Event from '../models/Event';
import db from '../utils/db';


const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5 lg:mr-3 lg:ml-3">
        {events.map((event) => (
          <EventItem
            event={event}
            key={event.slug}
            
          ></EventItem>
        ))}
      </div>
  )
}

export async function getStaticProps() {
  await db.connect();
  const events = await Event.find().lean();
  return {
    revalidate: 900,
    props: {
      events: events.map(db.convertDocToObj),
    },
  };
}
