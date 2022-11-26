import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './WelcomeView.css';


function WelcomeView() {
    const [name, setName] = useState("")
    const navigate = useNavigate()
    const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value)
    }

    function navigateIfNameGiven() {
        if (name) {
            navigate('/chat', {state: {name}})
        }
    }

    const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            navigateIfNameGiven();
        }
    }

    const onClickHandler = () => {
        if (name) {
            navigateIfNameGiven()
        }
    }

    return (<div className='WelcomeView'>
        <h1>Welcome to Serverless Chat!</h1>
        <div className="inputContainer">
            <label htmlFor="nameInput">What is your name?</label>
            <input id="nameInput" type="string" onChange={handleInput} onKeyUp={handleKeyUp} value={name}></input>
            <button onClick={onClickHandler}>Connect</button>
        </div>
    </div>);
}

export default WelcomeView