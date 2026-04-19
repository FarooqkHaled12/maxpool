const asyncHandler = require('../middleware/asyncHandler');
const BlogPost     = require('../models/BlogPost');

exports.getPosts = asyncHandler(async (req, res) => {
  const { published, limit = 20, page = 1 } = req.query;
  const filter = {};
  if (published !== undefined) filter.published = published === 'true';
  const skip  = (parseInt(page) - 1) * parseInt(limit);
  const total = await BlogPost.countDocuments(filter);
  const posts = await BlogPost.find(filter)
    .sort({ createdAt: -1 }).skip(skip).limit(parseInt(limit))
    .select('-content -contentAr');
  res.json({ success: true, data: posts, total });
});

exports.getPost = asyncHandler(async (req, res) => {
  const post = await BlogPost.findOne({ slug: req.params.slug });
  if (!post) return res.status(404).json({ success: false, error: 'Post not found' });
  res.json({ success: true, data: post });
});

exports.getPostById = asyncHandler(async (req, res) => {
  const post = await BlogPost.findById(req.params.id);
  if (!post) return res.status(404).json({ success: false, error: 'Post not found' });
  res.json({ success: true, data: post });
});

exports.createPost = asyncHandler(async (req, res) => {
  const post = await BlogPost.create(req.body);
  res.status(201).json({ success: true, data: post });
});

exports.updatePost = asyncHandler(async (req, res) => {
  const post = await BlogPost.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!post) return res.status(404).json({ success: false, error: 'Post not found' });
  res.json({ success: true, data: post });
});

exports.deletePost = asyncHandler(async (req, res) => {
  const post = await BlogPost.findByIdAndDelete(req.params.id);
  if (!post) return res.status(404).json({ success: false, error: 'Post not found' });
  res.json({ success: true, message: 'Post deleted' });
});
