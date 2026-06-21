# Workspace Volumes

Project files are mounted into per-project containers at `/workspace`. Runtime
dependencies such as `node_modules` and Python virtual environments should stay
inside the project volume so they survive restarts.
