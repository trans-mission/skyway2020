# Overflow

## Getting Started

### Dependencies
- [nodejs](https://nodejs.org/en/download/)
- [git](https://git-scm.com/downloads)
- [Azure Functions Tools](https://docs.microsoft.com/en-us/azure/azure-functions/functions-run-local#v2)
- [CMake](https://cmake.org/download/) (For the OpenCV node package)
  - For Ubuntu you may need the 'build-essential' package from apt
  - For Windows 
    - You may need to install windows build tools `npm install -g windows-build-tools`
    - You may also need to install OpenCV manually as described [here](https://github.com/justadudewhohacks/opencv4nodejs#installing-opencv-manually).
- Run `npm install` in a terminal session to install remaining dependencies
- TODO: local.settings.json & maybe azure storage emulator instrux

### Optional
- [VS Code](https://code.visualstudio.com/download)
- [VS Code 'Azure Functions' extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurefunctions)

### Run the app
- Using VSCode, press F5
- Run `func start` using the command line from the same location as this file 👌