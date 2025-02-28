import express from 'express'
import {addCourse, educatorDashboardData, getEducatorCourses, getEnrolledStudentsData, updateRoleToEducator} from '../controllers/educatorController.js'
import upload from '../configs/multer.js'
import { protectEducator } from '../middlewares/authMiddleWare.js'

const educateRouter =express.Router()

//add educator role

educateRouter.get('/update-role',updateRoleToEducator)
educateRouter.get('/courses',protectEducator,getEducatorCourses)
educateRouter.get('/dashboard',protectEducator,educatorDashboardData)
educateRouter.get('/enrolled-students',protectEducator,getEnrolledStudentsData)
educateRouter.post('/add-course',upload.single('image'),protectEducator,addCourse)


export default educateRouter;