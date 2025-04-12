import React, { useContext, useEffect,useState } from "react";
import { AuthContext } from "./context/AuthContext"; // update path if needed
import { useRouter } from "expo-router";
import{
  View,
  Text,
  ScrollView,
  Modal,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { AntDesign, Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LineChart } from "react-native-chart-kit";
import styles from "./styles/ProfessorDashboard.style"
const screenWidth = Dimensions.get("window").width;

// Dummy Data (replace with real APIs if needed)
const professorCourses = [
  { id: "1", name: "CS101" },
  { id: "2", name: "PROG201" },
];
const dummyStudent = { id: "123", name: "Aman Gupta" };
const router=useRouter();

const AttendanceAccessScreen = () => {
  const [isAttendanceModalVisible, setIsAttendanceModalVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(professorCourses[0]);
  const [attendanceDate, setAttendanceDate] = useState("");
  const [attendanceStatus, setAttendanceStatus] = useState<{ [studentId: string]: "present" | "absent" }>({});
  const [isLoading, setIsLoading] = useState(false);
  const auth= useContext(AuthContext);

  const handleSaveAttendance = () => {
    setIsLoading(true);
    // simulate save
    setTimeout(() => {
      setIsLoading(false);
      setIsAttendanceModalVisible(false);
      setAttendanceStatus({});
    }, 1000);
  };

  const attendanceData = {
    labels: ["CS101", "PROG201", "DB301"],
    datasets: [{ data: [85, 92, 78], strokeWidth: 2 }],
  };
  useEffect(() => {
    if (!auth?.user) return;

    if (auth.user.role !== "student" || !auth.user.hasAccess) {
      console.warn("🚫 Unauthorized access to AttendanceAccessScreen");
      router.replace("/login"); // or /studentDashboard
    }
  }, [auth?.user]);

  if (auth?.isLoading || !auth?.user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
        <Text>Loading...</Text>
      </View>
    );
  }

  if (auth.user.role !== "student" || !auth.user.hasAccess) {
    return null; // or show a 403 message
  }

  return (
    <>
      <ScrollView style={{ flex: 1, backgroundColor: "#f8f9ff", padding: 20 }}>
        <Text style={styles.tabTitle}>Attendance Management</Text>

        {/* Filters */}
        <View style={styles.attendanceFilters}>
          {["All Courses", "CS101", "PROG201", "DB301"].map((course, idx) => (
            <TouchableOpacity key={idx} style={[styles.filterButton, idx === 0 && styles.activeFilter]}>
              <Text style={idx === 0 ? styles.activeFilterText : styles.filterText}>{course}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style ={{marginTop :20,marginBottom:20}}>
        <TouchableOpacity

          style={{

            backgroundColor: "#4252e5",

            padding: 12,

            borderRadius: 8,

            alignItems: "center",

            marginTop: 20,

          }}

          onPress={() => router.replace(`/student/${auth.user.userId}`)}

        >

          <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>Go to Dashboard</Text>

        </TouchableOpacity>
        </View>

        {/* Actions */}
        <View style={styles.attendanceActions}>
          <TouchableOpacity style={styles.attendanceAction} onPress={() => setIsAttendanceModalVisible(true)}>
            <MaterialIcons name="add" size={24} color="#4252e5" />
            <Text style={styles.attendanceActionText}>Take Attendance</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.attendanceAction}>
            <MaterialIcons name="history" size={24} color="#4252e5" />
            <Text style={styles.attendanceActionText}>View History</Text>
          </TouchableOpacity>
        </View>

        {/* Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Attendance Trends</Text>
          <LineChart
            data={attendanceData}
            width={screenWidth - 40}
            height={220}
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(76, 82, 229, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              propsForDots: {
                r: "6",
                strokeWidth: "2",
                stroke: "#5c51f3",
              },
            }}
            bezier
            style={styles.chart}
          />
        </View>

        {/* Records */}
        <Text style={styles.sectionTitle}>Recent Attendance Records</Text>
        {[
          { date: "April 7, 2025", course: "CS101", present: 28, absent: 4, rate: "87.5%" },
          { date: "April 6, 2025", course: "PROG201", present: 22, absent: 2, rate: "91.7%" },
        ].map((record, index) => (
          <View style={styles.attendanceRecord} key={index}>
            <View style={styles.attendanceRecordHeader}>
              <Text style={styles.attendanceRecordDate}>{record.date}</Text>
              <View style={[styles.courseTag, { backgroundColor: "#52c4eb" }]}>
                <Text style={styles.courseTagText}>{record.course}</Text>
              </View>
            </View>
            <View style={styles.attendanceStats}>
              <View style={styles.attendanceStat}>
                <Text style={styles.attendanceStatValue}>{record.present}</Text>
                <Text style={styles.attendanceStatLabel}>Present</Text>
              </View>
              <View style={styles.attendanceStat}>
                <Text style={styles.attendanceStatValue}>{record.absent}</Text>
                <Text style={styles.attendanceStatLabel}>Absent</Text>
              </View>
              <View style={styles.attendanceStat}>
                <Text style={styles.attendanceStatValue}>{record.rate}</Text>
                <Text style={styles.attendanceStatLabel}>Attendance Rate</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Modal */}
      <Modal visible={isAttendanceModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Take Attendance</Text>
              <TouchableOpacity onPress={() => setIsAttendanceModalVisible(false)}>
                <AntDesign name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <Text style={styles.inputLabel}>Date</Text>
              <TextInput
                style={styles.textInput}
                placeholder="YYYY-MM-DD"
                value={attendanceDate}
                onChangeText={setAttendanceDate}
              />

              <Text style={styles.inputLabel}>Course</Text>
              <View style={styles.pickerContainer}>
                {professorCourses.map((course) => (
                  <TouchableOpacity
                    key={course.id}
                    style={[
                      styles.courseOption,
                      selectedCourse?.id === course.id && styles.selectedCourseOption,
                    ]}
                    onPress={() => setSelectedCourse(course)}
                  >
                    <Text
                      style={[
                        styles.courseOptionText,
                        selectedCourse?.id === course.id && styles.selectedCourseOptionText,
                      ]}
                    >
                      {course.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.inputLabel}>Students</Text>
              <View style={styles.attendanceList}>
                <View style={styles.attendanceListItem}>
                  <View style={styles.attendanceStudentInfo}>
                    <View style={styles.studentAvatar}>
                      <Ionicons name="person" size={20} color="white" />
                    </View>
                    <Text style={styles.attendanceStudentName}>{dummyStudent.name}</Text>
                  </View>
                  <View style={styles.attendanceOptions}>
                    <TouchableOpacity
                      style={[
                        styles.attendanceOption,
                        attendanceStatus[dummyStudent.id] === "present" && styles.presentOption,
                      ]}
                      onPress={() =>
                        setAttendanceStatus({ ...attendanceStatus, [dummyStudent.id]: "present" })
                      }
                    >
                      <Feather
                        name="check"
                        size={20}
                        color={attendanceStatus[dummyStudent.id] === "present" ? "white" : "#4252e5"}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.attendanceOption,
                        attendanceStatus[dummyStudent.id] === "absent" && styles.absentOption,
                      ]}
                      onPress={() =>
                        setAttendanceStatus({ ...attendanceStatus, [dummyStudent.id]: "absent" })
                      }
                    >
                      <Feather
                        name="x"
                        size={20}
                        color={attendanceStatus[dummyStudent.id] === "absent" ? "white" : "#ff5694"}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={styles.submitButton}
                onPress={handleSaveAttendance}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.submitButtonText}>Save Attendance</Text>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default AttendanceAccessScreen;