<div align="center">

<a href="https://musehd.github.io/FourierArt/"> 
  <img src="imgs/fav.ico" alt="Logo" width="150">
</a>

  <h3 align="center">FourierArt</h3>

  <p align="center">
    <em>Art through Mathematics</em>
    <br />
    <a href="https://github.com/museHD/FourierArt/issues">Report Bug</a>
    ·
    <a href="https://github.com/museHD/FourierArt/issues">Request Feature</a>
  </p>
</div>


## About the Project:
🖼 SDD Major Project - Using Discrete Fourier Transform to artistically trace drawings in JavaScript

When i first saw [this](https://youtu.be/r6sGWTCMz2k?t=37) video from 3Blue1Brown back in 2020, I was extremely intrigued with the concept behind the Fourier Transform. It is my biggest inspiration for this project.

I had the idea of making this project back then, but I was focusing on other projects so I put this one off. In 2021, I wanted to take on the challenge, but due to my lack of experience, I settled on doing a [Double Pendulum Simulator](https://github.com/museHD/DoublePendulum) that I handed in for my assessment. However, at the end of 2021, I finally decided to do this project as my Software Major Work.

It uses several epicycles (circles that move around the circumference of larger circles), all rotating at different speeds to create complex shapes and patterns with what looks like chaotic frenzy, but in reality is clockwork rigidity.

Although the project has been assessed, it's still very interesting to play around with and can be improved quite a lot. 
Please feel free to leave any feedback! ❤️

If you are interested in improving it, see <a href="#contributing">Contributing.</a>

#### Update:
I got full marks (65/65) for the software component of the assessment :)  
However, I lost a couple marks in the documentation :(  
In total: 98%


## Getting Started

### Installation
* You can access the project on its [website](https://musehd.github.io/FourierArt/).

OR

* You can download a local copy using `git clone https://github.com/museHD/FourierArt.git `

  Everything is included in the repo, so it can be run locally without an internet connection.
  For full functionality offline, it will be required to locally host a webserver.
  
  If you have Python 3 installed, this can be done by running the command `python -m http.server 8000`
  Once the server is running, visit `localhost:8000` from a browser.


### Usage
The Control Panel in the middle allows you to change settings.
* Draw  
  Allows you to draw on the canvas
* Image  
  Allows you to upload an image file to be drawn
* Draw Method  
  Allows you to switch between drawing using lines and dots. Each mode will automatically switch to the preferred method. It is recommended to not change this.
* Precision  
  Controls the number of epicycles used, and how accurately the target drawing is being drawn
* Target Drawing  
  Displays the current drawing that the program is trying to trace

The Info Panel on the right provides some information about what the program does.  
It also has examples that can be tried out.

## Examples
![pagys (Custom) (1)](https://user-images.githubusercontent.com/57558058/190040223-8b30a891-09bd-4ede-abdb-0fb5da2ec9d2.png)
![vectr (Custom) (1)](https://user-images.githubusercontent.com/57558058/190040220-f6894a42-6f19-4a66-9ec2-41ed6f6bf20b.png)
![image](https://user-images.githubusercontent.com/57558058/190039365-d4f6e437-79f4-48a4-9546-fc27eb606958.png)


## Contributing
Please feel free to raise issues and suggest changes to the project.
Although it has been submitted, it can be improved through code optimsation and UI changes.

[![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://forthebadge.com)
