import React, { useState } from "react";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/common-section/CommonSection";
import { Container, Row, Col } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios'
import Alert from '@mui/material/Alert';
import { useDispatch } from "react-redux";
import { supabase } from "../supabase";
import { Button } from "antd";

const Login = () => {
  const [state, setState] = useState({ email: '', password: '', loading: false })
  const [popup, setPopup] = useState({ open: false, message: '', status: '' })
  const navigator = useNavigate()


  const popUpTimer = (data) => {
    setTimeout(() => {
      setPopup({ ...popup, open: false })
      if (data === 'success') {
        navigator('/home')
      }
    }, 3000)
  }

  const submitHandler = async (e) => {
    e.preventDefault();
    setState({ ...state, loading: true })

    await supabase.auth.signInWithPassword({
      email: state.email,
      password: state.password,
    })
      .then(async (val) => {
        if (String(val?.error)?.split(':')[1]) {
          setState({ ...state, loading: false })
          setPopup({ ...popup, message: String(val.error).split(':')[1], open: true, status: 'error' })
          popUpTimer()
        } else {
          await supabase.from('profiles').select('*').eq('user_id', val.data.user.id).then((val) => {
            if (!val.error) {
              localStorage.setItem('role', val.data[0].role)
              navigator('/home')
              window.location.reload(false);
            }
          })
        }
      })


  };

  return (
    <Helmet title="Login">
      <CommonSection title="Login" />
      <section>
        <Container>
          <Row>
            <Col lg="6" md="6" sm="12" className="m-auto text-center">
              <form className="form mb-5" onSubmit={submitHandler}>
                <div className="form__group">
                  <input
                    type="email"
                    placeholder="Email"
                    required
                    onChange={(event) => {
                      setState({ ...state, email: event.target.value })
                    }}
                  />
                </div>
                <div className="form__group">
                  <input
                    type="password"
                    placeholder="Password"
                    required
                    onChange={(event) => {
                      setState({ ...state, password: event.target.value })
                    }}
                  />
                </div>


                <Button type="submit" onClick={submitHandler} className="addTOCart__btn" loading={state.loading}>
                  Sign in
                </Button>


                {popup.open && (popup.status === 'success' ?
                  <Alert style={{ marginTop: '2%' }} severity="success">{popup.message}</Alert> :
                  <Alert style={{ marginTop: '2%' }} severity="error">{popup.message}!</Alert>)}
              </form>
              <Link to="/register">
                Create an account
              </Link>
              <Link style={{ marginLeft: '2%' }} to="/forgetpasword">
                Forget password
              </Link>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Login;
