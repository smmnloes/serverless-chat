import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RestApi } from '../services/rest-api';
import './WelcomeView.css';


function WelcomeView() {
    const [name, setName] = useState("")
    const [errorMessage, setErrorMessage] = useState("")
    const navigate = useNavigate()
    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setErrorMessage('')
        setName(event.target.value)
    }

    function navigateIfNameGivenAndAvailable() {

        if (name) {
            RestApi.getUsernameAvailable(name).then(isAvailable => {
                if (isAvailable) {
                    navigate('/chat', { state: { name } })
                } else {
                    setErrorMessage('User with this name already connected')
                }
            })
        }
    }

    const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            navigateIfNameGivenAndAvailable();
        }
    }

    const onClickHandler = () => {
        if (name) {
            navigateIfNameGivenAndAvailable()
        }
    }


    return (<div className='WelcomeView'>
        <h1>Welcome to Serverless Chat!</h1>
        <div className="inputContainer">
        <div className='ErrorMessage'><span>{errorMessage}</span></div>
            <label htmlFor="nameInput">What is your name?</label>
            <input id="nameInput" type="string" onChange={handleInput} onKeyUp={handleKeyUp} value={name}></input>
            <button onClick={onClickHandler}>Connect</button>
        </div>
    </div>);
}

export default WelcomeView