import React, { useContext } from 'react'
import { Link} from 'react-router-dom'
import CourseCart from './CourseCart'
import { AppContext } from '../../context/AppContext'


const CourseSection = () => {

  const {allCourses} = useContext(AppContext)
 

  
  return (
    <div className='py-16 md:px-40 px-8'>
      <h1 className='text-3xl font-medium text-gray-800'>Learn from the best</h1>
      <p className='text-sm md:text-base text-gray-500 mt-3'>Discover our top-rated courses across various categories. From coding and design to business and wellness, our courses are crafted to deliver results</p>
     
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 px-4 md:px-0 my-10 md:my-16">
  {allCourses &&
    allCourses.slice(0, 4).map((course, index) => (
      <CourseCart key={index} course={course} />
    ))}
</div>


      <Link to={'/course-list'} onClick={()=>scrollTo(0,0)} className='text-gray-500 border border-gray-500/30 px-10 py-3 rounded'>Show All Courses</Link>
     
    </div>
  )
}

export default CourseSection
