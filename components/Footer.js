import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBaby } from '@fortawesome/free-solid-svg-icons';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fade from '@mui/material/Fade';
import IconButton from '@mui/material/IconButton';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { signOut } from 'firebase/auth';
import { auth } from '../firebaseConfig.js';
import Link from 'next/link';

export default function Footer() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [anchorElPer, setAnchorElPer] = useState(null);
  const openPer = Boolean(anchorElPer);
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      console.log('signed out!');
      router.push('/login');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <footer className='fixed inset-x-0 bottom-0  bg-blue-100 pb:10 bottom sm:hidden z-[300]'>
      <div className='px-5 py-2 mx-auto'>
        <div className='flex justify-between items-center'>
          <Link href='/calendar' passHref>
            <IconButton className='!text-black'>
              <CalendarTodayIcon className='text-[1.75rem] !text-black' />
            </IconButton>
          </Link>

          <div>
            <IconButton
              className='!text-black'
              id='fade-button-person'
              aria-controls={openPer ? 'fade-menu-person' : undefined}
              aria-haspopup='true'
              aria-expanded={openPer ? 'true' : undefined}
              onClick={e => setAnchorElPer(e.currentTarget)}
            >
              <PersonIcon className='text-[1.75rem] !text-black' />
            </IconButton>
            <Menu
              id='fade-menu-person'
              MenuListProps={{
                'aria-labelledby': 'fade-button-person',
              }}
              anchorEl={anchorElPer}
              open={openPer}
              onClose={() => setAnchorElPer(null)}
              TransitionComponent={Fade}
            >
              <Link href='/user' passHref>
                <MenuItem onClick={() => setAnchorElPer(null)}>Profile</MenuItem>
              </Link>
              <MenuItem
                onClick={() => {
                  setAnchorElPer(null);
                  handleSignOut();
                }}
              >
                Logout
              </MenuItem>
            </Menu>
          </div>

          <Link href='/overview' passHref>
            <IconButton>
              <FontAwesomeIcon className='text-[1.75rem] !text-black' icon={faBaby} />
            </IconButton>
          </Link>
          <Link href='/otherBabies' passHref>
            <IconButton>
              <PeopleAltIcon className='text-[1.75rem] !text-black' />
            </IconButton>
          </Link>

          <div>
            <IconButton
              className='!text-black'
              id='fade-button'
              aria-controls={open ? 'fade-menu' : undefined}
              aria-haspopup='true'
              aria-expanded={open ? 'true' : undefined}
              onClick={e => setAnchorEl(e.currentTarget)}
            >
              <MoreHorizIcon className='text-[1.75rem] !text-black' />
            </IconButton>
            <Menu
              id='fade-menu'
              MenuListProps={{
                'aria-labelledby': 'fade-button',
              }}
              anchorEl={anchorEl}
              open={open}
              onClose={() => setAnchorEl(null)}
              TransitionComponent={Fade}
            >
              <Link href='/notes' passHref>
                <MenuItem onClick={() => setAnchorEl(null)}>Notes</MenuItem>
              </Link>

              <Link href='/changingRooms' passHref>
                <MenuItem onClick={() => setAnchorEl(null)}>Changing Stations</MenuItem>
              </Link>
              <Link href='/coupons' passHref>
                <MenuItem onClick={() => setAnchorEl(null)}>Coupons</MenuItem>
              </Link>
            </Menu>
          </div>
        </div>
      </div>
    </footer>
  );
}
