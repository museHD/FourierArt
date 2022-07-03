
<h2 align="center">
  FourierArt <br> <br>
  <img src="imgs/fav.ico" alt="Logo" width="120" height="120"> <br> <br>
  <em>Art through Mathematics</em>
</h2>


## About the Project:
🖼 SDD Major Project - Using Discrete Fourier Transform to artistically trace drawings in JavaScript

It simulates a chaotic physics system where a pendulum is attached to the end of another pendulum.
The length of these pendulums and the angle they are released at can be customised using the UI. The simulation uses the Runge-Kutta differential equation solver in order to provide relatively accurate results. 

Although the project has been assessed, it's still very interesting to play around with and can be improved quite a lot. If you are interested in improving it, see <a href="#contributing">Contributing.</a>


## Getting Started

### Installation
* You can access the project on its [website](https://musehd.github.io/FourierArt/).

OR

* You can download a local copy using `git clone https://github.com/museHD/FourierArt.git `

  Everything is included in the repo, so it can be run locally without an internet connection.
  For full functionality offline, it will be required to locally host a webserver.
  
  If you have Python 3 installed, this can be done by running the command `python -m http.server 8000`
  Once the server is running, visit `localhost:3000` from a browser.


### Usage
The Control Panel in the middle allows you to change settings.
* Draw  
  Allows you to draw on the canvas
* Image  
  Allows you to upload an image file to be drawn
* Precision  
  Controls the number of epicycles used, and how accurately the target drawing is being drawn
* Target Drawing  
  Displays the current drawing that the program is trying to trace

The Info Panel on the right provides some information about what the program does.  
It also has examples that can be tried out.

## Contributing
Please feel free to raise issues and suggest changes to the project.
Although it has been submitted, it can be improved through code optimsation and UI changes.

[![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://forthebadge.com)
