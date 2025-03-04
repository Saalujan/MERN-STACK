import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AppContext } from "../../../context/AppContext.jsx";
import Loading from "../../../components/student/Loading";
import { assets } from "../../../assets/assets";
import humanizeDuration from "humanize-duration";
import Footer from "../../../components/student/Footer";
import YouTube from "react-youtube";
import { toast } from "react-toastify";
import axios from "axios";

const CourseDetails = () => {
  const { id } = useParams();

  const [courseData, setCourseData] = useState(null);
  const [openSection, setOpenSection] = useState({});

  const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
  const [playerData, setPlayerData] = useState(null);

  const {
allCourses,

    calculateRating,
    calculateNoOfLectures,
    calculateChapterTime,
    calculateCourseDuration,
    currency,
    backendUrl,
    userData,
    getToken,
    fetchUserEnrolledCourses,
    enrolledCourses
  } = useContext(AppContext);

  const fetchCourseData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/course/${id}`);
      if (data.success) {
        setCourseData(data.courseData);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
// const findCourse = allCourses.find(
    //   (course) => String(course._id) === String(id)
    // );
    // setCourseData(findCourse);
// const findCourse = allCourses.find(
    //   (course) => String(course._id) === String(id)
    // );
    // setCourseData(findCourse);
  };

  const enrollCourse = async () => {
    try {
      if (!userData) {
        return toast.warn("Login to Enroll");
      }

      if (isAlreadyEnrolled) {
        return toast.warn("Already Enrolled");
      }

      const token = await getToken();
      const { data } = await axios.post(
        `${backendUrl}/api/user/purchase`,
        { courseId: courseData._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        const { session_url } = data;
        window.location.replace(session_url);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, []);

  useEffect(() => {
    if (userData && courseData) {
      setIsAlreadyEnrolled(userData.enrolledCourses.includes(courseData._id));
    }
  }, [userData, courseData]);

  useEffect(() => {
    if (enrolledCourses.length > 0) {
      setIsAlreadyEnrolled(enrolledCourses.some(course => course._id === id));
    }
  }, [enrolledCourses]);

  const toggleSection = (index) => {
    setOpenSection((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return courseData ? (
    <>
      <div className="flex md:flex-row flex-col-reverse gap-10 relative items-start justify-between md:px-36 px-8 md:pt-20 text-left">
        <div className="absolute top-0 left-0 w-full h-section-height -z-1 bg-gradient-to-b from-cyan-100/70 "></div>

        {/* Left Column */}
        <div className="max-w-xl z-10 text-gray-500">
          <h1 className="md:text-course-details-heading-large text-course-details-heading-small font-semibold text-gray-800">
            {courseData.courseTitle}
          </h1>
          <p
            dangerouslySetInnerHTML={{
              __html: courseData.courseDescription.slice(0, 200),
            }}
          ></p>

          {/* Review & Ratings */}
          <div className="flex items-center space-x-2 pt-3 pb-1 text-sm">
            <p>{calculateRating(courseData)}</p>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <img
                  key={i}
                  src={
                    i < Math.floor(calculateRating(courseData))
                      ? assets.star
                      : assets.star_blank
                  }
                  alt=""
                  className="w-3.5 h-3.5"
                />
              ))}
            </div>
            <p className="text-blue-500">
              {courseData.courseRatings.length}{" "}
              {courseData.courseRatings.length > 1 ? "ratings" : "rating"}
            </p>
            <p className="text-blue-500">
              {courseData.courseRatings.length}{" "}
              {courseData.courseRatings.length > 1 ? "students" : "student"}
            </p>
          </div>

          <p className="text-sm">
            Course By{" "}
            <span className="text-blue-600 underline">
              {courseData.educator.name}
            </span>
          </p>

          <div className="pt-8 text-gray-800">
            <h2 className="text-xl font-semibold">Course Structure</h2>
            <div className="pt-5 space-y-3">
              {courseData.courseContent?.map((chapter, index) => (
                <div key={index} className="border border-gray-300 bg-white rounded-md overflow-hidden">
                  {/* Chapter Header */}
                  <div
                    className="flex items-center justify-between p-4 cursor-pointer select-none hover:bg-gray-100 transition"
                    onClick={() => toggleSection(index)}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        className={`w-4 h-4 transform transition-transform ${
                          openSection[index] ? "rotate-180" : ""
                        }`}
                        src={assets.down_arrow_icon}
                        alt="arrow_icon"
                      />
                      <p className="font-medium text-sm md:text-base">{chapter.chapterTitle}</p>
                    </div>
                    <p className="text-xs md:text-sm text-gray-600">
                      {chapter.chapterContent.length} lectures - {calculateChapterTime(chapter)}
                    </p>
                  </div>

                  {/* Chapter Content (Collapsible) */}
                  <div
                    className={`overflow-hidden transition-all duration-500 ${
                      openSection[index] ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <ul className="list-none border-t border-gray-300 bg-gray-50">
                      {chapter.chapterContent.map((lecture, i) => (
                        <li
                          key={i}
                          className="flex items-center justify-between px-5 py-3 border-b border-gray-200 hover:bg-gray-100 transition"
                        >
                          {/* Play Icon */}
                          <div className="flex items-center gap-3">
                            <img src={assets.play_icon} alt="play_icon" className="w-5 h-5" />
                            <p className="text-sm">{lecture.lectureTitle}</p>
                          </div>

                          {/* Preview & Duration */}
                          <div className="text-xs text-gray-600 flex gap-4">
                            {lecture.isPreviewFree && lecture.lectureUrl && (
                              <p
                                onClick={() =>
                                  setPlayerData({
                                    videoId: lecture.lectureUrl.split("/").pop(),
                                  })
                                }
                                className="text-blue-500 cursor-pointer"
                              >
                                Preview
                              </p>
                            )}
                            <p>
                              {humanizeDuration(lecture.lectureDuration * 60 * 1000, {
                                units: ["h", "m"],
                              })}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="py-20 text-sm md:text-default">
            <h3 className="text-xl font-semibold text-gray-800">
              Course Description
            </h3>
            <p
              className="pt-3"
              dangerouslySetInnerHTML={{ __html: courseData.courseDescription }}
            ></p>
          </div>
        </div>

        {/* Right Column */}
        <div className="max-w-course-card z-10 shadow-custom-card rounded-t md:rounded-none md:rounded-r-lg overflow-hidden bg-white min-w-[360px] sm:min-w-[420px]">
          {playerData ? (
            <YouTube
              videoId={playerData.videoId}
              opts={{ playerVars: { autoplay: 1 } }}
              iframeClassName="w-full aspect-video"
            />
          ) : (
            <img
              src={courseData.courseThumbnail}
              alt="course_thumbnail"
              className="w-full h-60 rounded-lg"
            />
          )}

          <div className="p-5">
            <div className="flex items-center gap-2">
              <img
                src={assets.time_left_clock_icon}
                alt="time_left_clock_icon"
                className="w-4"
              />

              <p className="text-red-500">
                <span className="font-medium">5</span> days left at this price!
              </p>
            </div>
            <div className="flex gap-3 items-center pt-3">
              <p className="text-gary-800 md:text-4xl text-2xl font-semibold">
                {currency}{" "}
                {(
                  courseData.coursePrice - 
                  (courseData.discount * courseData.coursePrice) / 100
                ).toFixed(2)}
              </p>
              <p className="md:text-lg text-gray-500 line-through">
                {currency} {courseData.coursePrice}
              </p>
              <p className="md:text-lg text-gray-500">
                {courseData.discount}% off
              </p>
            </div>

            <div className="flex items-center gap-2 pt-3 text-sm md:text-default text-gray-500">
              <div className="flex items-center gap-2">
                <img src={assets.star} alt="star" className="w-4" />
                <p>{calculateRating(courseData)}</p>
              </div>
              <div className="h-4 w-px bg-gray-500/40"></div>
              <div className="flex items-center gap-2">
                <img
                  src={assets.time_clock_icon}
                  alt="clock icon"
                  className="w-4"
                />
                <p>{calculateCourseDuration(courseData)}</p>
              </div>
              <div className="h-4 w-px bg-gray-500/40"></div>
              <div className="flex items-center gap-2">
                <img
                  src={assets.lesson_icon}
                  alt="clock icon"
                  className="w-4"
                />
                <p>{calculateNoOfLectures(courseData)} lessons</p>
              </div>
            </div>
            <button onClick={enrollCourse} className="md:mt-6 mt-4 w-full py-3 round bg-blue-600 text-white font-medium">
              {isAlreadyEnrolled ? "Already Enrolled" : "Enroll Now"}
            </button>

            <div>
              <p>What's in the course</p>
              <ul className="ml-4 pt-2 text-sm md:text-default list-disc text-gray-500">
                <li> Lifetime access to the course</li>
                <li> Step-by-step, hands-on project guidance</li>
                <li> Downloadable resources and source code</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  ) : (
    <Loading />
  );
};

export default CourseDetails;
