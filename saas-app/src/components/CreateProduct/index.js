import React, { useState, useEffect } from "react";
import UploadWidget from "./UploadWidget/UploadWidget";
import checkToken from "../../Middleware";
import "./index.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import baseURL from "../../links";

const CreateProduct = () => {
  const navigate = useNavigate();
  useEffect(() => {
    // Use the middleware function to check the token
    const isAuthenticated = checkToken();
    if (!isAuthenticated) {
      // Redirect or handle unauthorized access
      // For example, redirect to the login page
      console.log("not authenticated");
      navigate("/");
    } else {
      console.log("User authenticated");
    }
  }, []);
  const [boldText, setBoldText] = useState(""); // New state to store bold text
  const [url, updateUrl] = useState();
  const [error, updateError] = useState();
  const designerid = localStorage.getItem("designerid");
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [tags, setTags] = useState("");
  const [category, setCategory] = useState("");
  const [archive, setArchive] = useState(false);
  const [image, setImage] = useState("");
  const [borderColor1, setBackgroundColor1] = useState("");
  const [shadowColor1, setShadowColor1] = useState("white");
  const [borderColor, setBackgroundColor2] = useState("");
  const [shadowColor, setShadowColor2] = useState("white");

  const updateStateFnCall = async () => {
    const data = {
      designerid: designerid,
      name: name,
      desc: desc,
      price: price,
      archive: archive,
      image: image,
      category: category,
    };
    if (
      data.designerid === "" ||
      data.name === "" ||
      data.desc === "" ||
      data.price === "" ||
      data.archive === "" ||
      data.image === "" ||
      data.category === ""
    ) {
      alert("Fill all the fields to continue.");
    } else {
      console.log(data);
      try {
        const response = await axios.post(`${baseURL}/createproduct`, data);
        if (response.status === 200) {
          alert("Added successfully");
          console.log(response);
          navigate("/home/products");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  const handleTagChange = (event, setState) => {
    const inputValue = event.target.value;
    const lastCharacter = inputValue.slice(-1);

    // If the last character is a comma, make the preceding word bold
    if (lastCharacter === ",") {
      console.log("Comma");
      const words = inputValue.split(",");
      const lastWord = words[words.length - 2].trim();
      setBoldText(lastWord);
    } else {
      setBoldText("");
    }

    setState(inputValue);
  };

  const handleChange = (event, setState) => {
    setState(event.target.value);
  };

  const handleCheckboxChange = (event) => {
    setArchive(event.target.checked);
  };

  const handleDropdownChange = (event) => {
    setCategory(event.target.value);
  };

  const prodNameChange = (event) => {
    handleChange(event, setName);

    if (event.target.value === "") {
      setBackgroundColor1("red");
      setShadowColor1("red");
      alert("Enter product name");
    } else {
      setBackgroundColor1("grey");
      setShadowColor1("white");
    }
  };

  const prodName2Change = (event) => {
    handleChange(event, setDesc);

    if (event.target.value === "") {
      setBackgroundColor2("red");
      setShadowColor2("red");
      alert("Enter product description");
    } else {
      setBackgroundColor2("grey");
      setShadowColor2("white");
    }
  };
  const prodNameChange3 = (event) => {
    handleChange(event, setPrice);
    if (event.target.value === "") {
      setBackgroundColor2("red");
      setShadowColor2("red");
      alert("Enter product Price");
    } else {
      setBackgroundColor2("grey");
      setShadowColor2("white");
    }
  };

  const prodTagChange = async (event) => {
    handleChange(event, setTags);

    const inputValue = event.target.value;
    const words = inputValue.split(",");
    const lastWord = await words.map((word) => word.trim()).join(" / ");

    setBoldText(lastWord);

    if (event.target.value === "") {
      setBackgroundColor2("red");
      setShadowColor2("red");
      alert("Enter product tags");
    } else {
      setBackgroundColor2("grey");
      setShadowColor2("white");
    }
  };

  function handleOnUpload(error, result, widget) {
    if (error) {
      updateError(error);
      widget.close({
        quiet: true,
      });
      return;
    }
    updateUrl(result?.info?.secure_url);
    setImage(result?.info?.secure_url);
  }

  return (
    <div className="dashboard-header">
      <div>
        <h1 className="head-style1">Create product</h1>
        <p>Add product to your store</p>
      </div>

      <hr className="hr-style" />

      <div className="d-flex flex-row mt-4 bg-container">
        <div className="col-12 col-md-3 mx-2 p-2">
          <UploadWidget onUpload={handleOnUpload}>
            {({ open }) => {
              function handleOnClick(e) {
                e.preventDefault();
                open();
              }
              return (
                <button
                  onClick={handleOnClick}
                  className="btn btn-dark text-light cp-button2-style"
                >
                  Upload an Image
                </button>
              );
            }}
          </UploadWidget>

          {error && <p>{error}</p>}
          {url && (
            <>
              <p>
                <img
                  src={url}
                  alt="Uploaded resource"
                  className="uploaded_image"
                />
              </p>
              <p>{url}</p>
            </>
          )}
        </div>
      </div>

      <div className="container-fluid d-flex flex-row ">
        <div className="row bg-container w-100">
          <div className="col-12 col-md-4 p-2">
            <label className="form-label m-0 label-styling" htmlFor="prodName">
              Product name
            </label>
            <input
              style={{
                borderColor: borderColor1,
                boxShadow: `0 0 10px ${shadowColor1}`,
              }}
              type="text"
              multiple
              className="form-control upload-button-style custom-file-input"
              id="prodName"
              onChange={(event) => handleChange(event, setName)}
              onBlur={prodNameChange}
            />
          </div>
          <div className="col-12 col-md-4 p-2">
            <label className="form-label m-0 label-styling" htmlFor="dropdown">
              Category
            </label>
            <div className="dropdown">
              <select
                className="form-select upload-button-style custom-file-input"
                aria-label="Default select example"
                onChange={handleDropdownChange}
              >
                <option selected disabled>
                  Select category
                </option>
                <option value="sarees">Sarees</option>
                <option value="kurtas">Kurtas</option>
                <option value="suits">Suits - Men</option>
                <option value="Blazer">Blazer</option>
                <option value="Suits-women">Suits - Women</option>
                <option value="Shirts">Shirts</option>
                <option value="Pants-Men">Pants-Men</option>
                <option value="Sherwani">Sherwani</option>
                <option value="Badhgala">Badhgala</option>
                <option value="Open Jacket">Open Jacket</option>
                <option value="Bomber Jacket">Bomber Jacket</option>
                <option value="Nehru Jacket">Nehru Jacket</option>
                <option value="Kurtis">Kurtis</option>
                <option value="Pants-Women">Pants-Women</option>
                <option value="Gowns">Gowns</option>
                <option value="Anarkali">Anarkali</option>
                <option value="Lehanga Blouses">Lehanga Blouses</option>
                <option value="Draped Skirt">Draped Skirt</option>
                <option value="Jump Suit">Jump Suit</option>
                <option value="Jackets/Capes">Jackets/Capes</option>
              </select>
            </div>
          </div>
          <div className="col-12 col-md-4 p-2">
            <label className="form-label m-0 label-styling" htmlFor="prodDesc">
              Product description {"<200 words"}
            </label>
            <input
              style={{ borderColor, boxShadow: `0 0 10px ${shadowColor}` }}
              type="text"
              multiple
              className="form-control upload-button-style custom-file-input"
              id="prodDesc"
              onChange={(event) => handleChange(event, setDesc)}
              onBlur={prodName2Change}
            />
          </div>
          <div className="col-12 col-md-4 p-2">
            <label className="form-label m-0 label-styling" htmlFor="prodName">
              Product Price
            </label>
            <input
              style={{
                borderColor: borderColor1,
                boxShadow: `0 0 10px ${shadowColor1}`,
              }}
              type="text"
              multiple
              className="form-control upload-button-style custom-file-input"
              id="prodTags"
              onChange={(event) => handleChange(event, setPrice)}
              onBlur={prodNameChange3}
            />
          </div>

          <div className="col-12 col-md-4 p-2">
            <label className="form-label m-0 label-styling" htmlFor="prodName">
              Tags{" "}
              <span className="tags-p-style">
                ( Enter comma (,) separated tags )
              </span>
            </label>
            <input
              style={{
                borderColor: borderColor1,
                boxShadow: `0 0 10px ${shadowColor1}`,
              }}
              type="text"
              multiple
              className="form-control upload-button-style custom-file-input"
              id="prodPrice"
              // onChange={(event) => handleChange(event, setTags)}
              onChange={(event) => prodTagChange(event, setName)}
              // onBlur={prodTagChange}
            />
            {boldText && (
              <div>
                <b>{boldText}</b>
              </div>
            )}
          </div>

          <div className="col-12 col-md-4 p-2">
            <label className="form-label m-0 label-styling" htmlFor="dropdown">
              Gender
            </label>
            <div className="dropdown">
              <select
                className="form-select upload-button-style custom-file-input"
                aria-label="Default select example"
                onChange={handleDropdownChange}
              >
                <option selected disabled>
                  Select gender
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Unisex">Unisex</option>
              </select>
            </div>
          </div>

          <div className="col-12 col-md-4 p-2 mt-4 d-flex align-items-center text-center justify-content-center archive-style">
            <label className="form-label label-styling" htmlFor="prodArc">
              Archived
            </label>
            <input
              type="checkbox"
              multiple
              className="mx-2 checkboxClass upload-button-style custom-file-input"
              id="prodArc"
              checked={archive}
              onChange={handleCheckboxChange}
            />
            <p className="archive-p-style my-auto">
              Check this box if you do not want to show this product on the
              store.
            </p>
          </div>
        </div>
      </div>
      <button
        className="btn btn-dark text-light border-0 mt-3 mb-3 cp-button-style"
        onClick={updateStateFnCall}
      >
        Create
      </button>
    </div>
  );
};

export default CreateProduct;
