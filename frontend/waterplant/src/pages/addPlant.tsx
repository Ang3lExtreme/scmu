import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import  { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { createClient } from '@supabase/supabase-js';
import {v4 as uuidv4} from 'uuid';

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  max-width: 400px;
  //center
  
`;

const InputField = styled.input`
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  box-sizing: border-box;
  border: none;
  color: #000;
  border-radius: 26px;
  background-color: #D7FFDB;
  &:focus {
    background-color: #fff;
    outline: none;
  }
  //make litter bigger
  width: 250px;
  height: 50px;
  font-size: 20px;

`;

const SubmitButton = styled.button`
  background-color: #0a970f;
  color: white;
  padding: 14px 20px;
  margin: 2px 0;
  border: 1px solid #ffffff;
  border-radius: 26px;
  cursor: pointer;
  &:hover {
    background-color: #3e8e41;
  }
  //make a litter longer
  width: 60%;
  height: 50px;
  font-size: 20px;,0
  text-align: center;
  //border color
  justify-content: center;
  display: flex;
  justify-content: center;
  align-items: center;

`;

const SelectField = styled.select`
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  box-sizing: border-box;
  border: none;
  border-radius: 26px;
  background-color: #D7FFDB;
  &:focus {
    background-color: #fff;
    outline: none;
  }
  //make litter bigger
  width: 250px;
  height: 50px;
  font-size: 20px;

`;

const Container = styled.div`
  background-color: #2CAB5F;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

interface Plant {
  id: number;
  name: string;
  type: string;
  sensor: number;
  hlevel : number;
  wlast_time: Date;
  w_auto: boolean;
 
}

interface Sensor {
  id: number;
  hlevel: number;
  plant_id: string;
  disp: boolean;
}

function addPlant() {
  const router = useRouter();
  
  const [name, setName] = useState('');
  const [plantType, setPlantType] = useState('');
  const [sensor, setSensor] = useState('');
  const [sensorList, setSensorList] = useState([]);

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  



  // Fetch sensor data from API
  useEffect(() => {
    //get all sensor
    supabase
      .from('sensor')
      .select('*')
      .then((response) => {
        //set sensorList only with sensor.disp ==false
        setSensorList(response.data.filter((sensor: Sensor) => sensor.disp == false));

        console.log(response.data);
      }
      )
    
  }, []);

  
  useEffect(() =>
  {
     //get token from cookie
      const token = Cookies.get('token');
      console.log("hey",token);
      //if token is null
      if(token == null)
      {
        //redirect to login page
        router.push("/");
      }
      
  },[router])

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log({ name, plantType, sensor });
    
    //add plant to database
    const uuid = uuidv4();
    console.log(uuid);
    supabase
      .from('plants')
      .insert([
        {
          id: uuid,
          name: name,
          type: plantType,
          sensor: sensor,
          hlevel: 0,
          wlast_time: null,
          w_auto: false,
          created_at: new Date()
        },

      ])
      .then((response) => {
        //update sensor.disp = true
        supabase
          .from('sensor')
          .update({ disp: true })
          .eq('id', sensor)
          .then((response) => {
            console.log(response.data);
          }
          )
      }
      )
    //redirect to home page
    router.push("/PlantPage");
  };

  return (
    Cookies.get('token') == null ?
    <div>
    </div>
    :
    <Container>
      <Image src="/logo.svg" alt="Waterplant Logo" width={200} height={200} />
      <h1 style={
        {
          color: 'white',
          fontSize: '35px',
          fontWeight: 'bold',
          marginTop: '20px',
          marginBottom: '20px',
          //center
          textAlign: 'center',
          //font size
        }
       }>Add Plant</h1>
      <FormContainer onSubmit={handleSubmit}>
        <InputField
          type="text"
          placeholder="Plant name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          style={{
            //color black
            color: 'black',
          }}
        />
        <SelectField value={plantType} onChange={(event) => setPlantType(event.target.value)}>
          <option value="">Select a plant type</option>
          <option value="Monstera Deliciosa">Monstera Deliciosa</option>
          <option value="Fiddle Leaf Fig">Fiddle Leaf Fig</option>
          <option value="Snake Plant">Snake Plant</option>
          <option value="Pothos">Pothos</option>
          <option value="ZZ Plant">ZZ Plant</option>
          <option value="Aloe Vera">Aloe Vera</option>
          <option value="Spider Plant">Spider Plant</option>
          <option value="Rubber Plant">Rubber Plant</option>
          <option value="Palm">Palm</option>
          <option value="Bamboo">Bamboo</option>
          <option value="Orchid">Orchid</option>
          <option value="Cactus">Cactus</option>
          <option value="Bonsai">Bonsai</option>
          <option value="Other">Other</option>
        </SelectField>
        <SelectField
        value={sensor}
        onChange={(event) => setSensor(event.target.value)}
        style={{
          //color black
          color: 'black',
        }}
      >
        <option value="">Select a sensor</option>
        {sensorList.map((sensor: Sensor) => (
          <option key={sensor.id} value={sensor.id}>{sensor.id}</option>
        ))}
      </SelectField>
        <SubmitButton type="submit">Add</SubmitButton>
      </FormContainer>
    </Container>
  );
}

export default dynamic (() => Promise.resolve(addPlant), {ssr: false});
