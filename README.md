# Berkeley Spaces

Find your next study space by leveraging vacant spaces at UC Berkeley. Search for rooms with the locations and features that you desire using a greedy algorithm that prioritizes the longest possible occupancy time in each room. Built with FastAPI, React, and PostgreSQL.

## Getting Started

To run the project locally, follow these steps:

1. Clone the repository.

2. Navigate to the project directory.

    ```bash
    cd berkeley-spaces
    ```

3. Build the Docker images and start the containers.

    ```bash
    docker-compose up --build
    ```

4. Access the application. The API is available at `http://localhost:8000`. The web frontend is available at `http://localhost:80`. The PostgreSQL database is available on port `5432`.

5. Populate the database. You can send a POST request to the `/update_data` API endpoint or visit the `/update` page to update the database.  Note that this process can take up to 5 minutes as it pulls data from external sources.