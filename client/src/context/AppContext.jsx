import { createContext, useEffect, useState } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const currency = import.meta.env.VITE_CURRENCY;
  const navigate = useNavigate();

  const [allCourses, setAllCourses] = useState([]);
  const [isEducator, setIsEducator] = useState(true);

  // Fetch all courses properly
  const fetchAllCourses = async () => {
    setAllCourses(dummyCourses);
  };

  // Call fetchAllCourses inside useEffect
  useEffect(() => {
    fetchAllCourses();
  }, []);

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

  const value = { currency, allCourses, navigate, calculateRating, isEducator, setIsEducator };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};
