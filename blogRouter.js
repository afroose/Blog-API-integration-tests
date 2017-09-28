const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPosts} = require('./models');

BlogPosts.create(
  '20,000 leagues under the sea', 'a story under water', 'Jules Verne'
);

router.get('/', jsonParser, (req,res) => {
  res.json(BlogPosts.get())
})

router.post('/', jsonParser, (req,res) => {
  const requiredFields = ['title', 'content', 'author'];
  for (let i=0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing field: ${field} in request`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  const blog = BlogPosts.create(req.body.title, req.body.content, req.body.author);
  res.status(201).json(blog);
})

router.put('/:id', jsonParser, (req,res) => {
  const requiredFields = ['id', 'title', 'content', 'author'];
  // check valid fields
  for (let i=0; i< requiredFields.length; i++) {
    const field = requiredFields[i]
    if(!(field in req.body)) {
      const message = `Missing field: ${field} in request}`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
  // check params id matches body id
  if (req.params.id !== req.body.id) {
    const message = `Request id mismatch: params=${req.params.id} - body=${req.body.id}`;
    console.error(message);
    return res.status(400).send(message);
  }
  // update
  BlogPosts.update({
    id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  })
  const message=`Success`;
  console.log(message);
  res.status(204).send(message).end();
})

router.delete('/:id', (req,res) => {
  BlogPosts.delete(req.params.id);
  res.status(204).end();
})

module.exports = router;
