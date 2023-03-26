import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';

function PlantInfo() {

  const router = useRouter();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );


  
  //define type plant
  interface Plant {
    id: number;
    name: string;
    type: string;
    sensor: number;
    hlevel : number;
    wlast_time: Date;
    w_auto: boolean;
   
  }

  //add some examaple info
  const [plant, setPlant] = useState<Plant>();
  //const [plant, setPlant] = useState(null);
  const [isWatering, setIsWatering] = useState(false);
  const [lastWatered, setLastWatered] = useState('');

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
      else{
        //get plant using id from supabase´
        async function getPlant(){
          //get plant using id on url
          const { data: plants, error } = await supabase
            .from<Plant>('plants')
            .select('*')
            .eq('id', router.query.id);
          //add to useState
          if (plants && plants.length > 0) {
            setPlant(plants[0] as Plant);
            console.log("plants",plants);
          } else {
            console.log("No plant found with the given id");
          }
        }
        getPlant();
      }
        
      
  },[router])

  const Container = styled.div`
  background-color: #2CAB5F;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const WaterButton = styled.button `background-color: #D7FFDB; color: black; padding: 10px 20px; margin-top: 20px; margin-bottom: 20px; border: none; border-radius: 10px; font-size: 20px; font-weight: bold; text-align: center; text-decoration: none; display: inline-block; cursor: pointer; &:hover { background-color: #00d415; color: black`;


  useEffect(() => {
    // Fetch plant information from API
    fetch('/api/plants/1')
      .then(response => response.json())
      .then(data => {
        setPlant(data);
        setLastWatered(data.lastWatered);
        setIsWatering(data.isWatering);
      })
      .catch(error => console.error(error));
  }, []);

  const handleWaterPlant = () => {
    // Make a POST request to water the plant
    fetch('/api/plants/1/water', {
      method: 'POST'
    })
      .then(response => response.json())
      .then(data => {
        setLastWatered(data.lastWatered);
      })
      .catch(error => console.error(error));
  };

  const handleToggleWatering = () => {
    // Make a POST request to toggle automatic watering
    fetch('/api/plants/1/toggle-watering', {
      method: 'POST'
    })
      .then(response => response.json())
      .then(data => {
        setIsWatering(data.isWatering);
      })
      .catch(error => console.error(error));

    setIsWatering(true);
  };

  return (
    Cookies.get('token') == null ?
    <div>
    </div>
    :
    <Container>
      <Image
        src="/logo.svg"
        alt="Picture of the author"
        width={200}
        height={200}
      />
      {plant ? (
        <>
          <h1 style={{
            color: 'white',
            fontSize: '35px',
            fontWeight: 'bold',
            marginTop: '50px',
            marginBottom: '40px',
            //center
            textAlign: 'center',
            //font size

          }}>{plant.name}</h1>
          <div style={{
            color: 'white',
            fontSize: '25px',
            fontWeight: 'bold',
            marginTop: '20px',
            marginBottom: '20px',
            //center
            textAlign: 'left',
            //font size
            //space between each <p>
            display: 'flex',
            flexDirection: 'column',
            

          
          }}>
          <p>Humidity Level: {plant.hlevel}</p>
          <br/>
          <p>Type: {plant.type}</p>
          <br/>
          <p>Sensor: {plant.sensor}</p>
          <br/>
          <p>Last time Watered: {lastWatered}</p>
          <br/>
          <p>Water Automatically: {plant.w_auto ? 'On' : 'Off'}</p>
          <br/>
          <label>
            <input
              type="checkbox"
              checked={isWatering}
              onChange={handleToggleWatering}
              
            />
            Water Automatically
          </label>
          <br />
          <WaterButton onClick={handleWaterPlant}>Water Plant</WaterButton>
          </div>
        </>
      ) : (
        <p>Loading plant information...</p>
      )}
    </Container>
  );
}

export default dynamic (() => Promise.resolve(PlantInfo), {ssr: false});
