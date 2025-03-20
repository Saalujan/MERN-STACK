import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../../context/AppContext";
import { Line } from 'rc-progress';
import Footer from "../../../components/student/Footer";
import { toast } from "react-toastify";
import axios from 'axios';

const MyEnrollments = () => {
  const { enrolledCourses, calculateCourseDuration, navigate, userData, fetchUserEnrolledCourses, backendUrl, getToken, calculateNoOfLectures } = useContext(AppContext);

  const [progressArray, setProgressArray] = useState([]);

  const getCourseProgress = async () => {
    
    try {
      const token = await getToken();
      
      const tempProgressArray = await Promise.all(
        enrolledCourses.map(async (course) => {
          const { data } = await axios.post(`${backendUrl}/api/user/get-course-progress`, { courseId: course._id }, {
            headers: { Authorization: `Bearer ${token}` }
            
          });

   
          let totalLectures = calculateNoOfLectures(course);
          const lectureCompleted = data.progressData ? data.progressData.lectureCompleted.length : 0;
          return { totalLectures, lectureCompleted };
        })
      );
     
      setProgressArray(tempProgressArray);
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (userData) {
      fetchUserEnrolledCourses();
     
    }
  }, [userData]);

  useEffect(() => {
    // if (enrolledCourses.length > 0) {
      getCourseProgress();
      
    // }
  }, [enrolledCourses]);

 
  

  return (
    <>
      <div className="md:px-36 px-6 pt-10">
  <h1 className="text-2xl font-semibold text-gray-900">My Enrollments</h1>
  
  <div className="overflow-x-auto mt-6">
    <table className="w-full border-collapse border mt-4">
      <thead className="text-gray-900 border-b border-gray-300 text-sm bg-gray-100">
        <tr className="text-left">
          <th className="px-6 py-3 font-semibold">Course</th>
          <th className="px-6 py-3 font-semibold max-sm:hidden">Duration</th>
          <th className="px-6 py-3 font-semibold max-sm:hidden">Completed</th>
          <th className="px-6 py-3 font-semibold text-center">Status</th>
        </tr>
      </thead>

      <tbody className="text-gray-700">
        {enrolledCourses.map((course, index) => (
          <tr key={index} className="border-b border-gray-300 even:bg-gray-50">
            {/* Course Thumbnail & Title */}
            <td className="px-6 py-4 flex items-center gap-4">
              <img
                src={course.courseThumbnail}
                alt={course.courseTitle}
                className="w-16 sm:w-20 md:w-24 rounded-md shadow-sm"
              />
              <div className="flex-1">
                <p className="font-medium text-gray-800">{course.courseTitle}</p>
                <Line 
                  strokeWidth={2} 
                  percent={progressArray[index] 
                    ? (progressArray[index].lectureCompleted * 100) / progressArray[index].totalLectures 
                    : 0} 
                  className="bg-gray-300 rounded-full mt-1"
                />
              </div>
            </td>

            {/* Duration */}
            <td className="px-6 py-4 max-sm:hidden text-gray-700">
              {calculateCourseDuration(course)}
            </td>

            {/* Completed Lectures */}
            <td className="px-6 py-4 max-sm:hidden text-gray-700">
              {progressArray[index] 
                ? `${progressArray[index].lectureCompleted} / ${progressArray[index].totalLectures}` 
                : '0 / 0'} <span>Lectures</span>
            </td>

            {/* Status Button */}
            <td className="px-6 py-4 text-center">
              <button 
                className="px-4 py-2 bg-blue-600 text-white text-xs sm:text-sm rounded-md shadow-md hover:bg-blue-700 transition duration-300"
                onClick={() => navigate('/player/' + course._id)}
              >
                {progressArray[index] && 
                  (progressArray[index].lectureCompleted / progressArray[index].totalLectures === 1 
                    ? 'Completed' 
                    : 'On Going')}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>

      <Footer />
    </>
  );
};

export default MyEnrollments;
