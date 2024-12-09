# Welcome to LECOLE Fast Track 24

## Features

- 🚀 Server-side rendering
- ⚡️ Hot Module Replacement (HMR)
- 📦 Asset bundling and optimization
- 🔄 Data loading and mutations
- 🔒 TypeScript by default
- 🎉 TailwindCSS for styling
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
yarn install
```

### Development

Start the development server with HMR:

```bash
yarn dev
```

Start the server:

```bash
yarn dev:server
```

Your front-end application will be available at `http://localhost:5173`.
Your back-end application will be available at `http://localhost:3000`.

## Building for Production

Create a production build:

```bash
yarn build
```

## Deployment

### Docker Deployment

This template includes a Dockerfile optimized for yarn:

- `Dockerfile` - for yarn

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `yarn build`

```
├── package.json
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever CSS framework you prefer.

---

Built with ❤️ using React Router.
