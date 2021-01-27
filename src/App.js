import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuIcon from '@material-ui/icons/Menu';
import { gql, useQuery } from '@apollo/client';

import Home from './components/Home';
import MiningOpsList from './components/MiningOpsList';
import LoginCallback from './components/LoginCallback';
import { GQLGetLoginUrl, isLoggedIn } from './GraphQLClient';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

export default function App()
{
    const [anchorEl, setAnchorEl] = React.useState(null);
    const { loading, error, data } = useQuery(GQLGetLoginUrl, { variables: { callbackUrl: 'http://localhost:3000/login/callback'}});

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogin = () => {
        console.log(data);
        window.location.href = data.getLoginUrl;
    }

    return (<Router>
            <div class="menu">
                <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}><MenuIcon /></Button>
                <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={Boolean(anchorEl)}
                    onClose={handleClose}>
                    <MenuItem><Link to={'/'}>Home</Link></MenuItem>
                    { isLoggedIn()
                        ? <>
                            <MenuItem><Link to={'/mining/list-ops'}>Mining Ops</Link></MenuItem>
                            <MenuItem onClick={handleLogin}>Relogin</MenuItem>
                          </>
                        : <MenuItem onClick={handleLogin}>Login</MenuItem>
                    }
                </Menu>
            </div>
            <div class="contents">
                <Switch>
                    <Route exact path='/' component={Home} />
                    <Route path='/mining/list-ops' component={MiningOpsList} />
                    <Route path='/login/callback' component={LoginCallback} />
                </Switch>
            </div>
    </Router>);
}
