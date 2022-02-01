import WbSunnyIcon from '@mui/icons-material/WbSunny';
import FoodModal from '../../components/FoodModal.js';
import { db } from '../../firebaseConfig.js';
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  orderBy,
  limit,
} from 'firebase/firestore';
import NapModal from '../../components/NapModal.js';
import React, { useState, useEffect } from 'react';

export const getServerSidePaths = async () => {
  // const res = await fetch(`https://jsonplaceholder.typicode.com/users`);
  // const data = await res.json();

  // const paths = data.map(baby => {
  //   return {
  //     params: { id: baby.id.toString() },
  //   };
  // });

  // return {
  //   paths,
  //   fallback: false,
  // };

  ///////////////////////
  const babyRef = collection(db, 'users', user.uid, 'babies');
  const data = await getDocs(babyRef);

  const babies = data.docs.map(doc => {
    return {
      params: { id: doc.id.toString() },
    };
  });

  return {
    paths,
    fallback: false,
  };
};

export const getServerSideProps = async context => {
  const id = context.params.id;

  const feedRef = collection(db, 'baby', `${id}`, 'feedingEvents');
  // const feedSnap = await getDocs(feedRef);

  const feedQuery = query(feedRef, orderBy('startTime', 'desc'));
  const feeds = await getDocs(feedQuery);
  const sortedFeeds = feeds.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  const sleepRef = collection(db, 'baby', `${id}`, 'sleepingEvents');
  // const sleepSnap = await getDocs(sleepRef);

  const sleepQuery = query(sleepRef, orderBy('startTime', 'desc'));
  const sleeps = await getDocs(sleepQuery);
  const sortedSleeps = sleeps.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // const feeds = feedSnap.docs.map(doc =>
  //   ({ id: doc.id, ...doc.data()})
  // );

  // const sleeps = sleepSnap.docs.map(doc =>
  //   ({ id: doc.id, ...doc.data()})
  // )

  const babyData = {};
  babyData['lastFeed'] = sortedFeeds[0];
  babyData['lastSleep'] = sortedSleeps[0];

  // console.log('feeds:', sortedFeeds);
  // console.log('sleeps:', sortedSleeps);
  // console.log('babyData:', babyData);

  return {
    props: { baby: JSON.stringify(babyData) },
  };

  // const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`);
  // const data = await res.json();

  // return {
  //   props: { baby: data },
  // };
};
//--------------------------------------------------------//
//--------------------------------------------------------//
//--------------------------------------------------------//

//--------------------------------------------------------//
//------------------Render to Page------------------------//
//--------------------------------------------------------//
const Baby = ({ baby }) => {
  const [lastFeed, setLastFeed] = React.useState(null);
  const [lastSleep, setLastSleep] = React.useState(null);
  let parsedBaby = JSON.parse(baby);

  const getLastFeedDatePretty = () => {
    const uglyDate = new Date(parsedBaby.lastFeed.startTime.seconds * 1000).toString();
    const splitDate = uglyDate.split(' ');
    const uglyTime = splitDate[4].split(':');
    let prettyTime = null;
    if (uglyTime[0] > 12) {
      prettyTime = `${uglyTime[0] % 12}:${uglyTime[1]} pm`;
    } else {
      prettyTime = `${uglyTime[0]}:${uglyTime[1]} am`;
    }
    const prettyDate = `${splitDate[0]} ${splitDate[1]} ${splitDate[2]}, ${splitDate[3]}, ${prettyTime}`;
    setLastFeed(prettyDate || 'No Date');
  };

  const getLastNapDatePretty = () => {
    const uglyDate = new Date(parsedBaby.lastSleep.startTime.seconds * 1000).toString();
    const splitDate = uglyDate.split(' ');
    const uglyTime = splitDate[4].split(':');
    let prettyTime = null;
    if (uglyTime[0] > 12) {
      prettyTime = `${uglyTime[0] % 12}:${uglyTime[1]} pm`;
    } else {
      prettyTime = `${uglyTime[0]}:${uglyTime[1]} am`;
    }
    const prettyDate = `${splitDate[0]} ${splitDate[1]} ${splitDate[2]}, ${splitDate[3]}, ${prettyTime}`;
    setLastSleep(prettyDate);
  };

  useEffect(() => {
    getLastFeedDatePretty();
    getLastNapDatePretty();
  });
  return (
    <>
      <div style={{ paddingTop: '80px' }}></div>
      <div
        className='container mx-auto md:grid md:place-content-center'
        style={{ padding: '2rem' }}
      >
        <div className='md:sb-container md:grid-cols-1'>
          <div style={{ display: 'grid' }} className='grid-cols-2 text-center'>
            <div className='place-self-center'>
              <div style={{ backgroundColor: 'lightgreen', width: '150px', height: '150px' }}>
                Baby Picture
              </div>
            </div>
            <div>
              <b>{baby.name}</b>
              <div className='sb-buffer'></div>
              <b>Awake</b>
              <button
                style={{ width: '50px' }}
                className='rounded-md border-2 border-emerald-400'
              >
                <WbSunnyIcon />
              </button>
            </div>
          </div>
          <div style={{ display: 'grid' }} className='grid-cols-2 text-center sb-buffer'>
            <div>
              <b>Last Feed</b>
            </div>
            <div>
              <b>{lastFeed}</b>
            </div>
          </div>
          <div style={{ display: 'grid' }} className='grid-cols-2 text-center sb-buffer'>
            <div>
              <b>Next Feed</b>
            </div>
            <div>
              <b>{baby.phone}</b>
            </div>
          </div>
          <div style={{ display: 'grid' }} className='grid-cols-2 text-center sb-buffer'>
            <div>
              <b>Last Nap</b>
            </div>
            <div>
              <b>{lastSleep}</b>
            </div>
          </div>
          <div style={{ display: 'grid' }} className='grid-cols-2 text-center sb-buffer'>
            <div>
              <b>Next Nap</b>
            </div>
            <div>
              <b>{baby.website}</b>
            </div>
          </div>
          <div style={{ display: 'grid' }} className='grid-cols-1 text-center'>
            <div className='sb-buffer'>
              <FoodModal />
            </div>
          </div>
          <div style={{ display: 'grid' }} className='grid-cols-1 text-center'>
            <div className='sb-buffer'>
              <NapModal />
            </div>
          </div>
        </div>
      </div>
      <div style={{ paddingTop: '80px' }}></div>
    </>
  );
};

//--------------------------------------------------------//
//--------------------------------------------------------//
//--------------------------------------------------------//

export default Baby;
