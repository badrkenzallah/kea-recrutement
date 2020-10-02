const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { postService, candidatureService, userService } = require('../services');
const multer  = require('multer')

const createPost = catchAsync(async (req, res) => {
  const post = await postService.createPost(req.body);
  res.status(httpStatus.CREATED).send(post);
});

const uploadCV = multer({ dest: 'uploads/' }).single('cv')
const postuler = catchAsync(async (req, res) => {
  const upload = () => new Promise((resolve, reject) => {
    uploadCV(req, res, (err) => {
      if(err)
        return reject(err);


      resolve(req)
    })
  })

  const post = await postService.getPostById(req.params.postId);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
  }

  if (!post.canAcceptCandidate()) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post has no available places');
  }

  await upload();

  if(!req.file || req.file.mimetype !== 'application/pdf') {
    res.status(httpStatus.BAD_REQUEST).send({error: 'CV must be a PDF file'});
    return;
  }

  // make candidature
  const candidature = await candidatureService.createCandidature({
    candidate: req.user.id,
    post: req.params.postId,
    cv: req.file.path
  })

  try {
    // update post's availablePlaces
    await postService.addNewCandidate(req.params.postId, candidature.id);
    await userService.saveCandidature(req.user, candidature.id)
  } catch (error) {
    await candidature.delete()
    throw new ApiError(httpStatus.BAD_REQUEST, "Couldn't create candidature");
  }

  // @todo deja postuler

  res.status(httpStatus.CREATED).send(candidature);
});

const getPosts = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['name', 'role']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await postService.queryPosts(filter, options);
  res.send(result);
});

const getPost = catchAsync(async (req, res) => {
  const post = await postService.getPostById(req.params.postId);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Post not found');
  }

  console.log('req.user.role', req.user.role)

  if(req.user.role === 'recruiter') {
    await post.populate('candidatures').execPopulate()
    const p = post.candidatures.map(candidature => candidature.populate('candidate').execPopulate())
    await Promise.all(p)
  } else {
    delete post.candidatures
  }

  res.send(post);
});

const updatePost = catchAsync(async (req, res) => {
  const post = await postService.updatePostById(req.params.postId, req.body);
  res.send(post);
});

const deletePost = catchAsync(async (req, res) => {
  await postService.deletePostById(req.params.postId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createPost,
  postuler,
  getPosts,
  getPost,
  updatePost,
  deletePost,
};
