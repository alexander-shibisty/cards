import React, { useEffect } from 'react';

export default ({ playerName, setPlayerName, show }) => {
    const changeFormHandler = (event) => {
        event.preventDefault();
        const element = event.currentTarget;
        const playerNameField = element['name'];

        setPlayerName(playerNameField.value);
    }

    return (
        <section id="popup-wrapper" className={show ? 'show' : 'hide'}>
            <div>
                <form action="#" onSubmit={(event) => { changeFormHandler(event); }}>
                    <div className="form-field">
                        <input type="text" id="name" name="name" defaultValue={playerName} placeholder="Your name" required />
                    </div>
                    <div className="form-field">
                        <button>Change</button>
                    </div>
                </form>
            </div>
        </section>
    );
}
