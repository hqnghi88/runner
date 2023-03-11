import React, { Suspense, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import classes from './App.module.css';
import 'bootstrap/dist/css/bootstrap.min.css'

import NavBar from './compenents/NavBar/NavBar';
import ScrollToTop from './compenents/ScrollToTop/ScrollToTop';
import LoadingSpinner from './compenents/LoadingSpinner/LoadingSpinner';

import { useSelector, useDispatch } from 'react-redux';
import { fetchQuestionListData } from './store/Questions/questions-actions';
import { getLoggedIn } from './store/Auth/auth-actions'
import Message from './compenents/Message/Message';

import { messageActions } from './store/Message/message-slice'
import FooterFAB from './compenents/FooterFAB/FooterFAB';

// const Home = React.lazy(() => import('./pages/Home/Home'));
const QuestionList = React.lazy(() => import('./pages/QuestionList/QuestionList'));
const Question = React.lazy(() => import('./pages/Question/Question'));
const NotFound = React.lazy(() => import('./pages/NotFound/NotFound'));

const Account = React.lazy(() => import('./pages/Account/Account'));
const Customform = React.lazy(() => import('./compenents/Customform/Customform'));


export const LOGIN = 'login', REGISTER = 'register', CHANGEPASSWORD = 'changePassword';

export const errorFormatter = err => {
    let errorString = `${JSON.stringify(err)} \n`;
    err.status && (errorString += `status: ${err.status} \n`);
    err.statusText && (errorString += `statusText: ${err.statusText} \n`);
    err.type && (errorString += `type: ${err.type} \n`);
    err.redirected && (errorString += `redirected: ${err.redirected} \n`);
    err.ok && (errorString += `ok: ${err.ok} \n`);
    err.headers && (errorString += `headers: ${JSON.stringify(err.headers)} \n`);
    err.body && (errorString += `body: ${JSON.stringify(err.body)} \n`);
    return <div style={{ display: 'inline', whiteSpace: 'pre-line' }}>{errorString}</div>;
}

const App = () => {

    const dispatch = useDispatch();
    const loginState = useSelector(state => state.auth);

    useEffect(() => {
        dispatch(getLoggedIn());
        dispatch(fetchQuestionListData());
        dispatch(messageActions.set({
            type: 'info',
            message: 'Welcome to website !',
            description: 'This website is to solve coding questions and check against testcases'
        }))
    }, [dispatch]);

    return (
        <div className={classes.App}>
            <NavBar />
            <Message />
            <FooterFAB />
            <ScrollToTop />
            <div className={classes.routes}>
                <Suspense
                    fallback={<div className='centered'><LoadingSpinner /></div>}>
                    <Routes>
                        {/* <Route exact path='/' element={<Home />} /> */}
                        <Route exact path='/' element={<Navigate replace to='/questions' />} />
                        <Route exact path='/questions' element={!loginState.loggedIn ? <Customform pageType={LOGIN} /> : <QuestionList />} />
                        <Route exact path='/questions/:id' element={!loginState.loggedIn ? <Customform pageType={LOGIN} /> : <Question />} />
                        <Route exact path='/account' element={!loginState.loggedIn ? <Customform pageType={LOGIN} /> : <Account />} />
                        {/* <Route exact path='/leaderboard' element={!loginState.loggedIn ? <Customform pageType={LOGIN} /> : <LeaderBoard />} />
                        <Route exact path='/codes/:id' element={!loginState.loggedIn ? <Customform pageType={LOGIN} /> : <Codes />} />
                        <Route exact path='/login' element={!loginState.loggedIn ? <Customform pageType={LOGIN} /> : <Navigate replace to='/questions' />} />
                        <Route exact path='/register' element={!loginState.loggedIn ? <Customform pageType={REGISTER} /> : <Navigate replace to='/questions' />} />
                        <Route exact path='/changePassword' element={<Customform pageType={CHANGEPASSWORD} />} />
                        <Route exact path='/dashboard' element={loginState.loggedIn ? <DashBoard /> : <Navigate replace to='/questions' />} />
                        <Route exact path='/notes' element={!loginState.loggedIn ? <Customform pageType={LOGIN} /> : <Notes />} />
                        <Route exact path='/linkShortner' element={<LinkShortner />} />
                        <Route exact path='/serverLogs' element={!loginState.loggedIn ? <Customform pageType={LOGIN} /> : <ServerLogs />} /> */}
                        <Route exact path='*' element={<NotFound />} />
                    </Routes>
                </Suspense>
            </div>
        </div>
    );
}

export default App;