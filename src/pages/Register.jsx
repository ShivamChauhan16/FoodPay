import React, { useState } from "react";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/common-section/CommonSection";
import { Container, Row, Col } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import Alert from '@mui/material/Alert';
import { supabase } from "../supabase";
import { Button } from 'antd';

const Register = () => {

  const [state, setState] = useState({ name: '', email: '', password: '', rePassword: '', loading: false })
  const [popup, setPopup] = useState({ open: false, message: '', status: '' })
  const navigator = useNavigate()

  const popupclose = () => {
    setTimeout(() => {
      setPopup({ ...popup, open: false })
    },2000)
  }




  const submitHandler = async (e) => {
    e.preventDefault();
    setState({ ...state, loading: true })
    await supabase.auth.signUp({
      email: state.email,
      password: state.password,
    }).then(async (val) => {
      if (!val.error) {
        await supabase
          .from("profiles")
          .select('*')
          .eq("email", state.email)
          .then(async (valll) => {
            if (valll.data.length == 0) {
              await supabase
                .from("profiles")
                .insert([
                  {
                    email: state.email,
                    name: state.name,
                    role: 'User',
                    user_id: val.data.user.id
                  }])
                .then((vall) => {
                  if (!vall.error) {
                    setState({ ...state, loading: false })
                    setPopup({ ...popup, open: true, message: 'Email Sent successfully', status: 'success' })
                    popupclose()
                    
                  } else {
                    setState({ ...state, loading: false })
                    setPopup({ ...popup, open: true, message: 'Network Error', status: 'error' })
                    popupclose()
                  }
                })
            } else {
              setState({ ...state, loading: false })
              setPopup({ ...popup, open: true, message: 'email already exists', status: 'error' })
              popupclose()
            }
          })

      }

    })


  };


  return (
    <Helmet title="Signup">
      <CommonSection title="Signup" />
      <section>
        <Container>
          <Row>
            <Col lg="6" md="6" sm="12" className="m-auto text-center">
              <form className="form mb-5" onSubmit={submitHandler}>
                <div className="form__group">
                  <input
                    type="text"
                    placeholder="Full name"
                    required
                    onChange={(event) => {
                      setState({ ...state, name: event.target.value })
                    }}
                  />
                </div>
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
                  Sign Up
                </Button>

                {popup.open && (popup.status === 'success' ?
                  <Alert style={{ marginTop: '2%' }} severity="success">{popup.message}</Alert> :
                  <Alert style={{ marginTop: '2%' }} severity="error">{popup.message}!</Alert>)}
              </form>
              <Link to="/login">Already have an account? Login</Link>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default Register;
