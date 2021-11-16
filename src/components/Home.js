import React, { Component } from 'react';
import { useQuery } from '@apollo/client';
import Box from '@material-ui/core/Box';
import { GQLMe } from '../GraphQLClient';

export default function Home()
{
    const { loading, error, data } = useQuery(GQLMe);
    let character = null;
    function GetSelf()
    {
        if (loading) return null;
        if (error) return `Error ${error}`;
        if (data && data.me) {
            character = data.me;
            return 'Welcome, ' + character.name;
        }
        return '';
    };

    return (
        <div>
          <Box component="div">{GetSelf}</Box>
        </div>
    );
}
