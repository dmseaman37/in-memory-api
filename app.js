const express = require('express');
const app = express();
const cors = require('cors');

// const { ENVIRONMENT, PORT } = process.env;
// const IS_DEVELOPMENT = ENVIRONMENT === 'development';

// middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000'
}));

const db = {
  posts: [
    {
      id: 1,
      title: 'Post 1',
      body: 'something here...'
    },
    {
      id: 2,
      title: 'Post 2',
      body: 'something else here...'
    },
    {
      id: 3,
      title: 'Post 3',
      body: 'something else here...'
    }
  ],
  comments: [
    {
      id: 1,
      post: 1,
      body: 'body of the first comment'
    },
    {
      id: 2,
      post: 3,
      body: 'body of the second comment'
    }
  ]
};

// Post routes

app.get('/api/posts', (request, response) => {
  response.json(db.posts);
});

app.post('/api/posts', (request, response) => {
  const post = request.body;
  post.id = db.posts.length + 1;
  db.posts.push(post);
  response.json(post);
});

app.get('/api/posts/:id', (request, response) => {
  const id = Number(request.params.id);
  const post = db.posts.find((post) => {
    return post.id === id;
  });

  if (post) {
    response.json(post);
  } else {
    response.status(404).send();
  }
});

app.delete('/api/posts/:id', (request, response) => {
  const id = Number(request.params.id);
  const post = db.posts.find((post) => {
    return post.id === id;
  });

  if (post) {
    db.posts = db.posts.filter((post) => {
      return post.id !== id;
    });
    response.status(204).send();
  } else {
    response.status(404).send();
  }
});

app.put('/api/posts/:id', (request, response) => {
  const id = Number(request.params.id);
  const post = db.posts.find((post) => {
    return post.id === id;
  });

  if (post) {
    Object.assign(post, request.body)
    response.json(post);
  } else {
    response.status(404).send();
  }
});

// Comment routes

app.get('/api/comments', (request, response) => {
  response.json(db.comments);
});

app.post('/api/comments', (request, response) => {
  const postId = Number(request.body.post);
  const post = db.posts.find((post) => {
    return post.id === postId;
  });

  if (postId) {
    if (post) {
      const comment = request.body;
      comment.id = db.comments.length + 1;
      db.comments.push(comment);
      response.json(comment);
    } else {
      response.status(404).send();
    }
  } else {
    response.status(400);
    response.json({"errors": {"post": "post is required"}});
  }
});

app.get('/api/posts/:id/comments', (request, response) => {
  const id = Number(request.params.id);
  const post = db.posts.find((post) => {
    return post.id === id;
  });

  if (post) {
    const comments = db.comments.filter((comment) => {
      return comment.post === id;
    });
    response.json(comments);
  } else {
    response.staus(404).send();
  }
});

app.delete('/api/comments/:id', (request, response) => {
  const id = Number(request.params.id);
  const comment = db.comments.find((comment) => {
    return comment.id === id;
  });

  if (comment) {
    db.comments = db.comments.filter((comment) => {
      return comment.id !== id;
    });
    response.status(204).send();
  } else {
    response.status(404).send();
  }
});

app.put('/api/comments/:id', (request, response) => {
  const id = Number(request.params.id);
  const comment = db.comments.find((comment) => {
    return comment.id === id;
  });

  if (comment) {
    Object.assign(comment, request.body);
    response.json(comment);
  } else {
    response.status(404).send();
  }
});

app.listen(process.env.PORT || 8000);
