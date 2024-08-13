import React, { useState, useEffect } from 'react';
import { createConference } from '../../services/conService';
import { useNavigate } from 'react-router-dom';
import './styles/CreateConferences.css'
import { uploadPic } from '../../services/authService';

function CreateConferences() {
  const [startDate, setStartDate] = useState('text');
  const [endDate, setEndDate] = useState('text');
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);

  const printErrorMsg = (msg) => {
    document.getElementById('message').textContent = msg;
  }

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handlUpload = async () => {
    try {
      if (!selectedFile) {
        return;
      }
      const formData = new FormData();
      formData.append('file', selectedFile);
      const res = await uploadPic(formData);
      console.log('file uploaded', res);

      return res;

    } catch (error) {
      console.log('error uploading file', error);
    }
  };


  async function createCon() {


    const title = document.getElementById('title').value;
    const country = document.getElementById('country').value;
    const city = document.getElementById('city').value;
    const startDate = new Date(document.getElementById('start-date').value);
    const endDate = new Date(document.getElementById('end-date').value);
    const description = document.getElementById('description').value;
    const picURL = await handlUpload();
    const location = city + ', ' + country;

    console.log('picURL', picURL);

    const locationValidation = (location) => {
      // we dont know how to implement it yet
      return true;
    }

    const datesValidation = (startDate, endDate) => {
      const now = new Date();
      const start = new Date(startDate);
      const end = new Date(endDate);

      // Check if start date is at least 24 hours from the current time
      if ((start - now) < 24 * 60 * 60 * 1000) {
        return false;
      }

      // Check if end date is after start date
      if ((end - start) > 0) {
        return true;
      }

      return false;
    };


    // checking if there are empty fields
    if (!(title && description && country && city && startDate && endDate))
      printErrorMsg("Error! fields can't be empty");

    //checking validation of location
    else if (!locationValidation(location))
      printErrorMsg("Error! location is invalid")

    //checking validation of the dates
    else if (!datesValidation(startDate, endDate))
      printErrorMsg("Error! dates are invalid")

    else {
      printErrorMsg('');

      /* Packs data to 'JSON' format to send via web */
      const data = {
        title: title,
        location: location,
        description: description,
        startDate: startDate,
        endDate: endDate,
        picURL: picURL
      }

      console.log(data);

      const res = await createConference(data);
      if (res && res.status === 200)
        navigate('/myConferences');
      else
        printErrorMsg(res);
      console.log(res);
    }


  }


  return (

    <div>
      <h2>Create Conference</h2>
      <link href="https://font.googleapis.com/css2?family=Poppins:wght@400;500&display=swap" rel="stylesheet"></link>
      <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'></link>
      <form>
        <div className='create-div'>
          <input className='create-field' type="text" id="title" placeholder="Title" required />
        </div>

        <div className='create-div'>
          <input className='create-field' type="text" id="country" placeholder="Country" required />
        </div>
        <div className='create-div'>
          <input className='create-field' type="text" id="city" placeholder="City" required />
        </div>

        <div className='create-div'>
          <input className='create-field' id="start-date" type={startDate} placeholder="Start date" onFocus={() => { setStartDate('Date') }} onBlur={() => { document.getElementById('start-date').value ? setStartDate('Date') : setStartDate('text') }} required />
        </div>

        <div className='create-div'>
          <input className='create-field' type={endDate} placeholder='End date' id="end-date" onFocus={() => { setEndDate('Date') }} onBlur={() => { document.getElementById('end-date').value ? setEndDate('Date') : setEndDate('text') }} required />
        </div>

        <div className='create-div'>
          <input className='create-field' type="text" id="description" placeholder="Description" required />
        </div>

        <div className='create-div'>
          <input className='create-field' type="file" id="conference-picture" placeholder="Conference picture URL" />
        </div>

        <p id="message"></p>

        <input type="button" id='button' onClick={createCon} value='Create'></input>
      </form>
    </div>

  );
}

export default CreateConferences;
