import React from 'react';
import Companies from '../../../components/student/Companies';
import Hero from '../../../components/student/Hero';
import CourseSection from '../../../components/student/CourseSection';
import TestMonialSection from '../../../components/student/TestMonialSection';
import CallToAction from '../../../components/student/CallToAction';
import Footer from '../../../components/student/Footer';

const Home = () => {
  return (
    <div className='flex flex-col items-center space-y-7 text-center'>
      <Hero />
      <Companies />
      <CourseSection />
      <TestMonialSection />
      <CallToAction />
      <Footer />
    </div>
  );
};

export default Home;
