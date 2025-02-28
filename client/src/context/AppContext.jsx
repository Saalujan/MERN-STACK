import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import {useAuth, useUser} from '@clerk/clerk-react'

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  const {getToken} =useAuth()
  const  {user} =useUser()

  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(true);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  // Fetch all courses properly
  const fetchAllCourses = async () => {
    setAllCourses(dummyCourses);
  };

  // Call fetchAllCourses inside useEffect
  useEffect(() => {
    fetchAllCourses()
    fetchUserEnrolledCourses();
  }, []);

const logToken = async()=>{
  console.log(await getToken());
}

  useEffect(()=>{
    if(user){
logToken()
    }
  },[user])

  // Function to calculate average rating of a course
  const calculateRating = (course) => {
    if (course.courseRatings.length === 0) {
      return 0;
    }
    let totalRating = 0;
    course.courseRatings.forEach((rating) => {
      totalRating += rating.rating;
    });
    return totalRating / course.courseRatings.length;
  };
//fetch user enrolled courses
  const fetchUserEnrolledCourses =async ()=>
  {
    setEnrolledCourses(dummyCourses)
  }

  const value = { currency, allCourses, navigate, calculateRating, isEducator, setIsEducator,enrolledCourses,fetchUserEnrolledCourses };

  return <AppContext.Provider value={value}>
  {props.children}</AppContext.Provider>;
};
