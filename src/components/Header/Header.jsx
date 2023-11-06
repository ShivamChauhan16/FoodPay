import React, { useRef, useEffect, useState } from "react";

import { Container } from "reactstrap";
import logo from "../../assets/images/res-logo.png";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Button from "@mui/material/Button";
import { cartUiActions } from "../../store/shopping-cart/cartUiSlice";

import "../../styles/header.css";
import { supabase } from "../../supabase";

const Header = () => {
  const menuRef = useRef(null);
  const headerRef = useRef(null);
  const totalQuantity = useSelector((state) => state.cart.totalQuantity);
  const dispatch = useDispatch();
  const [state, setState] = useState({ logoutButton: false });
  const [pageAuth, setpageAuth] = useState(false);

  useEffect(async () => {
    await supabase.auth.getUser().then((val) => {
      if (val?.data?.user?.id) {
        setpageAuth(true);
      } else {
        setpageAuth(false);
      }
    });
  }, []);

  const nav__links = pageAuth
    ? [
        {
          display: "Home",
          path: "/home",
        },
        {
          display: "Foods",
          path: "/foods",
        },
        {
          display: "Cart",
          path: "/cart",
        },
        {
          display: "Checkout",
          path: "/checkout",
        },
      ]
    : [
        {
          display: "Home",
          path: "/home",
        },
        {
          display: "Foods",
          path: "/foods",
        },
        {
          display: "Cart",
          path: "/cart",
        },
      ];
  const toggleMenu = () => menuRef.current.classList.toggle("show__menu");

  const toggleCart = () => {
    dispatch(cartUiActions.toggle());
  };

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (
        document.body.scrollTop > 80 ||
        document.documentElement.scrollTop > 80
      ) {
        headerRef.current.classList.add("header__shrink");
      } else {
        headerRef.current.classList.remove("header__shrink");
      }
    });

    return () => window.removeEventListener("scroll");
  }, []);

  const navigation = useNavigate();

  return (
    <header className="header" ref={headerRef}>
      <Container>
        <div className="nav__wrapper d-flex align-items-center justify-content-between">
          <div className="logo">
            <img src={logo} alt="logo" />
            <h5>Food Pay</h5>
          </div>

          {/* ======= menu ======= */}
          <div className="navigation" ref={menuRef} onClick={toggleMenu}>
            <div className="menu d-flex align-items-center gap-5">
              {nav__links.map((item, index) => (
                <NavLink
                  to={item.path}
                  key={index}
                  className={(navClass) =>
                    navClass.isActive ? "active__menu" : ""
                  }
                >
                  {item.display}
                </NavLink>
              ))}
            </div>
          </div>

          {/* ======== nav right icons ========= */}
          <div className="nav__right d-flex align-items-center gap-4">
            <span className="cart__icon" onClick={toggleCart}>
              <i class="ri-shopping-basket-line"></i>
              <span className="cart__badge">{totalQuantity}</span>
            </span>

            {pageAuth ? (
              <span
                className="user"
                onClick={() => {
                  setState({ ...state, logoutButton: !state.logoutButton });
                }}
              >
                <i class="ri-user-line"></i>
                {state.logoutButton && (
                  <>
                    <Button
                      onClick={() => {
                        navigation("/user");
                      }}
                      style={{
                        position: "absolute",
                        top: "70px",
                        right: "80px",
                        backgroundColor: "#df2020",
                        width: "94px",
                      }}
                      variant="contained"
                    >
                      User
                    </Button>
                    {localStorage.getItem("role") === "Admin" && (
                      <Button
                        style={{
                          position: "absolute",
                          top: "110px",
                          right: "80px",
                          backgroundColor: "#df2020",
                          width: "94px",
                        }}
                        onClick={() => {
                          navigation("/admin");
                        }}
                        variant="contained"
                      >
                        Admin
                      </Button>
                    )}
                    <Button
                      onClick={async () => {
                        localStorage.clear();
                        const { error } = await supabase.auth.signOut();
                        window.location.reload(false);
                      }}
                      style={{
                        position: "absolute",
                        top: localStorage.getItem("role") === "Admin" ? "150px":"110px",
                        right: "80px",
                        backgroundColor: "#df2020",
                      }}
                      variant="contained"
                    >
                      Logout
                    </Button>
                  </>
                )}
              </span>
            ) : (
              <>
                <span className="user">
                  <Link to="/login">
                    <i class="ri-user-line"></i>
                  </Link>
                </span>
              </>
            )}

            <span className="mobile__menu" onClick={toggleMenu}>
              <i class="ri-menu-line"></i>
            </span>
          </div>
        </div>
      </Container>
    </header>
  );
};

export default Header;
