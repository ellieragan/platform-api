import { Router } from 'express';
import * as Posts from './controllers/post_controller';
import * as UserController from './controllers/user_controller';
import { requireAuth, requireSignin } from './services/passport';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'welcome to our blog api!' });
});

// your routes will go here
// router.get('/posts', Posts.getPosts);
// router.get('/posts/:id', Posts.getPost);
// router.post('/posts', Posts.createPost);
// router.put('/posts/:id', Posts.updatePost);
// router.delete('/posts/:id', Posts.deletePost);

// router.route('/someroute/:someID')

//   .get(/* your choice of defining inline above or function by reference below */)
//   .delete(exampleHandleDelete);
router.post('/signin', requireSignin, async (req, res) => {
  try {
    const token = UserController.signin(req.user);
    res.json({ token, email: req.user.email });
  } catch (error) {
    res.status(422).send({ error: error.toString() });
  }
});

router.post('/signup', async (req, res) => {
  try {
    const token = await UserController.signup(req.body);
    res.json({ token, email: req.body.email });
  } catch (error) {
    res.status(422).send({ error: error.toString() });
  }
});

router.route('/posts')
  .post(requireAuth, async (req, res) => {
    // use req.body etc to await some contoller function
    // send back the result
    // or catch the error and send back an error
    try {
      const newPost = await Posts.createPost(req.body);
      return res.json(newPost);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  })

  .get(async (req, res) => {
    try {
      const posts = await Posts.getPosts();
      return res.json(posts);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  });

router.route('/posts/:id')
  .get(async (req, res) => {
    try {
      const post = await Posts.getPost(req.params.id);
      if (!post) {
        return res.status(404).json({});
      }
      return res.json(post);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  })

  .put(requireAuth, async (req, res) => {
    try {
      const updatedPost = await Posts.updatePost(req.params.id, req.body);
      return res.json(updatedPost);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  })

  .delete(requireAuth, async (req, res) => {
    try {
      const post = await Posts.deletePost(req.params.id);
      return res.json(post);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  });

export default router;
