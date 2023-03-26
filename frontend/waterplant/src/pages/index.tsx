import React, { useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import {useRouter} from 'next/router';
import dynamic from 'next/dynamic';
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react';
import { createClient } from '@supabase/supabase-js';
import Cookies from 'js-cookie'



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
  color: #000;
  width: 250px;
  height: 50px;
  font-size: 20px;

`;

const SubmitButton = styled.button`
  background-color: #0a970f;
  color: white;
  padding: 14px 20px;
  margin: 8px 0;
  border: 1px solid #ffffff;
  border-radius: 26px;
  cursor: pointer;
  &:hover {
    background-color: #3e8e41;
  }
  //make a litter longer
  width: 60%;
  font-size: 20px;
  //border color
`;

const Container = styled.div`
  background-color: #2CAB5F;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Logo = styled.img`
  width: 200px;
  margin-bottom: 50px;
`;


interface HomeInterface {
  onSubmit: (username: string, password: string) => void;
}

function Home({ onSubmit }: HomeInterface) {
  const router = useRouter();
  //get values from .env.local
  const supabaseUrl =  process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  //create a client
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  console.log(supabaseUrl)

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const supabaseClient = useSupabaseClient();  
  const user = useUser();
  const [data, setData] = useState();
  
  

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const { data,error} = await supabase.auth.signInWithPassword({
      email: username,
      password: password,
    })
    if (error) {
      console.log(error)
    }
    else{
      router.push('/PlantPage');
      console.log( data.session.access_token)
      //save token on cookie
      Cookies.set('token', data.session.access_token)



      
    }
  
  };
  

  return (
    <Container>
      <Image
        src="/logo.svg"
        alt="Picture of the author"
        width={200}
        height={200}
      />
    <FormContainer onSubmit={handleSubmit}>
      <InputField type="text" placeholder="Username" value={username} onChange={handleUsernameChange} />
      <InputField type="password" placeholder="Password" value={password} onChange={handlePasswordChange} />
      <SubmitButton type="submit">Login</SubmitButton>
    </FormContainer>
    </Container>
    
  );
}

export default dynamic (() => Promise.resolve(Home), {ssr: false});

