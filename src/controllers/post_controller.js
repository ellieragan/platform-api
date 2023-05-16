import Post from '../models/post_model';

export async function createPost(postFields) {
  // await creating a post
  const post = new Post();
  post.title = postFields.title;
  post.content = postFields.content;
  post.coverUrl = postFields.coverUrl;
  post.tags = postFields.tags;

  // return post
  try {
    const savedpost = await post.save();
    return savedpost;
  } catch (error) {
    throw new Error(`create post error: ${error}`);
  }
}

export async function getPosts() {
  // await finding posts

  const posts = await Post.find({});
  // return posts
  try {
    return posts;
  } catch (error) {
    throw new Error(`get posts error: ${error}`);
  }
}

export async function getPost(id) {
  // await finding one post
  const post = await Post.findById(id);

  // return post
  try {
    return post;
  } catch (error) {
    throw new Error(`get post error: ${error}`);
  }
}

export async function deletePost(id) {
  // await deleting a post

  // return confirmation
  try {
    await Post.findByIdAndRemove(id);
    return 'Post deleted';
  } catch (error) {
    throw new Error(`delete post error: ${error}`);
  }
}

export async function updatePost(id, postFields) {
  // await updating a post by id
  const updatedPost = await Post.findByIdAndUpdate(
    id,
    {
      $set: postFields,
    },
    {
      new: true,
      useFindAndModify: false,
    },
  );

  // return *updated* post
  try {
    return updatedPost;
  } catch (error) {
    throw new Error(`update post error: ${error}`);
  }
}
