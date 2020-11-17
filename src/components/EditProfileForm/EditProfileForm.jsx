import React, { useState, useEffect, useRef } from "react";
import { useParams, useHistory } from "react-router-dom";
import Nav from "../../components/Nav/Nav";
import "../../components/EditProfileForm/EditProfileForm.css";
import warningicon from "../../images/warning2.png"
import ErrorComponent from "../ErrorComponent/ErrorComponent"

function EditProfileForm() {
  const [modalState, setModalState] = useState(false);
  const [profileData, setProfileData] = useState({});
  const [isLoading, setIsLoading] = useState(true)
  const token = window.localStorage.getItem("token");
  const username = window.localStorage.getItem("username");


  const [errorMessage, setErrorMessage] = useState()
  const [errorKey, setErrorKey] = useState()

  let btnRefEdit = useRef();
  let btnRefChange = useRef();



  const deleteAccountToggleState = () => {
    setModalState(!modalState);
    window.scrollTo(0, 0);
  };

  const [credentials, setCredentials] = useState({
    username: "",
    preferred_name: "",
    email: "",

  });
  const [passwords, setPasswords] = useState({
    old_password: "",
    new_password: "",

  });



  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}user/${username}`, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`
      }
    }).then((results) => {
      return results.json();
    }).then((data) => {
      console.log(data)
      setProfileData(data);
      setIsLoading(false)
    });
  }, []);


  useEffect(() => {
    setCredentials({
      id: profileData.id,
      username: profileData.username,
      email: profileData.email,
      preferred_name: profileData.preferred_name,
      password: profileData.password,

    });
  }, [profileData]);

  const history = useHistory();

  const handleChangeCredentials = (e) => {
    const { id, value } = e.target;
    console.log(id, " ", value)
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [id]: value,
    }));
  };
  const handleChangePasswords = (event) => {
    const { id, value } = event.target;

    setPasswords((prevPasswords) => ({
      ...prevPasswords,
      [id]: value,
    }));
  };


  /////// Change username, email, preferred name
  const postData = async () => {
    let username = localStorage.username;
    let token = localStorage.token;

    //function you can call but carry on as well
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}user/${username}/`,
      {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${token}`,
        },
        body: JSON.stringify(credentials),
      }
    );

    if (response.ok) {
      localStorage.removeItem("username");
      window.localStorage.setItem("username", credentials.username);
      history.push("/collections/");
      window.location.reload();

      return response.json();
    } else {
      response.text().then(text => {
        throw Error(text)
      }).catch(
        (error) => {

          const errorObj = JSON.parse(error.message);

          // this is the form element that has the problem (eg, "price")
          setErrorKey(Object.keys(errorObj)[0])
          // this is the message of the error (eg, "this field is required")
          setErrorMessage(errorObj[Object.keys(errorObj)[0]]);

          // Puts the cursor in the form input corresponding to the element that has an issue
          let keyName = document.getElementById(`${Object.keys(errorObj)[0]}`)
          if (keyName) { keyName.focus(); }

          // this enables the submit button again
          if (btnRefEdit.current) {
            btnRefEdit.current.disabled = false
          }


        }
      )
    }
  };

  const handleSubmitCredential = (e) => {
    e.preventDefault();

    if (btnRefEdit.current) {
      btnRefEdit.current.disabled = true
    }

    postData()
      .then((response) => {
        if (response != undefined) {
          //history.push("/collections/");
        } else {
          //history.push("/collections/")
        }
      }).catch(
        (error) => {
          console.log("---- error: ", error)
        }
      )

  };

  //// Change password
  const handleSubmitPassword = async (e) => {

    e.preventDefault();

    // this disables the submit button
    if (btnRefChange.current) {
      btnRefChange.current.disabled = true
    }


    const responsePassword = await fetch(`${process.env.REACT_APP_API_URL}change-password/`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`
      },
      body: JSON.stringify(passwords)
    })

    if (responsePassword.ok) {

      history.push("/collections/");
      window.location.reload();

    } else {

      responsePassword.text().then(text => {
        throw Error(text)

      }).catch((error) => {

        console.log("-------------------------Error")
        const errorObj = JSON.parse(error.message);

        // this is the form element that has the problem (eg, "price")
        setErrorKey(Object.keys(errorObj)[0])
        // this is the message of the error (eg, "this field is required")
        setErrorMessage(errorObj[Object.keys(errorObj)[0]]);

        // Puts the cursor in the form input corresponding to the element that has an issue
        let keyName = document.getElementById(`${Object.keys(errorObj)[0]}`)
        if (keyName) { keyName.focus(); }

        // this enables the submit button again
        if (btnRefChange.current) {
          btnRefChange.current.disabled = false
        }

        console.log(errorObj[Object.keys(errorObj)[0]])
      }
      )
    }
  };

  //   .then((result) => {
  //    if (result != undefined) {
  //      //history.push("/collections/");
  //      //window.location.reload();
  //    } else {
  //      //history.push("/edituserdetails/")
  //    }


  const DeleteAccount = async (e) => {
    let token = localStorage.getItem("token");
    let username = localStorage.getItem("username");

    const response = fetch(`${process.env.REACT_APP_API_URL}user/${username}/`, {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    });
    console.log(response)
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    history.push("/");
    window.location.reload();
  };


  return (
    <div id="loginform">
      <div >
        <Nav />
      </div>
      <div className="cuformlogo" >
        <img
          id="cuformlogoimage"
          src={require("../../images/Comparalist_rectangle.png")}
          alt="Company Logo"
        />
      </div>

      {isLoading ? (<div className="loadingpage">
        <img alt="" src={"https://i.imgur.com/3BOX1wi.gif"} />
      </div>) : <div>  {username === null ? (
        <ErrorComponent errorMessage="You are not logged in!" errorNumber="403" />
      ) : (<div>

        <div id="contactusform">
          <form>
            {/*------------- Edit Profile -------------*/}
            <h2 id="contactusheadertitle">Edit Profile</h2>
            <div className="cufa">
              <label className="atcu" htmlFor="username">Username:
              <span className="error">{(errorKey === "username") ? errorMessage : null}</span>
              </label>
              <input
                type="username"
                id="username"
                value={credentials.username}
                onChange={handleChangeCredentials}
              />
            </div>

            <div className="cufa">
              <label className="atcu" htmlFor="email">Email:
              <span className="error">{(errorKey === "username") ? errorMessage : null}</span>
              </label>
              <input
                type="email"
                id="email"
                onChange={handleChangeCredentials}
                value={credentials.email}
              />
            </div>
            <div className="cufa">
              <label className="atcu" htmlFor="preferred_name">Preferred Name:
              <span className="error">{(errorKey === "preferred_name") ? errorMessage : null}</span>
              </label>
              <input
                type="preferred_name"
                id="preferred_name"
                onChange={handleChangeCredentials}
                value={credentials.preferred_name}
              />
            </div >

            <div id="cubuttonwrapper">
              <button ref={btnRefEdit} id="cubutton" className="cubutton" button type="submit" onClick={handleSubmitCredential}> Edit Profile </button>
            </div>


            {/*------------- Change Password -------------*/}
            <h2 id="contactusheadertitle">Change Password</h2>
            <div className="cufa">
              <label className="atcu" htmlFor="old_password">Old Password:
              <span className="error">{(errorKey === "old_password") ? errorMessage : null}</span>
              </label>
              <input
                type="old_password"
                id="old_password"
                onChange={handleChangePasswords}
                value={passwords.old_password}
              />
            </div>

            <div className="cufa">

              <label className="atcu" htmlFor="new_password">New Password:
              <span className="error">{(errorKey === "new_password") ? errorMessage : null}</span>
              </label>
              <input
                type="new_password"
                id="new_password"
                onChange={handleChangePasswords}
                value={passwords.new_password}
              />
            </div>

            <div className="cufa">

              <label className="atcu" htmlFor="confirm_new_password">Re-enter Password:
              <span className="error">{(errorKey === "confirm_new_password") ? errorMessage : null}</span>
              </label>
              <input
                type="confirm_new_password"
                id="confirm_new_password"
                onChange={handleChangePasswords}
                value={passwords.confirm_new_password}
              />
            </div>

            {/* <div className="cufa">
            <label className="atcu" htmlFor="delete_account"></label>
            </div> */}

            <div id="cubuttonwrapper">
              <button ref={btnRefChange} id="cubutton" className="cubutton" button type="submit" onClick={handleSubmitPassword}> Change Password </button>
            </div>



            {/*------------- Change Password -------------*/}
            <h2 id="contactusheadertitle">Delete Account</h2>
            <div className="cufa">

              <label htmlFor="delete_account"></label>


            </div>



          </form>
          <div id="cubuttonwrapper">
            <button id="cubutton" className="cubutton" onClick={() => deleteAccountToggleState()}>Delete your Account</button>
          </div>
        </div>

        <div className={`modalBackground modalShowing-${modalState}`}>
          <div className="modalEditPRofile">
            <div className="modalText">
              <img className="warningicons" alt="warningicon" src={warningicon} />
              <p>Are you sure you want to delete your account? </p>
              <p> This will remove all collection and item Data</p>
              <button onClick={() => DeleteAccount()}>Yes Delete Account</button>
              <div>
                <button className="exitButton" onClick={() => deleteAccountToggleState()}> exit </button>
              </div>
            </div>
          </div>
        </div>

      </div>)}</div>}



    </div>
  );
}
export default EditProfileForm;