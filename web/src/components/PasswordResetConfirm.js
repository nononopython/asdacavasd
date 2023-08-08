import React, { useEffect, useState } from 'react';
import { Button, Form, Grid, Header, Image, Segment } from 'semantic-ui-react';
import { API, showError, showNotice } from '../helpers';
import { useSearchParams, useNavigate } from 'react-router-dom';


const PasswordResetConfirm = () => {
  const [inputs, setInputs] = useState({
    email: '',
    token: '',
    password: '',
  });

  const { email, token, password } = inputs;

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();  // Add this line

  const [searchParams, setSearchParams] = useSearchParams();
  useEffect(() => {
    let token = searchParams.get('token');
    let email = searchParams.get('email');
    setInputs({
      token,
      email,
      password: '',
    });
  }, []);



  async function handleSubmit(e) {
    if (!email || !password) return;
    if (password.length < 6) {
      showError('密码长度不得小于 6 位！');
      return;
    }
    if (password.length > 20) {
      showError('密码长度不得大于 20 位！');
      return;
    }
    setLoading(true);
    const res = await API.post(`/api/user/reset`, {
      email,
      token,
      password,
    });
    const { success, message } = res.data;
    if (success) {
      showNotice('密码已重置');
      navigate('/login'); 
    } else {
      showError(message);
    }
    setLoading(false);
  }

  function handlePasswordChange(e) {
    setInputs(inputs => ({ ...inputs, password: e.target.value }));
  }
  
  return (
    <Grid textAlign='center' style={{ marginTop: '48px' }}>
      <Grid.Column style={{ maxWidth: 450 }}>
        <Header as='h2' color='' textAlign='center'>
          <Image src='/logo.png' /> 密码重置确认
        </Header>
        <Form size='large'>
          <Segment>
            <Form.Input
              fluid
              icon='mail'
              iconPosition='left'
              placeholder='用户邮箱地址'
              name='email'
              value={email}
              readOnly
            />
            <Form.Input
              fluid
              icon='lock'
              iconPosition='left'
              placeholder='新密码，最短 6 位，最长 20 位'
              type='password'
              name='password'
              value={password}
              onChange={handlePasswordChange}
            />
            <Button
              color=''
              fluid
              size='large'
              onClick={handleSubmit}
              loading={loading}
            >
              提交
            </Button>
          </Segment>
        </Form>
      </Grid.Column>
    </Grid>
  );
};

export default PasswordResetConfirm;
