import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import Link from 'next/link';
import { AiFillPlusCircle,AiFillEye } from "react-icons/ai";
import { useRouter } from 'next/router';
import dynamic from "next/dynamic";
import Cookies from 'js-cookie';
import { createClient } from '@supabase/supabase-js';



const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 auto;
  max-width: 400px;
`;

const InputField = styled.input`
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
  width: 50%;
  height: 50px;
  font-size: 20px;
  //align left
  margin-left: -60px;
  //center text
  text-align: center;
  //border color
  justify-content: center;
  display: flex;
  justify-content: center;
  align-items: center;

`;

const PlantList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const PlantItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
`;

const PlantName = styled.span`
  font-size: 24px;
  margin-right: 16px;
`;

const PlantLink = styled.a`
  color: white;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
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
  id: string;
  name: string;
}




//Cannot read properties of null (reading 'useState')
 



 
     

function PlantPage() {
  const router = useRouter();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
  const [plantlist, setPlants] = useState<Plant[]>([]);


  //useeffect to check token if not load another page
  //useeffect to get plants from supabase

  useEffect( () =>
  {

    async function getPlants(){
      //fetch and add type to plant list
      const { data: plants, error } = await supabase
      .from<Plant>('plants')
      .select('*');

      //add to useState
      setPlants(plants as Plant[]);




      console.log("plants",plants);

    }
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
        getPlants();
        
      }

  },[router])
  
  return (
    Cookies.get('token') == null ? (
      
    <></>
    ) :
    <Container>
      <Image
        src="/logo.svg"
        alt="Picture of the author"
        width={200}
        height={200}
      />
       <SubmitButton  onClick={() => router.push("/addPlant")}>Add Plant <AiFillPlusCircle style={{
          //put them on the right
          marginLeft: '25px',
          marginRight: '0px',
          //make them bigger
          fontSize: '30px',

       }}/></SubmitButton>
       <h1 style={
        {
          color: 'white',
          fontSize: '24px',
          fontWeight: 'bold',
          marginTop: '20px',
          marginLeft: '-100px',
          marginBottom: '20px'
        }
       }>Plant List:</h1>
      <PlantList>
        {plantlist.map((plant) => (
          <PlantItem key={plant.id}>
            <Link href={`/plant/${plant.id}`} passHref>
              <PlantLink>
                <div style={{
                  //make a box D7FFDB
                  backgroundColor: '#D7FFDB',
                  borderRadius: '26px',
                  width: '255px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'left',
                  //center
                  //text color black
                  color: 'black',
                  //padding
                  paddingLeft: '15px',
                  
                }}><PlantName >{plant.name} </PlantName><AiFillEye style={{
                  //put them on the right
                  marginLeft: 'auto',
                  marginRight: '6px',
                  fontSize: '30px',

                }}/></div>
              </PlantLink>
            </Link>
          </PlantItem>
        ))}
      </PlantList>
    </Container>
  );
}



export default dynamic (() => Promise.resolve(PlantPage), {ssr: false});
