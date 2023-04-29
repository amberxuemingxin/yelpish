import { AppBar, Container, Toolbar, Typography } from '@mui/material'
import { NavLink } from 'react-router-dom';
import { createTheme, styled, alpha } from '@mui/material/styles';
// import SearchIcon from '@mui/icons-material/Search';
// import InputBase from '@mui/material/InputBase';
import Button from '@mui/material/Button';


const NavText = ({ href, text, isMain }) => {
  return (
    <Typography
      variant={isMain ? 'h5' : 'h7'}
      noWrap
      style={{
        marginRight: '30px',
        fontFamily: 'monospace',
        fontWeight: 700,
        letterSpacing: '.3rem',
      }}
    >
      <NavLink
        to={href}
        style={{
          color: '#ffffff',
          textDecoration: 'none',
        }}
      >
        {text}
      </NavLink>
    </Typography>
  )
}

const theme = createTheme({
  status: {
    danger: '#e53e3e',
  },
  palette: {
    primary: {
      main: '#f1356d',
      darker: '#053e85',
    },
    neutral: {
      main: '#64748B',
      contrastText: '#fff',
    },
  },
});

// const Search = styled('div')(({ theme }) => ({
//   position: 'relative',
//   borderRadius: theme.shape.borderRadius,
//   backgroundColor: alpha(theme.palette.common.white, 0.15),
//   '&:hover': {
//     backgroundColor: alpha(theme.palette.common.white, 0.25),
//   },
//   marginLeft: 0,
//   width: '100%',
//   [theme.breakpoints.up('sm')]: {
//     marginLeft: theme.spacing(1),
//     width: 'auto',
//   },
// }));

// const SearchIconWrapper = styled('div')(({ theme }) => ({
//   padding: theme.spacing(0, 2),
//   height: '100%',
//   position: 'absolute',
//   pointerEvents: 'none',
//   display: 'flex',
//   alignItems: 'center',
//   justifyContent: 'center',
// }));

// const StyledInputBase = styled(InputBase)(({ theme }) => ({
//   color: 'inherit',
//   '& .MuiInputBase-input': {
//     padding: theme.spacing(1, 1, 1, 0),
//     // vertical padding + font size from searchIcon
//     paddingLeft: `calc(1em + ${theme.spacing(4)})`,
//     transition: theme.transitions.create('width'),
//     width: '100%',
//     [theme.breakpoints.up('sm')]: {
//       width: '12ch',
//       '&:focus': {
//         width: '20ch',
//       },
//     },
//   },
// }));


export default function NavBar({isLoggedIn, signout}) {
  const NavText2 = ({ href, text }) => {
    return (
      <Typography
        variant={'h7'}
        noWrap
        style={{
          marginRight: '30px',
          fontFamily: 'monospace',
          fontWeight: 700,
          letterSpacing: '.3rem',
        }}
        onClick={() => signout()}
      >
        <NavLink
          to={href}
          style={{
            color: '#ffffff',
            textDecoration: 'none',
          }}
        >
          {text}
        </NavLink>
      </Typography>
    )
  }

  return (
    <AppBar position='static' theme={theme}>
      <Container maxWidth='xl'>
        <Toolbar disableGutters>
          <NavText href='/' text='RESTAURANT ENCYCLOPEDIA' isMain />
          {/* <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search' }}
            />
          </Search> */}
          <NavText href='/search_business' text='Search Business' />
          {isLoggedIn ? <></> : <NavText href='/' text='Login' />}
          {isLoggedIn ? <NavText href='/profile' text='Profile' /> : <></>}
          {isLoggedIn ? <NavText href='/find_friend' text='Find Friend' /> : <></>}
          {isLoggedIn ? <NavText2 href='/' text='Sign Out' /> : <></>}
        </Toolbar>
      </Container>
    </AppBar>
  );
}