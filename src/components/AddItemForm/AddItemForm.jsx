import React, { useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import "./AddItemForm.css"
import Nav from "../../components/Nav/Nav";
import "../../components/Nav/Nav.css";



function AddItemForm(props) {
   const { id, collectionData } = props;
   const [errorMessage, setErrorMessage] = useState()
   const [errorKey, setErrorKey] = useState()

   let btnRefAdd = useRef();

   //variables
   const [credentials, setCredentials] = useState({
      name: "",
      price: "",
      // sale_amount: "",
      attribute1: "",
      attribute2: "",
      attribute3: "",
      attribute4: "",
      image: "",
      sale_amount: 0,
      sale_end_date: null,
      collection: parseInt(id),
   });


   //methods
   const handleChange = (e) => {
      const { id, value } = e.target;
      setCredentials((prevCredentials) => ({
         ...prevCredentials,
         [id]: value,
      }));
      console.log(e.target)
   };

   const handleImageChange = (e) => {
      e.persist();

      setCredentials((prevCredentials) => ({
         ...prevCredentials,
         image: e.target.files[0],
      }));
   };

   const history = useHistory();

   const postData = async () => {
      let token = window.localStorage.getItem("token");
      console.log(credentials.sale_end_date)

      let form_data = new FormData();
      form_data.append('image', credentials.image);
      form_data.append('attribute1', credentials.attribute1);
      form_data.append('attribute2', credentials.attribute2);
      form_data.append('attribute3', credentials.attribute3);
      form_data.append('attribute4', credentials.attribute4);
      form_data.append('collection', credentials.collection);
      form_data.append('name', credentials.name);
      form_data.append('price', credentials.price);
      form_data.append('sale_amount', credentials.sale_amount);

      if (credentials.sale_end_date !== null && parseInt(credentials.sale_amount) !== 0) {
         form_data.append('sale_end_date', credentials.sale_end_date);
      }
      form_data.append('is_active', true);

      console.log("form_data: ", form_data)

      const response = await fetch(`${process.env.REACT_APP_API_URL}items/`, {
         method: "post",
         headers: {
               Authorization: `Token ${token}`,
         },
         body: form_data,
      });
      if (response.ok) {
         setErrorMessage("Successful");
         return response.json();

      } else {
         response.text().then(text => {
               throw Error(text)
         }).catch(
               (error) => {

                  // this catches the error in a dictionary
                  // the key gives the key of the element that has a problem
                  // and the value gives gives the string with the error message
                  // then focus on the input of the element that has a problem
                  const errorObj = JSON.parse(error.message);
                  setErrorMessage(errorObj[Object.keys(errorObj)[0]]);
                  // "detail": "Invalid token." 
                  
                  console.log("---------- Object.keys(errorObj)[0]: ",Object.keys(errorObj)[0])

                  let keyName = document.getElementById(`${Object.keys(errorObj)[0]}`)

                  if (keyName) {
                     keyName.focus();
                  }

                  // this enables the submit button again
                  if (btnRefAdd.current) {
                     btnRefAdd.current.disabled = false
                  }

               }
         )
      }
   };


   const handleSubmit = (e) => {

      e.preventDefault();

      // disables the button to submit form until there is a response
      if (btnRefAdd.current) {
         btnRefAdd.current.disabled = true
      }

      postData().then((response) => {
         if (errorMessage === "Successful") {
            
            // enable the "add item"/"submit" button again just in case
            if (btnRefAdd.current) {
               btnRefAdd.current.disabled = false
            }

            console.log("Error: ", errorMessage)

         } else {
            // history.push(`/collection/${id}/`);
         //     window.location.reload();
         }
         //history.push(`/collection/${id}/`);
         //window.location.reload();

      });

   };
   
   //className={`todo ${todo.isCompleted ? "complete" : ""}`}
   
   return (
        <div>
              <div>
                <Nav />
            </div>
            <div className="aiformlogo" >
                <img
                id="aiformlogoimage"
                src={require("../../images/Comparalist_rectangle.png")}
                alt="Company Logo"
                />
            </div >
            <div className="additemform">
            <h2 id="additemheadertitle"> Add Item to {collectionData.title} </h2>
            <form>

               <div className="aifa">
                  <label className="atai" htmlFor="name">
                     Name of Item: 
                     <span className="error">{errorMessage !== "" ? errorMessage : null}</span> 
                  </label>
                  <input
                     type="text"
                     id="name"
                     onChange={handleChange}
                  />
               </div>

                <div className="aifa">
                    <label className="atai" htmlFor="price">Price of Item:</label>
                    <input
                        type="number"
                        id="price"
                        onChange={handleChange}
                    />
                </div>

                <div className="aifa">
                    <label className="atai" htmlFor="sale_amount">Is there a discount currently offered (%)?:</label>
                    <input
                        type="number"
                        id="sale_amount"
                        onChange={handleChange}
                    />
                </div>

                {parseInt(credentials.sale_amount) > 0 && (<div className="aifa">
                    <label className="atai" htmlFor="sale_end_date">When does the discount expire?</label>
                    <input
                        type="date"
                        id="sale_end_date"
                        onChange={handleChange}
                    />
                </div>)}

                {collectionData.attribute1 !== "" && (<div className="aifa">
                    <label className="atai" htmlFor="attribute1">{collectionData.attribute1}:</label>
                    <input
                        type="text"
                        id="attribute1"
                        onChange={handleChange}
                    />
                </div>)}


                {collectionData.attribute2 !== "" && (<div className="aifa">
                    <label className="atai" htmlFor="attribute2">{collectionData.attribute2}:</label>
                    <input
                        type="text"
                        id="attribute2"
                        onChange={handleChange}
                    />
                </div>)}

                {collectionData.attribute3 !== "" && (<div className="aifa">
                    <label className="atai" htmlFor="attribute3">{collectionData.attribute3}:</label>
                    <input
                        type="text"
                        id="attribute3"
                        onChange={handleChange}
                    />
                </div>)}

                {collectionData.attribute4 !== "" && (<div className="aifa">
                    <label className="atai" htmlFor="attribute4">{collectionData.attribute4}:</label>
                    <input
                        type="text"
                        id="attribute4"
                        onChange={handleChange}
                    />
                </div>)}


                <div className="aifa">
                    <label className="atai" htmlFor="image">Image:</label>
                    <input
                        type="file"
                        id="image"
                        onChange={handleImageChange}
                    />
                </div>


                <div className="aifa">
                    <label className="atai" htmlFor="notes">Notes:</label>
                    <input
                        type="textarea"
                        id="notes"
                        onChange={handleChange}
                    />
                </div>


                <div className="aibuttonwrapper">
                    <button ref={btnRefAdd} type="submit" onClick={handleSubmit}>  Add to List </button>
                </div>
            </form>
            </div>
        </div>
    );
}

export default AddItemForm;
