import React, { useState } from 'react';

function CreateConferences() {
  const [inputDateType, setInputDateType] = useState('text');
  const [inputDurationTimeType, setInputDurationTimeType] = useState('text');


  function createCon() {
    const title = document.getElementById('title').value;
    const maxParticipants = document.getElementById('max-participants').value;
    const location = document.getElementById('location').value;
    const description = document.getElementById('description').value;
    const durationTime = document.getElementById('time').value;
    const date = document.getElementById('date').value;

    const data = {
      title,
      maxParticipants,
      location,
      description,
      durationTime,
      date
    }

    console.log(data);
  }

  return (
    <div>
      <h2>Create Conference Form</h2>
      <link href="https://font.googleapis.com/css2?family=Poppins:wght@400;500&display=swap" rel="stylesheet"></link>
      <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'></link>
      <form>
        <div className='create-div'>
          <input className='create-field' type="text" id="title" placeholder="Title" required />
        </div>

        <div className='create-div'>
          <input className='create-field' type="text" id="max-participants" placeholder="Max participants" required />
        </div>

        <div className='create-div'>
          <input className='create-field' type="text" id="location" placeholder="Location" required />
        </div>

        <div className='create-div'>
          <input className='create-field' id="date" type={inputDateType} placeholder="Date and starting time" onFocus={() => { setInputDateType('datetime-local') }} onBlur={() => { document.getElementById('date').value ? setInputDateType('datetime-local') : setInputDateType('text') }} required />
        </div>

        <div className='create-div'>
          <input className='create-field' type={inputDurationTimeType} placeholder='Duration time' id="time" min="00:00" max="5:00" onFocus={() => { setInputDurationTimeType('time') }} onBlur={() => { document.getElementById('time').value ? setInputDurationTimeType('time') : setInputDurationTimeType('text') }} required />
        </div>

        <div className='create-div'>
          <input className='create-field' type="text" id="description" placeholder="Description" required />
        </div>

        <p id="message"></p>
        <input type="button" onClick={createCon} value='Create'></input>
      </form>
    </div>
  );
}

export default CreateConferences;
