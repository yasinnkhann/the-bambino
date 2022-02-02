import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebaseConfig.js';
import { collection, doc, setDoc, getDoc, updateDoc, addDoc } from 'firebase/firestore';
import Link from 'next/link';
const crypto = require('crypto');

export default function User() {
  const [email, setEmail] = useState('');
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (user) {
      console.log(user);
    }
  }, [user]);

  const getUserInfo = async () => {
    const userRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      console.log('Document data:', docSnap.data());
    } else {
      // doc.data() will be undefined in this case
      console.log('No such document!');
    }
  };

  const createInvitation = async token => {
    // const docRef = await addDoc(collection(db, 'users', user.uid, 'invitations'), {
    //   emailSentTo: email,
    //   token: token,
    //   accepted: false,
    // });
    await addDoc(collection(db, 'invitations'), {
      inviter_id: user.uid,
      emailSentTo: email,
      token: token,
      accepted: false,
    });
  };

  const handleChange = () => {
    setEmail(event.target.value);
  };

  const handleInviteButton = async e => {
    e.preventDefault();
    const token = crypto.randomBytes(8).toString('hex');
    const body = {
      name: user.displayName,
      email: email,
      token: token,
    };
    createInvitation(token);
    const res = await fetch('/api/invite', {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    alert('Invite Sent!');
  };

  return user ? (
    <article>
      <section className='h-screen  flex flex-col justify-center mx-[2%]'>
        <div>
          <div>Name: {user.displayName}</div>
          <div>Email: {user.email}</div>
          <div>Phone Number: {user.phoneNumber}</div>
        </div>
        <div>
          <div>[List of names that are authorized to manage your baby details]</div>
          <div>Invite another user to manage your babies</div>
          <div>
            <form onSubmit={handleInviteButton}>
              <input type='email' onChange={handleChange}></input>
              <button type='submit'>Invite User</button>
            </form>
            <button onClick={getUserInfo}>Print User Info</button>
            {/* <Link href='/'>
              <a>Invitation Link</a>
            </Link> */}
            <div>
              <button>Sign Out Button</button>
            </div>
          </div>
        </div>
      </section>
    </article>
  ) : null;
}
