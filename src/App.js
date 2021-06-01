import Clarifai from "clarifai";
import React, { Component } from "react";
import Particles from "react-particles-js";
import "./App.css";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import Logo from "./components/Logo/Logo";
import Navigation from "./components/Navigation/Navigation";
import Rank from "./components/Rank/Rank";

const app = new Clarifai.App({
  apiKey: process.env.REACT_APP_CLARIFAI_API_KEY,
});

const particlesOptions = {
  particles: {
    number: {
      value: 60,
      density: {
        enable: true,
        value_area: 800,
      },
    },
    size: {
      value: 1,
    },
  },
  interactivity: {
    events: {
      onhover: {
        enable: true,
        mode: "repulse",
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
    };
  }

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
      const data = resp.outputs[0].data.regions[0].region_info.bounding_box;
      console.log({ data });
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return (
      <div className="App">
        <Particles className="particles" params={particlesOptions} />
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm
          onInputChange={this.onInputChange}
          onSubmitChange={this.onSubmitChange}
        />
        <FaceRecognition imageURL={this.state.imageURL} />
      </div>
    );
  }
}

export default App;
