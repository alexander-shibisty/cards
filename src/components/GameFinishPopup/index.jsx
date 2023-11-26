import React, { useEffect } from 'react';

export default ({ show, restartGameHandler }) => {
    const restartFormHandler = (event) => {
        event.preventDefault();
        restartGameHandler(event);
    }

    return (
        <section id="popup-wrapper" className={show ? 'show' : 'hide'}>
            <div>
                <form action="#" onSubmit={(event) => { restartFormHandler(event); }}>
                    <div className="form-field">
                        <button>Restart</button>
                    </div>
                </form>
            </div>
        </section>
    );
}
