import React, { useState } from "react";
import "./Admin.css";
import { supabase } from "../../supabase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Admin = () => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [imagess1, setimagess1] = useState([]);
  const [imagess2, setimagess2] = useState([]);
  const [imagess3, setimagess3] = useState([]);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image1, setimage1] = useState();
  const [image2, setimage2] = useState();
  const [image3, setimage3] = useState();

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handlePriceChange = (event) => {
    setPrice(event.target.value);
  };

  const handleImageChange = (event) => {
    setimage1(event.target.files[0]);
    const files = Array.from(event.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setimagess1(imageUrls);
  };

  const handleImageChange2 = (event) => {
    setimage2(event.target.files[0]);
    const files = Array.from(event.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setimagess2(imageUrls);
  };

  const handleImageChange3 = (event) => {
    setimage3(event.target.files[0]);
    const files = Array.from(event.target.files);
    const imageUrls = files.map((file) => URL.createObjectURL(file));
    setimagess3(imageUrls);
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const uploadImage = async (file, file2, file3) => {
    await supabase.storage
      .from("productimages")
      .upload(`${file.name}`, file)
      .then(async (val) => {
        const data = supabase.storage
          .from("productimages")
          .getPublicUrl(file.name);
        if (data) {
          await supabase.storage
            .from("productimages")
            .upload(`${file2.name}`, file2)
            .then(async (val3) => {
              const data2 = supabase.storage
                .from("productimages")
                .getPublicUrl(file2.name);
              if (data2) {
                await supabase.storage
                  .from("productimages")
                  .upload(`${file3.name}`, file3)
                  .then(async (val4) => {
                    const data3 = supabase.storage
                      .from("productimages")
                      .getPublicUrl(file3.name);
                    if (data3) {
                      await supabase
                        .from("products")
                        .insert([
                          {
                            title: title,
                            price: price,
                            category: category,
                            image01: data.data.publicUrl,
                            image02: data2.data.publicUrl,
                            image03: data3.data.publicUrl,
                            desc: description,
                          },
                        ])
                        .then((val2) => {
                          window.scrollTo({
                            top: 0,
                            behavior: "smooth",
                          });
                          toast.success("Submit successfully");
                        });
                    }
                  });
              }
            });
        }
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    uploadImage(image1, image2, image3);

    setTitle("");
    setPrice("");
    setimagess1([]);
    setimagess2([]);
    setimagess3([]);
    setCategory("");
    setDescription("");
  };

  return (
    <div className="admin-page">
      <ToastContainer />
      <h1>Add Product</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={handleTitleChange}
          required
        />

        <label htmlFor="price">Price:</label>
        <input
          type="number"
          id="price"
          value={price}
          onChange={handlePriceChange}
          required
        />

        <label htmlFor="images">Images 1:</label>
        <div className="image-container">
          {imagess1.map((imageUrl, index) => (
            <img key={index} src={imageUrl} alt={`Product Image ${index}`} />
          ))}
        </div>
        <input
          type="file"
          id="images"
          multiple
          onChange={handleImageChange}
          required
        />

        <label htmlFor="images">Images 2:</label>
        <div className="image-container">
          {imagess2.map((imageUrl, index) => (
            <img key={index} src={imageUrl} alt={`Product Image ${index}`} />
          ))}
        </div>
        <input
          type="file"
          id="images"
          multiple
          onChange={handleImageChange2}
          required
        />

        <label htmlFor="images">Images 3:</label>
        <div className="image-container">
          {imagess3.map((imageUrl, index) => (
            <img key={index} src={imageUrl} alt={`Product Image ${index}`} />
          ))}
        </div>
        <input
          type="file"
          id="images"
          multiple
          onChange={handleImageChange3}
          required
        />

        <label htmlFor="category">Category:</label>
        <select
          id="category"
          value={category}
          onChange={handleCategoryChange}
          required
        >
          <option value="">Select a category</option>
          <option value="Bread">Bread</option>
          <option value="Burger">Burger</option>
          <option value="Pizza">Pizza</option>
        </select>

        <label htmlFor="description">Description:</label>
        <textarea
          id="description"
          value={description}
          onChange={handleDescriptionChange}
          required
        ></textarea>

        <button type="submit">Add Product</button>
      </form>
    </div>
  );
};
