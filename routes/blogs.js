const express = require("express");
const path = require("path");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const fetchuser = require('../middleware/getuser')
const Blog = require('../models/blogs')

//? ROUTE 1 : Fetching All Blogs on: GET "/api/blogs/fetchnotes", Login Required
router.get("/fetchnotes", fetchuser, async (req, res) => {
  try {
    // console.log(req.user)
    const blogs = await Blog.find().sort({date: -1})
    return res.send({ blogs })
  } catch (error) {
    success = false
    console.log(error);
    return res.status(500).json({ success, error: "Internal Server Error" });
  }
});


//? ROUTE 2 : Adding a New Blog on: POST "/api/blogs/addblog", Login Required
router.post("/addblog", fetchuser, [
  body('title', 'Title Should be Atleast 3 Characters').isLength({ min: 3 }),
  body('desc', 'Description Should be Atleast 5 Characters').isLength({ min: 5 }),
  body('body', 'Blog-Body Should be Atleast 5 Characters').isLength({ min: 5 })
], async (req, res) => {
  success = false
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }
  console.log(req.user)
  const { title, desc, body, tag, image } = req.body
  try {
    const blog = new Blog({
      title: title,
      description: desc,
      data: body,
      tag: tag,
      userid: req.user.id,
      username: req.user.username,
      image: image
    })

    await blog.save()
    success = true
    return res.json({ success, msg: "Blog Added SuccessFully" })

  } catch (error) {
    success = false
    console.log(error);
    return res.status(500).json({ success, error: "Internal Server Error" });
  }
});


//? ROUTE 3 : Editing an Exisiting Blog on: PUT "/api/blogs/editblog/:id", Login Required
router.put("/editblog/:id", fetchuser, async (req, res) => {
  success = false
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }
  try {


    const { title, desc, body, tag, image } = req.body

    const newBlog = {}
    if (title) { newBlog.title = title }
    if (desc) { newBlog.description = desc }
    if (body) { newBlog.data = body }
    if (image) { newBlog.image = image }
    if (tag) { newBlog.tag = tag }

    let blog = await Blog.findById(req.params.id)
    if (!blog) {
      return res.status(404).json({ success, msg: "The Blog does not Exists Anymore" })
    }

    if (blog.userid.toString() !== req.user.id) {
      return res.status(401).json({ success, msg: "Action Not Allowed" })
    }

    blog = await Blog.findByIdAndUpdate(req.params.id, { $set: newBlog }, { new: true })
    success = true
    return res.json({ success, msg: "Blog Updated SuccessFully" })

  } catch (error) {
    success = false
    console.log(error);
    return res.status(500).json({ success, error: "Internal Server Error" });
  }
})

//? ROUTE 4 : Deleting an Exisiting Blog on: DELETE "/api/blogs/deleteblog/:id", Login Required
router.delete("/deleteblog/:id", fetchuser, async (req, res) => {
  success = false
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }
  try {

    let blog = await Blog.findById(req.params.id)
    if (!blog) {
      return res.status(404).json({ success, msg: "The Blog does not Exists Anymore" })
    }

    if (blog.userid.toString() !== req.user.id) {
      return res.status(401).json({ success, msg: "Action Not Allowed" })
    }

    blog = await Blog.findByIdAndDelete(req.params.id)
    success = true
    return res.json({ success, msg: "Blog Deleted SuccessFully" })

  } catch (error) {
    success = false
    console.log(error);
    return res.status(500).json({ success, error: "Internal Server Error" });
  }
})

//? ROUTE 5 : Fetching 1 Blog by ID on: GET "/api/blogs/onenote/:id", Login Required
router.get("/oneblog/:id", fetchuser, async (req, res) => {
  try {
    let blog = await Blog.findById(req.params.id)

    if (!blog) {
      return res.status(404).json({ success, msg: "The Blog does not Exists Anymore" })
    }

    return res.send({ blog })
  } catch (error) {
    success = false
    console.log(error);
    return res.status(500).json({ success, error: "Internal Server Error" });
  }
});

//? ROUTE 6 : Fetching All Blogs by UserID on: GET "/api/blogs/editblog/", Login Required
router.get("/editblog", fetchuser, async (req, res) => {
  try {
    let blog = await Blog.find({ userid: req.user.id }).sort({date: -1})

    if (!blog) {
      return res.status(404).json({ success, msg: "The Blog does not Exists Anymore" })
    }

    return res.send({ blog })
  } catch (error) {
    success = false
    console.log(error);
    return res.status(500).json({ success, error: "Internal Server Error" });
  }
});




module.exports = router;