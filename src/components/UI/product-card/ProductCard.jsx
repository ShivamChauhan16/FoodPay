import React, { useEffect } from "react";

import "../../../styles/product-card.css";

import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { useDispatch } from "react-redux";
import { cartActions } from "../../../store/shopping-cart/cartSlice";
import { supabase } from "../../../supabase";

const ProductCard = (props) => {
  const { id, title, image01, price } = props.item;
  const dispatch = useDispatch();

  const addToCart = () => {
    dispatch(
      cartActions.addItem({
        id,
        title,
        image01,
        price,
      })
    );
  };

  const navigation = useNavigate();

  //to={`/foods/${id}`

  return (
    <div>
      <ToastContainer />
      <div className="product__item">
        <div
          onClick={() => {
            navigation(`/foods/${id}`);
            window.location.reload();
          }}
          className="product__img"
        >
          <img src={image01} alt="product-img" className="w-50" />
        </div>

        <div className="product__content">
          <h5>{title}</h5>
          <div className=" d-flex align-items-center justify-content-between ">
            <span className="product__price">₹{price}</span>
            <button className="addTOCart__btn" onClick={addToCart}>
              Add to Cart
            </button>
          </div>
          <div
            style={{
              marginTop: "5%",
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            {localStorage.getItem("role") === "Admin" && (
              <>
                <button
                  className="addTOCart__btn_1"
                  onClick={() => {
                    navigation(`/admin/edit/${id}`);
                  }}
                >
                  Edit
                </button>
                <button
                  className="addTOCart__btn_1"
                  onClick={async () => {
                    await supabase
                      .from("products")
                      .delete()
                      .eq("id", id)
                      .then((val) => {
                        window.scrollTo({
                          top: 0,
                          behavior: "smooth",
                        });
                        toast.success("successfully Delete");
                      });
                  }}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
