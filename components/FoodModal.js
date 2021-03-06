import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import React, { useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Slider from '@mui/material/Slider';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import DateTimePicker from '@mui/lab/DateTimePicker';
import Button from '@mui/material/Button';
import { auth, db } from '../firebaseConfig.js';
import { collection, doc, addDoc, updateDoc } from 'firebase/firestore';
import router from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import Head from 'next/head';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import NotificationsOffIcon from '@mui/icons-material/NotificationsOff';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import MobileTimePicker from '@mui/lab/MobileTimePicker';

//work on styling for this, cuts off a little bit at the top when overflow is to big
const popupStyle = {
  position: 'absolute',
  borderRadius: '15px',
  top: '50%',
  left: '50%',
  maxHeight: '100%',
  overflow: 'auto',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

//--------------------------------------------------------//
//------------------Modal Window Section------------------//
//--------------------------------------------------------//

const FoodModal = ({ babyPath, babyGet, foodArray, setFoodArray, babyName }) => {
  const [user, loading, error] = useAuthState(auth);
  const [open, setOpen] = React.useState(false);
  const [foodValue, setFoodValue] = React.useState('');
  const [foodAmount, setFoodAmount] = React.useState(0);
  const [date, setDate] = React.useState(null);
  const [feedTime, setFeedTime] = React.useState(new Date());
  const [newFood, setNewFood] = React.useState('');
  const [smsNumber, setSmsNumber] = React.useState(null);
  const [displayReminderTime, setDisplayReminderTime] = React.useState(true);
  const [reminderIcon, setReminderIcon] = React.useState(
    <NotificationsOffIcon color='disabled' />
  );
  const [reminderTime, setReminderTime] = React.useState(new Date());
  const [reminderState, setReminderState] = React.useState(false);

  //------------------------------------------//
  //----To handle open and close Modal--------//
  //------------------------------------------//
  const toOpen = () => {
    setOpen(true);
  };
  const toClose = () => {
    setOpen(false);
  };

  //------------------------------------------//
  //----Scrape Data and prepare for post------//
  //------------------------------------------//
  const postNextFood = async () => {
    let hourAhead = Date.now() + 3660000;
    let remTime = reminderTime.getTime();
    if (smsNumber !== null) {
      if (hourAhead > remTime) {
        window.alert(
          'Please Input a Reminder Time at least 65 minutes ahead of current time.'
        );
        return;
      }
      if (smsNumber.split('').length !== 10) {
        window.alert('Please input a valid cell phone number.');
        return;
      }
      if (feedTime.getTime() < Date.now()) {
        window.alert(
          'Please input a valid Date and Time for Feeding Event ahead of current time.'
        );
        return;
      }
      await updateDoc(doc(db, 'users', user.uid, 'babies', babyPath), {
        nextFeed: feedTime,
      }).then(res => {
        addDoc(collection(db, 'users', user.uid, 'babies', babyPath, 'feedingEvents'), {
          foodAmount: foodAmount,
          foodMetric: 'oz',
          foodType: foodValue,
          startTime: feedTime,
        }).then(res2 => {});
      });
      toClose();
      babyGet();
      sendSMS();
    } else {
      if (feedTime.getTime() < Date.now()) {
        window.alert('Please input a valid Date and Time.');
        return;
      }
      await updateDoc(doc(db, 'users', user.uid, 'babies', babyPath), {
        nextFeed: feedTime,
      }).then(res => {
        addDoc(collection(db, 'users', user.uid, 'babies', babyPath, 'feedingEvents'), {
          foodAmount: foodAmount,
          foodMetric: 'oz',
          foodType: foodValue,
          startTime: feedTime,
        }).then(res2 => {});
      });
      toClose();
      babyGet();
    }
  };

  const sendSMS = async () => {
    let notificationBody = {
      to: smsNumber, //this can be number or string
      body: `This is a feed reminder for ${babyName} scheduled for ${feedTime.toLocaleString(
        'en-US'
      )}, ${babyName} is having ${foodAmount} oz ${foodValue}.`,
      date: reminderTime.toISOString(),
    };

    console.log(notificationBody);
    const res = await fetch('/api/sendMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notificationBody),
    });

    const data = await res.json();
    console.log(data);
    setSmsNumber(null);
  };

  const addNewFood = async () => {
    if (newFood === '') {
      window.alert('Please input a new type of food');
      return;
    }
    let newFoodArray = foodArray.slice();
    newFoodArray.push(newFood);
    console.log(newFoodArray);
    await updateDoc(doc(db, 'users', user.uid, 'babies', babyPath), {
      babyFoodsArray: newFoodArray,
    }).then(res => {
      console.log(res);
    });
    setFoodArray(newFoodArray);
    setNewFood('');
  };

  //------------------------------------------//
  //----To Get Pretty Date--------------------//
  //------------------------------------------//
  const getPrettyDate = () => {
    const uglyDate = new Date().toString();
    const splitDate = uglyDate.split(' ');
    const prettyDate = `${splitDate[0]} ${splitDate[1]} ${splitDate[2]}, ${splitDate[3]}`;
    setDate(prettyDate);
  };

  //------------------------------------------//
  //----Use Effect to Render/Log--------------//
  //------------------------------------------//

  useEffect(() => {
    if (!user && !loading) {
      router.push('/login');
    } else if (user) {
      // console.log('that');
    }
  }, [user]);

  useEffect(() => {
    getPrettyDate();
  }, []);

  //------------------------------------------//
  //----Render Component----------------------//
  //------------------------------------------//
  return (
    <>
      <Head>
        <title>Baby Manager</title>
      </Head>
      <div>
        <Button
          onClick={toOpen}
          style={{
            width: '300px',
            background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
          }}
          className='rounded-md border-2 border-emerald-400'
          variant='contained'
        >
          Add New Feed
        </Button>
        <Modal open={open} onClose={toClose}>
          <Box sx={popupStyle} className='sm:w-5/5 md:w-3/5'>
            <div style={{ width: '300px' }}></div>
            <b>{date}</b>
            <hr />
            <div className='sb-buffer'></div>
            <FormControl fullWidth noValidate>
              <InputLabel id='foodLabel'>Type of Food</InputLabel>
              <Select
                onChange={e => setFoodValue(e.target.value)}
                value={foodValue}
                labelId='foodLabel'
                id='foodFed'
                label='Type of Food'
              >
                {foodArray.map(food => {
                  return (
                    <MenuItem key={food} value={food}>
                      {food}
                    </MenuItem>
                  );
                })}
              </Select>
              <div className='sb-buffer'></div>
              <div className='place-self-center'>
                <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                  <TextField
                    id='input-with-sx'
                    label='Input New Food'
                    variant='standard'
                    value={newFood}
                    onChange={e => {
                      setNewFood(e.target.value);
                    }}
                  />
                  <AddCircleIcon
                    onClick={addNewFood}
                    sx={{ color: '#FE6B8B', cursor: 'pointer', mr: 1, my: 0.5 }}
                  />
                </Box>
              </div>
              <div className='sb-buffer'>
                <label id='amountLabel'>
                  {foodAmount} oz. of {foodValue}
                </label>
              </div>
              <Slider
                sx={{ color: '#FE6B8B' }}
                className='py-8'
                valueLabelDisplay='auto'
                min={0}
                max={16}
                step={0.5}
                onChange={e => setFoodAmount(e.target.value)}
              ></Slider>
              <div className='place-self-center'>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateTimePicker
                    label='Date of Feed'
                    value={feedTime}
                    onChange={newValue => {
                      setFeedTime(newValue);
                    }}
                    renderInput={params => <TextField {...params} />}
                  />
                </LocalizationProvider>
                <div className='sb-buffer'></div>
              </div>
              <div style={{ display: 'flex' }} className='flex-col'>
                <p className='text-center'>Send a Text Reminder?</p>
                <p className='text-center text-xs'>
                  Reminder must be set at least 65 mins in advance.
                </p>
                <Button
                  style={{ background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)' }}
                  className='w-[25px] place-self-center'
                  onClick={() => {
                    if (reminderState) {
                      setReminderIcon(<NotificationsOffIcon color='disabled' />);
                      setReminderState(false);
                      setDisplayReminderTime(true);
                    }
                    if (!reminderState) {
                      setReminderIcon(<NotificationsActiveIcon sx={{ color: 'gold' }} />);
                      setReminderState(true);
                      setDisplayReminderTime(false);
                    }
                  }}
                  variant='contained'
                >
                  {reminderIcon}
                </Button>
                <div className='sb-buffer'></div>
                <div className='place-self-center' hidden={displayReminderTime}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <MobileTimePicker
                      label='Reminder Time'
                      value={reminderTime}
                      onChange={time => {
                        setReminderTime(time);
                      }}
                      renderInput={params => <TextField {...params} />}
                    />
                  </LocalizationProvider>
                  <div className='sb-buffer'></div>
                  <p className='text-center text-xs'>Please Input Phone Number</p>
                  <p className='text-center text-xs'>10 Digits, Numbers only</p>
                  <br />
                  <TextField
                    id='telNumber'
                    label='Mobile Number'
                    variant='outlined'
                    onChange={e => setSmsNumber(e.target.value)}
                  />
                  <div className='sb-buffer'></div>
                </div>
              </div>
              <div style={{ display: 'flex' }} className='flex-col'>
                <Button
                  onClick={postNextFood}
                  style={{
                    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                    width: '50%',
                  }}
                  className='rounded-md border-2 border-emerald-400 place-self-center'
                  variant='contained'
                  starticon='<Icon />'
                >
                  Save
                </Button>
                <div className='sb-buffer'></div>
                <Button
                  style={{
                    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                    width: '50%',
                  }}
                  className='rounded-md border-2 border-emerald-400 place-self-center'
                  variant='contained'
                  onClick={toClose}
                >
                  Cancel
                </Button>
              </div>
            </FormControl>
          </Box>
        </Modal>
      </div>
    </>
  );
};

export default FoodModal;
