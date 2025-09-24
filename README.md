# ZenithFeed: Minimalist Reddit Automation

[cloudflarebutton]

ZenithFeed is a visually stunning and minimalist web application designed for content creators, marketers, and researchers to effortlessly monitor Reddit. Users can create custom 'monitors' by specifying subreddits and keywords. The platform then automatically fetches and displays relevant posts from the last 7 days in a clean, elegant, and highly readable card-based interface.

The core focus is on providing a serene, focused, and efficient user experience, stripping away the noise of Reddit to present only the most relevant information. The application is built on Cloudflare's edge network, ensuring lightning-fast performance and reliability.

## Key Features

-   **Custom Monitors**: Create personalized feeds by specifying subreddits and keywords.
-   **Recent Posts**: Automatically fetches and displays posts from the last 7 days.
-   **Minimalist UI**: A clean, elegant, and highly readable card-based interface designed for focus.
-   **High Performance**: Built on Cloudflare Workers and Durable Objects for a fast, responsive experience.
-   **Serene UX**: A calm, focused environment to consume Reddit content without the usual distractions.

## Technology Stack

-   **Frontend**: React, Vite, Tailwind CSS, shadcn/ui
-   **State Management**: Zustand
-   **Backend**: Cloudflare Workers, Hono
-   **Storage**: Cloudflare Durable Objects
-   **Language**: TypeScript
-   **UI/UX**: Framer Motion for animations, Lucide React for icons
-   **Tooling**: Bun, Wrangler

## Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Bun](https://bun.sh/) installed on your machine.
-   [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install-and-update/) logged into your Cloudflare account.

```bash
# If you don't have wrangler installed
bun add -g wrangler

# Login to your Cloudflare account
wrangler login
```

### Installation & Local Development

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd zenith_feed
    ```

2.  **Install dependencies:**
    ```bash
    bun install
    ```

3.  **Run the development server:**
    This command starts the Vite frontend server and the Wrangler dev server for the backend worker simultaneously.
    ```bash
    bun dev
    ```

The application will be available at `http://localhost:3000` (or the port specified in your environment). The frontend will automatically proxy API requests to the local worker instance.

## Project Structure

-   `src/`: Contains the React frontend application source code.
    -   `pages/`: Top-level page components.
    -   `components/`: Reusable UI components.
    -   `lib/`: Utilities, API clients, and state management stores.
-   `worker/`: Contains the Cloudflare Worker backend code.
    -   `index.ts`: The main worker entry point.
    -   `user-routes.ts`: Hono API route definitions.
    -   `entities.ts`: Durable Object entity definitions.
-   `shared/`: Contains TypeScript types shared between the frontend and backend.

## Deployment

This project is designed for seamless deployment to the Cloudflare network.

1.  **Build the application:**
    The `deploy` script first builds the frontend assets and the worker.
    ```bash
    bun run build
    ```

2.  **Deploy to Cloudflare:**
    After a successful build, the script uses Wrangler to publish your worker and static assets.
    ```bash
    bun run deploy
    ```

Alternatively, you can deploy this project with a single click.

[cloudflarebutton]

## License

This project is licensed under the MIT License.