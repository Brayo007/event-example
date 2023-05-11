import Link from 'next/link';
import React from 'react';
import Image from 'next/legacy/image';


export default function EventItem({ event, }) {
  return (
    <div className="card">
      <Link href={`/event/${event.slug}`} passHref legacyBehavior>

        <Image
          src={event.simages[0]}
          alt={event.name}
          width="64px"
          height="70px"
          layout="responsive"
          objectFit="contain"
          objectPosition="top"
          className="rounded shadow-sm h-64 w-64 hover:cursor-pointer"
        />

      </Link>
      <div className="flex flex-col p-5 ">
      <Link href={`/event/${event.slug}`} legacyBehavior>
          
            <h2 className="font-semi-bold text-base md:text-base hover:cursor-pointer">{event.name.length >= 13 ? event.name.slice(0, 13) + '..' : event.name}</h2>
          
        </Link>
        

        <h2 className="mb-2 base md:text-base">{event.category.length >= 12 ? event.category.slice(0, 13) + '..' : event.category}</h2>
        
        


      </div>
    </div>
  );
}