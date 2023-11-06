import React, { useRef, useState } from "react";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/common-section/CommonSection";
import { Container, Row, Col } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import axios from "axios";
import Alert from '@mui/material/Alert';



export const Forgetpassword = () => {

    const [state, setState] = useState({ email: '', loading: false, passwordReset: false, otp: '', password: '', rePassword: '' })
    const [popup, setPopup] = useState({ open: false, message: '', status: '' })
    const dispatch = useDispatch()
    const navigator = useNavigate()

    const popUpTimer = (data) => {
        setTimeout(() => {
            setPopup({ ...popup, open: false })
            if (data === 'success') {
                navigator('/home')
            }
            if (data === 'ResetPassword') {
            }
            if (data === 'forgetpassword') {
                setState({ ...state,passwordReset: true })
            }
        }, 3000)
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        setState({ ...state, loading: true })
        await axios.post(`http://localhost:4000/foodpay/api/v1/forgetpassword`, { email: state.email }).then((res) => {
            if (res.status === 200) {
                setState({ ...state, loading: false})
                setPopup({ ...popup, open: true, status: 'forgetpassword', message: res.data.message })
                popUpTimer('forgetpassword')
            }
        }).catch((err) => {
            setState({ ...state, loading: false })
            setPopup({ ...popup, open: true, status: 'error', message: err.response.data.message })
            popUpTimer()
        })
    };

    const submitHandlerResetPassword = async (e) => {
        e.preventDefault();
        setState({ ...state, loading: true })
        await axios.post(`http://localhost:4000/foodpay/api/v1/resetpassword`, {
            code: state.otp,
            email: state.email,
            newPassword: state.password,
            reNewPassword: state.rePassword
        }).then((res) => {
            if (res.status === 200) {
                setState({ ...state, loading: false, passwordReset: true })
                setPopup({ ...popup, open: true, status: 'success', message: res.data.message })
                popUpTimer('ResetPassword')
            }
        }).catch((err) => {
            setState({ ...state, loading: false, passwordReset: false })
            setPopup({ ...popup, open: true, status: 'error', message: err.response.data.message })
            popUpTimer('error')
        })
    }

    return (
        <Helmet title="Signup">
            <CommonSection title="Signup" />
            <section>
                <Container>
                    <Row>
                        <Col lg="6" md="6" sm="12" className="m-auto text-center">
                            {!state.passwordReset ?
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
                                    <button type="submit" className="addTOCart__btn">
                                        {state.loading ? 'wait' : "SEND"}
                                    </button>
                                    {popup.open && (popup.status === 'success' ?
                                        <Alert style={{ marginTop: '2%' }} severity="success">{popup.message}</Alert> :
                                        <Alert style={{ marginTop: '2%' }} severity="error">{popup.message}!</Alert>)}
                                </form> :
                                <form className="form mb-5" onSubmit={submitHandlerResetPassword}>
                                    <div className="form__group">
                                        <input
                                            type="number"
                                            placeholder="OTP"
                                            required
                                            onChange={(event) => {
                                                setState({ ...state, otp: event.target.value })
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
                                    <div className="form__group">
                                        <input
                                            type="password"
                                            placeholder="Re-Password"
                                            required
                                            onChange={(event) => {
                                                setState({ ...state, rePassword: event.target.value })
                                            }}
                                        />
                                    </div>
                                    <button type="submit" className="addTOCart__btn">
                                        {state.loading ? 'wait' : "SEND"}
                                    </button>
                                    {popup.open && (popup.status === 'success' ?
                                        <Alert style={{ marginTop: '2%' }} severity="success">{popup.message}</Alert> :
                                        <Alert style={{ marginTop: '2%' }} severity="error">{popup.message}!</Alert>)}
                                </form>
                            }
                            <Link to="/login">Already have an account? Login</Link>
                        </Col>
                    </Row>
                </Container>
            </section>
        </Helmet>
    )
}