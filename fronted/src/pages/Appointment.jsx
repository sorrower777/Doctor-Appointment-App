import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets/assets_frontend/assets";
import PaymentModal from "../components/PaymentModal";

const Appointment = () => {
  const { docid } = useParams(); // Changed from docId to docid to match route
  const {
    doctors,
    bookAppointment,
    cancelAppointment,
    hasAppointmentConflict,
    getUserAppointments,
    isAuthenticated,
  } = useContext(AppContext);
  const navigate = useNavigate();
  const [docInfo, setDocInfo] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success"); // 'success' or 'warning'
  const [relatedDoctors, setRelatedDoctors] = useState([]); // Store related doctors
  const [userAppointments, setUserAppointments] = useState([]);
  const [currentDoctorAppointment, setCurrentDoctorAppointment] =
    useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [pendingAppointmentData, setPendingAppointmentData] = useState(null);

  // Ref for scrolling to doctor details
  const doctorDetailsRef = useRef(null);

  // Generate next 7 days starting from today
  const generateAvailableDays = () => {
    const days = [];
    const today = new Date();

    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);

      const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
      const dateString = date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      const fullDate = date.toISOString().split("T")[0]; // YYYY-MM-DD format

      days.push({
        dayName,
        dateString,
        fullDate,
        isToday: i === 0,
      });
    }
    return days;
  };

  const availableDays = generateAvailableDays();
  const timeSlots = [
    "9:00 AM",
    "10:30 AM",
    "12:00 PM",
    "2:30 PM",
    "4:00 PM",
    "5:30 PM",
  ];

  // Toast functionality
  const displayToast = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 5000); // Hide after 5 seconds
  };

  const showSuccessToast = (message) => {
    displayToast(message, "success");
  };

  const showWarningToast = (message) => {
    displayToast(message, "warning");
  };

  const fetchDocInfo = useCallback(() => {
    // console.log('fetchDocInfo called with docid:', docid);
    // console.log('Available doctors:', doctors);

    if (doctors && doctors.length > 0 && docid) {
      const foundDoc = doctors.find((doc) => doc._id === docid);
      setDocInfo(foundDoc);

      // Find related doctors with same speciality, excluding current doctor
      if (foundDoc) {
        const related = doctors
          .filter(
            (doc) => doc.speciality === foundDoc.speciality && doc._id !== docid
          )
          .slice(0, 4); // Limit to 4 related doctors
        setRelatedDoctors(related);
      }

      // console.log('Found doctor info:', foundDoc);
      // console.log('Doctor image:', foundDoc?.image);
    } else {
      // console.log('No doctors available or no docid provided');
    }
  }, [docid, doctors]);

  // Load user appointments and check for existing appointment with current doctor
  useEffect(() => {
    if (isAuthenticated()) {
      const appointments = getUserAppointments();
      setUserAppointments(appointments);

      // Check if user has appointment with current doctor
      const existingAppointment = appointments.find(
        (apt) => apt.doctorId === docid && apt.status === "confirmed"
      );
      setCurrentDoctorAppointment(existingAppointment);
    }
  }, [docid, getUserAppointments, isAuthenticated]);

  // Payment handlers
  const handlePaymentSuccess = (paymentData) => {
    if (pendingAppointmentData) {
      const newAppointment = bookAppointment(pendingAppointmentData, paymentData);
      if (newAppointment) {
        setCurrentDoctorAppointment(newAppointment);
        showSuccessToast(
          `🎉 Appointment booked and paid successfully!\n\n👨‍⚕️ Doctor: ${pendingAppointmentData.doctorName}\n📅 Date: ${selectedDay.dayName}, ${selectedDay.dateString}\n⏰ Time: ${selectedTimeSlot}\n💰 Fee: $${pendingAppointmentData.fee}\n💳 Payment ID: ${paymentData.paymentId}`
        );
        // Reset selections and modal state
        setSelectedDay(null);
        setSelectedTimeSlot(null);
        setShowPaymentModal(false);
        setPendingAppointmentData(null);
      }
    }
  };

  const handlePaymentCancel = () => {
    setShowPaymentModal(false);
    setPendingAppointmentData(null);
    showWarningToast('Payment cancelled. Please try again to book your appointment.');
  };

  useEffect(() => {
    fetchDocInfo();
  }, [fetchDocInfo]);

  return docInfo ? (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
        {/*--------Doctor Details--------*/}
        <div
          ref={doctorDetailsRef}
          className="flex flex-col lg:flex-row gap-8 bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          {/* Doctor Image Section */}
          <div className="lg:w-1/3 relative">
            <div className="aspect-square lg:aspect-[3/4] bg-gradient-to-br from-blue-50 to-indigo-100 p-6 flex items-center justify-center">
              <img
                className="w-full h-full object-cover rounded-xl shadow-lg"
                src={docInfo?.image}
                alt={docInfo?.name || "Doctor"}
                onError={(e) => {
                  console.error("Image failed to load:", docInfo?.image);
                  e.target.style.backgroundColor = "#f0f0f0";
                  e.target.style.display = "flex";
                  e.target.style.alignItems = "center";
                  e.target.style.justifyContent = "center";
                  e.target.innerHTML = "Image not found";
                }}
                onLoad={() =>
                  console.log("Image loaded successfully:", docInfo?.image)
                }
              />
            </div>
          </div>

          {/* Doctor Information Section */}
          <div className="lg:w-2/3 p-6 lg:p-8 space-y-6">
            {/*---------Doc Info: name, degree, experience---------- */}
            <div className="border-b border-gray-200 pb-6">
              <div className="flex items-center gap-3 mb-4">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-800">
                  {docInfo.name}
                </h1>
                <img
                  src={assets.verified_icon}
                  alt="Verified"
                  className="w-6 h-6 lg:w-8 lg:h-8"
                />
              </div>

              <div className="space-y-3">
                <p className="text-lg text-gray-600 font-medium">
                  {docInfo.degree} - {docInfo.speciality}
                </p>
                <div className="inline-flex items-center bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
                  <span className="mr-2">🏥</span>
                  {docInfo.experience} of experience
                </div>
              </div>
            </div>

            {/*---------About Doctor---------- */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <img src={assets.info_icon} alt="Info" className="w-5 h-5" />
                <h2 className="text-xl font-semibold text-gray-800">
                  About Doctor
                </h2>
              </div>
              <p className="text-gray-600 leading-relaxed text-base">
                {docInfo.about}
              </p>
            </div>

            {/*---------Appointment Fee---------- */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-medium">
                  Appointment Fee
                </span>
                <span className="text-2xl font-bold text-green-600">
                  ${docInfo.fees}
                </span>
              </div>
            </div>

            {/*---------Book/Cancel Appointment Button---------- */}
            <div className="pt-4 space-y-3">
              {!currentDoctorAppointment ? (
                <button
                  onClick={() => {
                    if (!isAuthenticated()) {
                      showWarningToast("Please login to book appointments");
                      navigate("/login");
                      return;
                    }

                    if (selectedDay && selectedTimeSlot) {
                      // Check for time conflicts
                      if (
                        hasAppointmentConflict(
                          docid,
                          selectedDay.fullDate,
                          selectedTimeSlot
                        )
                      ) {
                        showWarningToast(
                          "You already have an appointment with this doctor at this time"
                        );
                        return;
                      }

                      const appointmentData = {
                        doctorId: docid,
                        doctorName: docInfo.name,
                        doctorImage: docInfo.image,
                        speciality: docInfo.speciality,
                        date: selectedDay.fullDate,
                        time: selectedTimeSlot,
                        fee: docInfo.fees,
                        address: docInfo.address,
                      };

                      // Open payment modal instead of directly booking
                      setPendingAppointmentData(appointmentData);
                      setShowPaymentModal(true);
                    } else if (!selectedDay) {
                      showWarningToast("Please select a date first");
                    } else {
                      showWarningToast("Please select a time slot");
                    }
                  }}
                  className={`w-full font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                    selectedDay && selectedTimeSlot
                      ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                      : "bg-gradient-to-r from-gray-400 to-gray-500 text-white cursor-not-allowed"
                  }`}
                  disabled={!selectedDay || !selectedTimeSlot}
                >
                  {selectedDay && selectedTimeSlot
                    ? `Book Appointment - ${selectedDay.dayName} at ${selectedTimeSlot}`
                    : "Select Date & Time to Book"}
                </button>
              ) : (
                <div className="space-y-4">
                  {/* Current Appointment Display */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                    <h3 className="text-lg font-semibold text-green-800 mb-2">
                      Current Appointment
                    </h3>
                    <div className="text-green-700 space-y-1">
                      <p>
                        📅{" "}
                        <span className="font-medium">
                          {new Date(
                            currentDoctorAppointment.date
                          ).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </p>
                      <p>
                        ⏰{" "}
                        <span className="font-medium">
                          {currentDoctorAppointment.time}
                        </span>
                      </p>
                      <p>
                        💰{" "}
                        <span className="font-medium">
                          ${currentDoctorAppointment.fee}
                        </span>
                      </p>
                      <p>
                        📍{" "}
                        <span className="font-medium">
                          {currentDoctorAppointment.address?.line1},{" "}
                          {currentDoctorAppointment.address?.line2}
                        </span>
                      </p>
                      <p>
                        🆔{" "}
                        <span className="font-medium text-xs">
                          ID: {currentDoctorAppointment.id}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Cancel Button */}
                  <button
                    onClick={() => {
                      const success = cancelAppointment(
                        currentDoctorAppointment.id
                      );
                      if (success) {
                        setCurrentDoctorAppointment(null);
                        showWarningToast(
                          `❌ Appointment cancelled successfully!\n\n👨‍⚕️ Doctor: ${
                            docInfo.name
                          }\n📅 Date: ${new Date(
                            currentDoctorAppointment.date
                          ).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}\n⏰ Time: ${
                            currentDoctorAppointment.time
                          }\n\nYou can book a new appointment anytime.`
                        );
                      }
                    }}
                    className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                  >
                    Cancel Appointment
                  </button>
                </div>
              )}

              {/* Show user's other appointments */}
              {userAppointments.length > 1 && (
                <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                  <h3 className="text-lg font-semibold text-blue-800 mb-3">
                    Your Other Appointments (
                    {userAppointments.length -
                      (currentDoctorAppointment ? 1 : 0)}
                    )
                  </h3>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {userAppointments
                      .filter((apt) => apt.id !== currentDoctorAppointment?.id)
                      .slice(0, 3)
                      .map((apt, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-2 bg-white rounded-lg text-sm"
                        >
                          <div>
                            <p className="font-medium text-blue-800">
                              Dr. {apt.doctorName}
                            </p>
                            <p className="text-blue-600">{apt.speciality}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-700">
                              {new Date(apt.date).toLocaleDateString()}
                            </p>
                            <p className="text-gray-600">{apt.time}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                  {userAppointments.length > 4 && (
                    <button
                      onClick={() => navigate("/my-appointments")}
                      className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      View all appointments →
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/*--------Appointment Booking Section--------*/}
        {!currentDoctorAppointment && (
          <div className="mt-8 bg-white rounded-2xl shadow-xl p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Book Your Appointment
            </h2>

            {/* Available Days */}
            <div className="space-y-4 mb-8">
              <h3 className="text-lg font-semibold text-gray-700">
                Select Date
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
                {availableDays.map((day, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedDay(day);
                      setSelectedTimeSlot(null); // Reset time slot when day changes
                    }}
                    className={`p-4 border-2 rounded-lg transition-all duration-200 text-center ${
                      selectedDay?.fullDate === day.fullDate
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "border-gray-200 text-gray-700 hover:bg-blue-50 hover:border-blue-400"
                    } ${day.isToday ? "ring-2 ring-green-300" : ""}`}
                  >
                    <div className="font-semibold text-sm">
                      {day.isToday ? "Today" : day.dayName}
                    </div>
                    <div className="text-xs mt-1 opacity-75">
                      {day.dateString}
                    </div>
                  </button>
                ))}
              </div>
              {selectedDay && (
                <p className="text-green-600 font-medium mt-2">
                  ✓ Selected Date: {selectedDay.dayName},{" "}
                  {selectedDay.dateString}
                </p>
              )}
            </div>

            {/* Available Time Slots */}
            {selectedDay && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">
                  Available Time Slots for {selectedDay.dayName}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {timeSlots.map((time, index) => {
                    const isConflicted = hasAppointmentConflict(
                      docid,
                      selectedDay.fullDate,
                      time
                    );
                    return (
                      <button
                        key={index}
                        onClick={() => {
                          if (!isConflicted) {
                            setSelectedTimeSlot(time);
                          } else {
                            showWarningToast(
                              "This time slot conflicts with your existing appointment"
                            );
                          }
                        }}
                        disabled={isConflicted}
                        className={`p-3 border-2 rounded-lg transition-all duration-200 font-medium ${
                          isConflicted
                            ? "bg-red-100 border-red-300 text-red-500 cursor-not-allowed"
                            : selectedTimeSlot === time
                            ? "bg-green-600 border-green-600 text-white"
                            : "border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-400"
                        }`}
                      >
                        {time}
                        {isConflicted && (
                          <div className="text-xs mt-1">Booked</div>
                        )}
                      </button>
                    );
                  })}
                </div>
                {selectedTimeSlot && (
                  <p className="text-green-600 font-medium mt-2">
                    ✓ Selected Time: {selectedTimeSlot} on {selectedDay.dayName}
                  </p>
                )}
              </div>
            )}

            {!selectedDay && (
              <div className="text-center py-8 text-gray-500">
                <p>Please select a date to view available time slots</p>
              </div>
            )}

            {/* Contact Information */}
            <div className="mt-8 p-4 bg-gray-50 rounded-xl">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Contact Information
              </h3>
              <div className="space-y-2 text-gray-600">
                <p>
                  <span className="font-medium">Address:</span>{" "}
                  {docInfo.address?.line1}, {docInfo.address?.line2}
                </p>
                <p>
                  <span className="font-medium">Availability:</span>{" "}
                  {docInfo.available ? "Available" : "Not Available"}
                </p>
                <p>
                  <span className="font-medium">Timezone:</span>{" "}
                  {Intl.DateTimeFormat().resolvedOptions().timeZone} (
                  {
                    new Date()
                      .toLocaleTimeString("en-US", { timeZoneName: "short" })
                      .split(" ")[2]
                  }
                  )
                </p>
                <p>
                  <span className="font-medium">Working Days:</span> Monday -
                  Saturday
                </p>
                <p>
                  <span className="font-medium">Working Hours:</span> 9:00 AM -
                  6:00 PM
                </p>
              </div>
            </div>
          </div>
        )}

        {/*--------Related Doctors Section--------*/}
        {relatedDoctors.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow-xl p-6 lg:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              More {docInfo.speciality} Doctors
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedDoctors.map((doctor, index) => (
                <div
                  key={index}
                  onClick={() => {
                    navigate(`/appointment/${doctor._id}`);
                    // Scroll to doctor details after navigation
                    setTimeout(() => {
                      if (doctorDetailsRef.current) {
                        doctorDetailsRef.current.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                      }
                    }, 100);
                  }}
                  className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105 group"
                >
                  {/* Doctor Image */}
                  <div className="aspect-square bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-3 mb-4 overflow-hidden">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-full h-full object-cover rounded-lg group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.backgroundColor = "#f0f0f0";
                        e.target.style.display = "flex";
                        e.target.style.alignItems = "center";
                        e.target.style.justifyContent = "center";
                        e.target.innerHTML = "Image not found";
                      }}
                    />
                  </div>

                  {/* Doctor Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-1">
                      <h3 className="font-semibold text-gray-800 text-sm group-hover:text-blue-600 transition-colors duration-200">
                        {doctor.name}
                      </h3>
                      <img
                        src={assets.verified_icon}
                        alt="Verified"
                        className="w-3 h-3"
                      />
                    </div>

                    <p className="text-xs text-gray-600">{doctor.speciality}</p>

                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        {doctor.available ? "Available" : "Busy"}
                      </span>
                      <span className="text-sm font-semibold text-green-600">
                        ${doctor.fees}
                      </span>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/appointment/${doctor._id}`);
                          // Scroll to doctor details after navigation
                          setTimeout(() => {
                            if (doctorDetailsRef.current) {
                              doctorDetailsRef.current.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                              });
                            }
                          }, 100);
                        }}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                      >
                        Book Appointment
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* View All Button */}
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate(`/doctors/${docInfo.speciality}`)}
                className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors duration-200"
              >
                View All {docInfo.speciality} Doctors
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {showToast && (
          <div
            className={`fixed top-4 right-4 z-50 transform transition-all duration-500 ease-in-out ${
              showToast
                ? "translate-x-0 opacity-100"
                : "translate-x-full opacity-0"
            }`}
          >
            <div
              className={`bg-white border-l-4 ${
                toastType === "success" ? "border-green-500" : "border-red-500"
              } rounded-lg shadow-2xl p-4 max-w-sm`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div
                    className={`w-8 h-8 ${
                      toastType === "success" ? "bg-green-100" : "bg-red-100"
                    } rounded-full flex items-center justify-center`}
                  >
                    {toastType === "success" ? (
                      <svg
                        className="w-5 h-5 text-green-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5 text-red-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">
                    {toastType === "success"
                      ? "Booking Confirmed!"
                      : "Appointment Cancelled!"}
                  </h3>
                  <div className="text-sm text-gray-600 whitespace-pre-line">
                    {toastMessage}
                  </div>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <button
                    onClick={() => setShowToast(false)}
                    className="inline-flex text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      {/* Payment Modal */}
      {showPaymentModal && pendingAppointmentData && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          appointmentData={pendingAppointmentData}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentCancel={handlePaymentCancel}
        />
      )}
    </div>
  ) : null;
};

export default Appointment;
