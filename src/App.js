import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuIcon from '@material-ui/icons/Menu';
import { useQuery } from '@apollo/client';

import Home from './components/Home';
import MiningOpsList from './components/MiningOpsList';
import StructureList from './components/StructureList';
import MiningOpsView from './components/MiningOpsView';
import LoginCallback from './components/LoginCallback';
import { GQLGetLoginUrl, isLoggedIn, CallbackURL } from './GraphQLClient';

import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

const scopes = [
	'esi-industry.read_corporation_mining.v1',
	'esi-universe.read_structures.v1',
	'esi-contracts.read_character_contracts.v1',
    'esi-corporations.read_structures.v1'
];

export default function App()
{
    const [anchorEl, setAnchorEl] = React.useState(null);
    const { loading, error, data } = useQuery(GQLGetLoginUrl, { variables: { callbackUrl: CallbackURL, scopes: scopes}});


    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogin = () => {
        window.location.href = data.loginUrl;
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
                            <MenuItem><Link to={'/structures'}>Structures</Link></MenuItem>
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
                    <Route path='/structures' component={StructureList} />
                    <Route path='/mining/list-ops' component={MiningOpsList} />
                    <Route path='/mining/view' component={MiningOpsView} />
                    <Route path='/login/callback' component={LoginCallback} />
                </Switch>
            </div>
    </Router>);
}
