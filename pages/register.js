import React, { useState } from 'react';
import Link from 'next/link';
import { auth, db } from '../firebaseConfig.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'next/router';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function Register() {
  const [registerInfo, setRegisterInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  const router = useRouter();

  const handleChange = ({ target: { name, value } }) => {
    setRegisterInfo({ ...registerInfo, hasChanged: true, [name]: value });
  };

  const handleSubmit = async e => {
    const { email, password, confirmPassword } = registerInfo;
    e.preventDefault();
    if (password === confirmPassword) {
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const userRef = collection(db, 'users', userCredential.user.uid);
        await addDoc(userRef, {
          firstName: registerInfo.firstName,
          lastName: registerInfo.lastName,
          email: registerInfo.email,
          phoneNumber: registerInfo.phoneNumber ? String(registerInfo.phoneNumber) : null,
        });
        // userCredential.user.firstName = registerInfo.firstName;
        // userCredential.user.lastName = registerInfo.lastName;
        // userCredential.user.phoneNumber = registerInfo.phoneNumber
        //   ? String(registerInfo.phoneNumber)
        //   : null;
        // console.log('REGISTERED AS: ', userCredential.user);
        router.push('/');
      } catch (err) {
        console.error(err);
        alert(err.message);
      }
    } else {
      alert('passwords do not match');
    }
    setRegisterInfo({
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
    });
  };

  return (
    <div>
      <h2>Create an Account</h2>
      <br />
      <form onSubmit={handleSubmit}>
        <label htmlFor='firstName'>First Name: </label>
        <input
          type='text'
          id='firstName'
          name='firstName'
          value={registerInfo.firstName}
          onChange={handleChange}
          required
        />
        <br />
        <label htmlFor='lastName'>Last Name: </label>
        <input
          type='text'
          id='lastName'
          name='lastName'
          value={registerInfo.lastName}
          onChange={handleChange}
          required
        />
        <br />
        <label htmlFor='email'>Email: </label>
        <input
          type='email'
          id='email'
          name='email'
          value={registerInfo.email}
          onChange={handleChange}
          required
        />
        <br />
        <label htmlFor='phoneNumber'>Phone Number (optional): </label>
        <input
          type='tel'
          id='phoneNumber'
          name='phoneNumber'
          value={registerInfo.phoneNumber}
          onChange={handleChange}
          pattern='[0-9]{3}-[0-9]{3}-[0-9]{4}'
        />
        <br />
        <label htmlFor='password'>Password: </label>
        <input
          type='password'
          id='password'
          name='password'
          value={registerInfo.password}
          onChange={handleChange}
          required
        />
        <br />
        <label htmlFor='confirmPassword'>Confirm Password: </label>
        <input
          type='password'
          id='confirmPassword'
          name='confirmPassword'
          value={registerInfo.confirmPassword}
          onChange={handleChange}
          required
        />
        <br />
        <button>Register</button>
      </form>
      <Link href='/login'>
        <a>Have an account? Login here!</a>
      </Link>
    </div>
  );
}

// import React, { useState } from 'react';
// import Link from 'next/link';
// import { auth } from '../firebaseConfig.js';
// import { createUserWithEmailAndPassword } from 'firebase/auth';
// import { useRouter } from 'next/router';

// export default function Register() {
//   const [registerInfo, setRegisterInfo] = useState({
//     firstName: '',
//     lastName: '',
//     email: '',
//     phoneNumber: '',
//     password: '',
//     confirmPassword: '',
//   });
//   const router = useRouter();

//   const handleChange = ({ target: { name, value } }) => {
//     setRegisterInfo({ ...registerInfo, hasChanged: true, [name]: value });
//   };

//   const handleSubmit = async e => {
//     const { email, password, confirmPassword } = registerInfo;
//     e.preventDefault();
//     if (password === confirmPassword) {
//       try {
//         const userCredential = await createUserWithEmailAndPassword(
//           auth,
//           email,
//           password
//         );
//         userCredential.user.firstName = registerInfo.firstName;
//         userCredential.user.lastName = registerInfo.lastName;
//         userCredential.user.phoneNumber = registerInfo.phoneNumber
//           ? String(registerInfo.phoneNumber)
//           : null;
//         console.log('REGISTERED AS: ', userCredential.user);
//         router.push('/');
//       } catch (err) {
//         console.error(err);
//         alert(err.message);
//       }
//     } else {
//       alert('passwords do not match');
//     }
//     setRegisterInfo({
//       firstName: '',
//       lastName: '',
//       email: '',
//       phoneNumber: '',
//       password: '',
//       confirmPassword: '',
//     });
//   };

//   return (
//     <div>
//       <h2>Create an Account</h2>
//       <br />
//       <form onSubmit={handleSubmit}>
//         <label htmlFor='firstName'>First Name: </label>
//         <input
//           type='text'
//           id='firstName'
//           name='firstName'
//           value={registerInfo.firstName}
//           onChange={handleChange}
//           required
//         />
//         <br />
//         <label htmlFor='lastName'>Last Name: </label>
//         <input
//           type='text'
//           id='lastName'
//           name='lastName'
//           value={registerInfo.lastName}
//           onChange={handleChange}
//           required
//         />
//         <br />
//         <label htmlFor='email'>Email: </label>
//         <input
//           type='email'
//           id='email'
//           name='email'
//           value={registerInfo.email}
//           onChange={handleChange}
//           required
//         />
//         <br />
//         <label htmlFor='phoneNumber'>Phone Number (optional): </label>
//         <input
//           type='tel'
//           id='phoneNumber'
//           name='phoneNumber'
//           value={registerInfo.phoneNumber}
//           onChange={handleChange}
//           pattern='[0-9]{3}-[0-9]{3}-[0-9]{4}'
//         />
//         <br />
//         <label htmlFor='password'>Password: </label>
//         <input
//           type='password'
//           id='password'
//           name='password'
//           value={registerInfo.password}
//           onChange={handleChange}
//           required
//         />
//         <br />
//         <label htmlFor='confirmPassword'>Confirm Password: </label>
//         <input
//           type='password'
//           id='confirmPassword'
//           name='confirmPassword'
//           value={registerInfo.confirmPassword}
//           onChange={handleChange}
//           required
//         />
//         <br />
//         <button>Register</button>
//       </form>
//       <Link href='/login'>
//         <a>Have an account? Login here!</a>
//       </Link>
//     </div>
//   );
// }
