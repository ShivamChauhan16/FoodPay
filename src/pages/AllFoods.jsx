import React, { useEffect, useState } from "react";
import Helmet from "../components/Helmet/Helmet";
import CommonSection from "../components/UI/common-section/CommonSection";

import { Container, Row, Col } from "reactstrap";

import { products } from "./data";
import ProductCard from "../components/UI/product-card/ProductCard";
import ReactPaginate from "react-paginate";

import "../styles/all-foods.css";
import "../styles/pagination.css";
import { supabase } from "../supabase";
import { Loader } from "../components/Loader/Loader";
import annyang from "annyang";

const AllFoods = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const [pageNumber, setPageNumber] = useState(0);
  const [AllProduct, setAllProduct] = useState();

  const getAllProduct = async () => {
    await supabase
      .from("products")
      .select("*")
      .then((val) => {
        setAllProduct(val.data);
      });
  };

  useEffect(() => {
    getAllProduct();
  }, []);

  const searchedProduct = AllProduct?.filter((item) => {
    if (searchTerm?.value === "") {
      return item;
    }
    if (item.title.toLowerCase().includes(searchTerm.toLowerCase())) {
      return item;
    } else {
      return console.log("not found");
    }
  });

  const productPerPage = 12;
  const visitedPage = pageNumber * productPerPage;
  const displayPage = searchedProduct?.slice(
    visitedPage,
    visitedPage + productPerPage
  );

  const pageCount = Math.ceil(searchedProduct?.length / productPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const [searchText, setSearchText] = useState("");
  const [isListening, setIsListening] = useState(false);

  useEffect(() => {
    const handleSpeechResult = (event) => {
      const transcript = event[0];
      setSearchText(transcript);
      // Perform search or other actions with the transcript
    };

    if (annyang) {
      annyang.addCallback("result", handleSpeechResult);

      if (isListening) {
        annyang.start();
      }

      return () => {
        annyang.removeCallback("result", handleSpeechResult);
        annyang.abort();
      };
    }
  }, [isListening]);

  useEffect(() => {
    setSearchTerm(searchText?.trim());
  }, [searchText]);

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    // Perform search or other actions with the search text
  };

  const toggleListening = () => {
    if (isListening) {
      annyang.abort();
    } else {
      annyang.start();
    }
    setIsListening(!isListening);
  };

  return (
    <Helmet title="All-Foods">
      <CommonSection title="All Foods" />

      <section>
        <Container>
          <Row>
            <Col lg="6" md="6" sm="6" xs="12">
              <div className="search__widget d-flex align-items-center justify-content-between ">
                <input
                  type="text"
                  placeholder="I'm looking for...."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  style={{
                    border: "none",
                    outline: "none",
                    marginLeft: "2%",
                    marginRight: "2%",
                  }}
                  onClick={toggleListening}
                >
                  {isListening ? (
                    <i class="ri-mic-line"></i>
                  ) : (
                    <i class="ri-mic-off-line"></i>
                  )}
                </button>
                <span>
                  <i class="ri-search-line"></i>
                </span>
              </div>
            </Col>
            <Col lg="6" md="6" sm="6" xs="12" className="mb-5">
              <div className="sorting__widget text-end">
                <select className="w-50">
                  <option>Default</option>
                  <option value="ascending">Alphabetically, A-Z</option>
                  <option value="descending">Alphabetically, Z-A</option>
                  <option value="high-price">High Price</option>
                  <option value="low-price">Low Price</option>
                </select>
              </div>
            </Col>

            {displayPage ? (
              displayPage.map((item) => (
                <Col lg="3" md="4" sm="6" xs="6" key={item.id} className="mb-4">
                  <ProductCard item={item} />
                </Col>
              ))
            ) : (
              <Loader />
            )}

            <div>
              <ReactPaginate
                pageCount={pageCount}
                onPageChange={changePage}
                previousLabel={"Prev"}
                nextLabel={"Next"}
                containerClassName=" paginationBttns "
              />
            </div>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default AllFoods;
