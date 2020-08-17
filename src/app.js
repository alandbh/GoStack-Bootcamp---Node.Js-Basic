const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
    // TODO
    return response.json(repositories);
});

app.post("/repositories", (request, response) => {
    // TODO
    const { title, url, techs } = request.body;
    const repo = {
        id: uuid(),
        title,
        url,
        techs,
        likes: 0,
    };

    repositories.push(repo);

    return response.json(repo);
});

// Validating ID

function validateId(request, response, next) {
    const { id } = request.params;

    if (!isUuid(id)) {
        return response.status(400).json({ error: "The ID is invalid" });
    }

    console.log(id);

    return next();
}

app.put("/repositories/:id", validateId, (request, response) => {
    // TODO
    const { id } = request.params;
    const { title, url, techs, likes } = request.body;
    const repo = { title, url, techs, likes };

    if (isUuid(id)) {
        const repoFoundIndex = repositories.findIndex((repo) => repo.id === id);
        if (repoFoundIndex < 0) {
            return response.status(400).json({ error: "Repo not found" });
        }

        repo.likes = repositories[repoFoundIndex].likes;
        repo.id = id;

        repositories[repoFoundIndex] = repo;

        return response.json(repositories[repoFoundIndex]);
    }

    return response.status(400).json({ error: "Invalid ID" });
});

app.delete("/repositories/:id", (request, response) => {
    // TODO
    const { id } = request.params;

    const repoIndex = repositories.findIndex((repo) => repo.id === id);

    if (repoIndex < 0) {
        return response.status(400).json({ error: "Repo not found" });
    }

    repositories.splice(repoIndex, 1);

    return response.status(204).send("Deleted");
});

app.post("/repositories/:id/like", (request, response) => {
    // TODO
    const { id } = request.params;
    const repo = repositories.find((repo) => repo.id === id);

    if (repo) {
        repo.likes++;
        return response.json(repo);
    } else {
        return response.status(400).json({ error: "This repo does not exist" });
    }
});

module.exports = app;
