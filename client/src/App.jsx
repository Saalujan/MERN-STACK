import React from "react";
import { Route, Routes } from "react-router-dom";

import Home from "./pages/educator/student/Home";
import CourseList from "./pages/educator/student/CourseList";
import CourseDetails from "./pages/educator/student/CourseDetails";
import MyEnrollments from "./pages/educator/student/MyEnrollments";
import Player from "./pages/educator/student/Player";
import Loading from "./components/student/Loading";
import Educator from "./pages/educator/Educator";
import DashBoard from "./pages/educator/DashBoard";
import AddCourse from "./pages/educator/AddCourse";
import StudentEnrolled from "./pages/educator/StudentEnrolled";
import MyCourse from "./pages/educator/MyCourse";
import Navbar from './components/student/Navbar'


const App = () => {
  return (
    <div>
    <Navbar/>
    
      <Routes>
       
        <Route path="/" element={<Home />} />
         <Route path="/course-list" element={<CourseList />} /> 
        <Route path="/course/:id" element={<CourseDetails />} />
        <Route path="/course-list/:input" element={<CourseList />} />
        <Route path="/my-enrollments" element={<MyEnrollments />} />
        <Route path="/player/:courseId" element={<Player />} />
        <Route path="/loading/:path" element={<Loading />} /> 

        {/* Educator Routes */}
        <Route path="/educator" element={<Educator />}>
          <Route index element={<DashBoard />} />
          <Route path="add-course" element={<AddCourse />} />
          <Route path="my-courses" element={<MyCourse />} />
          <Route path="student-enrolled" element={<StudentEnrolled />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
