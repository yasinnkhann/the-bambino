import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Link from 'next/link';
import { doc, deleteDoc, updateDoc } from '@firebase/firestore';
import Button from '@mui/material/Button';
import DeleteIcon from '@mui/icons-material/Delete';
import { db } from '../firebaseConfig';
import EditIcon from '@mui/icons-material/Edit';
import { TextField } from '@mui/material';

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff'
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
    width: 32,
    height: 32,
    '&:before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        '#fff'
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
    borderRadius: 20 / 2,
  },
}));

const babyListViewCard = {
  display: 'flex',
  margin: '5px',
  borderRadius: '10px',
  padding: '1px',
  boxShadow: '2px 5px #B5B5B5',
};

const nextFeedBtn = {
  margin: '15px',
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  border: 0,
  borderRadius: 3,
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  color: 'white',
  height: 48,
  padding: '0 30px',
};

export default function BabyCard({
  babyID,
  babyName,
  sleepStatus,
  nextFeed,
  viewType,
  retrieveSleepData,
  user,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(babyName);

  const handleUpdateSleep = async (e, value) => {
    e.preventDefault();
    try {
      const babyRef = doc(db, 'users', user.uid, 'babies', babyID);
      await updateDoc(babyRef, { isAsleep: value });
    } catch (err) {
      console.log(err);
    } finally {
      retrieveSleepData();
    }
  };

  const handleUpdateBabyName = async e => {
    e.preventDefault();
    try {
      const babyRef = doc(db, 'users', user.uid, 'babies', babyID);
      await updateDoc(babyRef, { name: editedName });
    } catch (err) {
      console.log(err);
    } finally {
      retrieveSleepData();
      setIsEditing(false);
    }
  };

  const handleDeleteBaby = async () => {
    try {
      const babyRef = doc(db, 'users', user.uid, 'babies', babyID);
      await deleteDoc(babyRef);
    } catch (err) {
      console.log(err);
    } finally {
      retrieveSleepData();
    }
  };
  // handling the view module and list
  const classNameForModuleView =
    'm-[1%] h-[195px] w-[120px] sm:h-[200px] sm:w-[200px] md:h-[240px] md:w-[255px]';
  const classNameForListView =
    'm-[1%] h-[200px] w-[360px] sm:h-[210px] sm:w-[550px] md:h-[240px] md:w-[750px]';

  const classNameBabyAsleep =
    'animatedCard self-center bg-[url("/asleep-baby.svg")] w-[120px] h-[110px] sm:w-[125px] sm:h-[115px]  md:w-[130px] md:h-[150px]  bg-center bg-cover bg-no-repeat';

  const classNameBabyAwake =
    'animatedCard self-center bg-[url("/awake-baby.svg")] w-[120px] h-[110px] sm:w-[125px] sm:h-[115px]  md:w-[130px] md:h-[150px] bg-center bg-cover bg-no-repeat';

  return (
    <React.Fragment>
      <div
        className={viewType === 'list' ? classNameForListView : classNameForModuleView}
        style={viewType === 'list' ? babyListViewCard : null}
      >
        <Card className='animatedCard h-[100%] w-[100%]'>
          <FormControlLabel
            className='flex flex-col'
            labelPlacement='top'
            label=''
            control={
              <MaterialUISwitch
                className='animatedCard self-center'
                checked={sleepStatus}
                onChange={handleUpdateSleep}
                sx={{ m: 1 }}
              />
            }
          />
          {user ? (
            <Link
              href={{ pathname: `/baby/${babyID}`, query: user.uid }}
              key={babyID}
              passHref
            >
              <div style={{ textAlign: 'center' }}>
                <div
                  className='flex flex-col h-[100%] w-[100%]'
                  style={{ cursor: 'pointer', textAlign: 'center' }}
                >
                  {sleepStatus ? (
                    <div className={classNameBabyAsleep}></div>
                  ) : (
                    <div className={classNameBabyAwake}></div>
                  )}
                </div>
                <div>{babyName}</div>
              </div>
            </Link>
          ) : (
            <Link href={{ pathname: `/baby/${babyID}` }} key={babyID} passHref>
              <div style={{ textAlign: 'center' }}>
                <div
                  className='flex flex-col h-[100%] w-[100%]'
                  style={{ cursor: 'pointer', textAlign: 'center' }}
                >
                  {sleepStatus ? (
                    <div className={classNameBabyAsleep}></div>
                  ) : (
                    <div className={classNameBabyAwake}></div>
                  )}
                </div>
                <div>{babyName}</div>
              </div>
            </Link>
          )}
        </Card>
        {viewType === 'list' ? (
          <div className='animatedCard flip-card h-[100%] w-[100%]'>
            <div className='flip-card-inner'>
              <div className='flip-card-front'>
                <div className='mt-[15%] h-[100%] w-[100%]'>
                  <div>
                    <Button style={{ color: 'black' }} variant='contained'>
                      Next Feed{' '}
                    </Button>
                  </div>
                  <div>
                    <Button style={nextFeedBtn}>
                      {' '}
                      {nextFeed === null
                        ? 'N/A'
                        : `${new Date(nextFeed * 1000).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}`}{' '}
                    </Button>
                  </div>
                </div>
              </div>
              <div className='flip-card-back mt-[15%] h-[100%] w-[100%]'>
                <Button
                  onClick={handleDeleteBaby}
                  variant='outlined'
                  startIcon={<DeleteIcon />}
                >
                  {' '}
                  Delete{' '}
                </Button>
                {isEditing ? (
                  <form className='h-[100%] w-[100%]' onSubmit={e => handleUpdateBabyName(e)}>
                    <div className='my-[2%] md:flex md:flex-col lg:flex lg:flex-col'>
                      <Button type='submit' variant='outlined'>
                        {' '}
                        Submit{' '}
                      </Button>
                      <TextField
                        className='my-[2%]'
                        style={{
                          backgroundColor: 'transparent',
                          color: 'black',
                        }}
                        type='text'
                        value={editedName}
                        onChange={e => setEditedName(e.target.value)}
                      />
                    </div>
                  </form>
                ) : (
                  <Button
                    className='my-[2%] h-[25%] w-[70%]'
                    onClick={() => setIsEditing(!isEditing)}
                    variant='outlined'
                    startIcon={<EditIcon />}
                  >
                    Edit
                  </Button>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </React.Fragment>
  );
}
