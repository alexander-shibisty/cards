import React from 'react';
import Menu from '../../components/Menu/index';
import { v4 as uuid4 } from 'uuid';

export default () => {
    const animalsArray = [
        'duck',
        'bear',
        'possum',
        'racoon',
        'rabbit',
        'hen',
        'wolf',
        'dog',
        'cat',
        'deer',
        'squirrel',
        'beaver',
        'elk',
        'fox',
        'boar',
        'hedgehog',
        'panda',
        'lion',
        'sheep',
        'snake',
        'giraffe',
        'zebra',
        'monkey',
        'hippopotamus',
        'kangaroo'
    ];

    const participleArray = [
        'sleeping',
        'seeing',
        'coming',
        'sitting',
        'lying',
        'writing',
    ];

    const getRandomArrayElement = (array) => {
        return array[Math.floor((Math.random()*array.length))];
    }

    const getRandomPlaceholder = () => {
        const placeholder = String(getRandomArrayElement(participleArray) + ' ' + getRandomArrayElement(animalsArray));
        const firstLetter = String(placeholder.charAt(0));
        const firstLetterCap = firstLetter.toUpperCase();
        const remainingLetters = String(placeholder.slice(1));
        const newPlaceholder = firstLetterCap + remainingLetters

        return newPlaceholder;
    };

    const createRoomHandler = (event) => {
        event.preventDefault();
        const element = event.currentTarget;
        const nameField = element['name'];
        const uuidV4 = uuid4();

        document.location.href = `/room/${uuidV4}?name=${nameField.value}`;
    }
    return (<>
        <Menu />

        <section className="home-content">
            <form action="#" onSubmit={(event) => { createRoomHandler(event); }}>
                <div className="form-field">
                    <label htmlFor="name">Room Name</label>
                    <input type="text" id="name" name="name" placeholder="Room Name" defaultValue={getRandomPlaceholder()} required />
                    <small>You can try <a href="#" onClick={() => { document.location.reload(); }}>random</a></small>
                </div>
                <div className="form-field">
                    <button>Create New Room</button>
                </div>
            </form>
        </section>
    </>);
}
