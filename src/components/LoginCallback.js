import React, { useEffect, Component } from 'react';
import  { Redirect } from 'react-router-dom'

import { useQuery } from '@apollo/client';
import { GQLGetAuthorizationToken } from '../GraphQLClient';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

export default function LoginCallback ()
{
    const authResult = new URLSearchParams(window.location.search);
    const code = authResult.get('code');
    const { loading, error, data } = useQuery(GQLGetAuthorizationToken, { variables: { code }});
    useEffect(function RetrieveCookie()
    {
        if (loading) return null;
        if (error) return `Error ${error}`;
        if (data && data.getAuthorizationToken) {
            sessionStorage.setItem('ESIToken', JSON.stringify(data.getAuthorizationToken));
        }
        return '';
    });

    return (
        <Link to='/'>Home</Link>
    );
}
