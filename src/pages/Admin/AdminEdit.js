import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Admin.css";
import { supabase } from "../../supabase";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const AdminEdit = () => {
  const { id } = useParams();
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
      .upload(`${file?.name}`, file)
      .then(async (val) => {
        const data = supabase.storage
          .from("productimages")
          .getPublicUrl(file?.name);
        if (data) {
          await supabase.storage
            .from("productimages")
            .upload(`${file2?.name}`, file2)
            .then(async (val3) => {
              const data2 = supabase.storage
                .from("productimages")
                .getPublicUrl(file2?.name);
              if (data2) {
                await supabase.storage
                  .from("productimages")
                  .upload(`${file3?.name}`, file3)
                  .then(async (val4) => {
                    const data3 = supabase.storage
                      .from("productimages")
                      .getPublicUrl(file3?.name);
                    if (data3) {
                      console.log(data.data?.publicUrl)
                      await supabase
                        .from("products")
                        .update({
                          title: title,
                          price: price,
                          category: category,
                          image01: file?.name ? data.data?.publicUrl:image1,
                          image02: file2?.name ? data2.data?.publicUrl:image2,
                          image03: file3?.name ? data3.data?.publicUrl:image3,
                          desc: description,
                        })
                        .eq("id", id)
                        .then((val2) => {
                          window.scrollTo({
                            top: 0,
                            behavior: 'smooth',
                          });
                          toast.success("Edit successfully");
                        });
                    }
                  });
              }
            });
        }
      });
  };

  const handleUpdate = async () => {
    uploadImage(image1, image2, image3);
  };

  const handleCancel = () => {
    setTitle("");
    setPrice("");
    setimagess1([]);
    setimagess2([]);
    setimagess3([]);
    setCategory("");
    setDescription("");
  };

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select()
        .eq("id", id)
        .single();

      if (error) {
        throw error;
      }

      setTitle(data.title);
      setPrice(data.price);
      setimagess1([data.image01]);
      setimagess2([data.image02]);
      setimagess3([data.image03]);
      setCategory(data.category);
      setDescription(data.desc);


      
    } catch (error) {
      console.error("Error fetching product:", error.message);
    }
  };
  useEffect(() => {
    fetchProduct();

    
  }, [id]);

  return (
    <div className="edit-page">
      <ToastContainer />
      <h1>Edit Product</h1>
      <label htmlFor="title">Title:</label>
      <input
        type="text"
        id="title"
        value={title}
        onChange={handleTitleChange}
      />

      <label htmlFor="price">Price:</label>
      <input
        type="number"
        id="price"
        value={price}
        onChange={handlePriceChange}
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

      <button onClick={handleUpdate}>Update</button>
      <button onClick={handleCancel}>Cancel</button>
    </div>
  );
};
