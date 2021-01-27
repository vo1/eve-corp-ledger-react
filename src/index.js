import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import App from './App';
import client from './GraphQLClient';
import { ApolloProvider } from '@apollo/client';

ReactDOM.render(
    <React.StrictMode>
        <ApolloProvider client={client}>
        <div class="wrapper">
            <App />
        </div>
        </ApolloProvider>
    </React.StrictMode>,
    document.getElementById('root')

);
// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
