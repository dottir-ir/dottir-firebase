import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
const Container = styled.div `
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;
const Title = styled.h1 `
  text-align: center;
  color: #1f2937;
  margin-bottom: 2rem;
`;
const Form = styled.form `
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
const Input = styled.input `
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: #2563eb;
  }
`;
const Button = styled.button `
  padding: 0.75rem;
  background-color: #2563eb;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  
  &:hover {
    background-color: #1d4ed8;
  }
`;
const ErrorMessage = styled.p `
  color: #dc2626;
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;
const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signIn(email, password);
            navigate('/cases');
        }
        catch (error) {
            setError('Failed to sign in. Please check your credentials.');
        }
    };
    return (_jsxs(Container, { children: [_jsx(Title, { children: "Login to MedCase" }), _jsxs(Form, { onSubmit: handleSubmit, children: [_jsx(Input, { type: "email", placeholder: "Email", value: email, onChange: (e) => setEmail(e.target.value), required: true }), _jsx(Input, { type: "password", placeholder: "Password", value: password, onChange: (e) => setPassword(e.target.value), required: true }), error && _jsx(ErrorMessage, { children: error }), _jsx(Button, { type: "submit", children: "Sign In" })] })] }));
};
export default Login;
