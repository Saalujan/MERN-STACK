import React, { useContext, useEffect, useState } from 'react';
import Loading from '../../components/student/Loading';
import { AppContext } from '../../context/AppContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const StudentEnrolled = () => {
  const { backendUrl, getToken, isEducator } = useContext(AppContext);
  const [enrolledStudents, setEnrolledStudents] = useState(null);

  const fetchEnrolledStudents = async () => {
    try {
      const token = await getToken();
      const { data } = await axios.get(`${backendUrl}/api/educator/enrolled-students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
     
      if (data.success) {
        setEnrolledStudents(data.enrolledStudents.length > 0 ? data.enrolledStudents.reverse() : []);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (isEducator) {
      fetchEnrolledStudents();
    }
  }, [isEducator]);

  return enrolledStudents ? (
    <div className='h-screen flex flex-col items-start justify-between md:p-8 md:pb-0 p-4 pt-8 pb-0'>
      <div className='flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20'>
        <table className="md:table-auto table-fixed w-full overflow-hidden">
          <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
            <tr>
              <th className="px-4 py-3 font-semibold truncate">#</th>
              <th className="px-4 py-3 font-semibold truncate">Student Name</th>
              <th className="px-4 py-3 font-semibold truncate">Course Title</th>
              <th className="px-4 py-3 font-semibold truncate">Date</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {enrolledStudents.length > 0 ? (
              enrolledStudents.map((item, index) => (
                <tr key={index} className="border-b border-gray-500/20">
                  <td className="px-4 py-3 text-center">{index + 1}</td>
                  <td className='md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3'>
                    <img
                      src={item.student.imageUrl}
                      alt="profile"
                      className="w-9 h-9 rounded-full"
                    />
                    <span className='truncate'>
                      {item.student.name}
                    </span>
                  </td>
                  <td className="px-4 py-3 truncate">{item.courseTitle}</td>
                  <td className="px-4 py-3 truncate">{new Date(item.purchaseDate).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-4 py-3 text-center text-gray-500">
                  No enrolled students found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  ) : <Loading />;
};

export default StudentEnrolled;
