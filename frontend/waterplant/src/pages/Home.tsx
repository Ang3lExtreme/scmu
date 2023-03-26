import React, { useState } from 'react';
import styled from 'styled-components';
import logo from '../images/logo.svg';
import { redirect } from "react-router-dom";


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
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  //onSubmit(username, password);
  console.log("hello");
  return redirect("/plantpage");
  };

  return (
    <Container>
    <Logo src={logo} alt="Logo" />
    <FormContainer onSubmit={handleSubmit}>
      <InputField type="text" placeholder="Username" value={username} onChange={handleUsernameChange} />
      <InputField type="password" placeholder="Password" value={password} onChange={handlePasswordChange} />
    </FormContainer>
      <button onClick={() => redirect("/plantpage")}>Login</button>
    </Container>
    
  );
}

export default Home;
