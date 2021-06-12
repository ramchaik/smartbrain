import Clarifai from "clarifai";
import React, { Component } from "react";
import Particles from "react-particles-js";
import "./App.css";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Logo from "./components/Logo/Logo";
import Navigation from "./components/Navigation/Navigation";
import Rank from "./components/Rank/Rank";
import Register from "./components/Register/Register";
import Signin from "./components/Signin/Signin";

const app = new Clarifai.App({
  apiKey: process.env.REACT_APP_CLARIFAI_API_KEY,
});

const ROUTES = {
  signin: "signin",
  signout: "signout",
  home: "home",
  register: "register",
};

const particlesOptions = {
  particles: {
    number: {
      value: 80,
      density: {
        enable: true,
        value_area: 800,
      },
    },
  },
};

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: "",
      imageURL: "",
      box: {},
      route: ROUTES.signin,
      isSignedIn: false,
      user: {
        id: "",
        name: "",
        email: "",
        entries: 0,
        joined: 0,
      },
    };
  }

  componentDidMount() {
    fetch("http://localhost:3000/")
      .then((res) => res.json())
      .then(console.log);
  }

  loadUser = (user) =>
    this.setState({
      user: {
        email: user.email,
        entries: user.entries,
        id: user.id,
        joined: user.joined,
        name: user.name,
      },
    });

  onRouteChange = (route) => () => {
    if (route === ROUTES.home) {
      this.setState({ isSignedIn: true });
    } else if (route === ROUTES.signout) {
      this.setState({ isSignedIn: false });
    }

    this.setState({ route });
  };

  calculateFaceLocation = (data) => {
    const face = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById("input-image");
    const width = Number(image.width);
    const height = Number(image.height);

    return {
      leftCol: face.left_col * width,
      topRow: face.top_row * height,
      rightCol: width - face.right_col * width,
      bottomRow: height - face.bottom_row * height,
    };
  };

  displayFaceBox = (box) => this.setState({ box });

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onSubmitChange = async (event) => {
    this.setState({ imageURL: this.state.input });
    try {
      const resp = await app.models.predict(
        Clarifai.FACE_DETECT_MODEL,
        this.state.input
      );

      if (resp) {
        fetch("http://localhost:3000/image", {
          method: "put",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: this.state.user.id,
          }),
        })
          .then((res) => res.json())
          .then((count) =>
            this.setState({ user: { ...this.state.user, entries: count } })
          )
          .catch(alert);
      }

      this.displayFaceBox(this.calculateFaceLocation(resp));
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    const { isSignedIn, box, imageURL, route, user } = this.state;

    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Navigation
          isSignedIn={isSignedIn}
          onRouteChange={this.onRouteChange}
          ROUTES={ROUTES}
        />
        {route === ROUTES.home ? (
          <>
            <Logo />
            <Rank name={user.name} entries={user.entries} />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onSubmitChange={this.onSubmitChange}
            />
            <FaceRecognition box={box} imageURL={imageURL} />
          </>
        ) : route === ROUTES.register ? (
          <Register
            loadUser={this.loadUser}
            onRouteChange={this.onRouteChange}
            ROUTES={ROUTES}
          />
        ) : (
          <Signin
            loadUser={this.loadUser}
            onRouteChange={this.onRouteChange}
            ROUTES={ROUTES}
          />
        )}
      </div>
    );
  }
}

export default App;
