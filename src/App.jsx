import React, { useState } from 'react';
import { Button, Input, Select, SelectItem, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@/components/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Grade to points mapping
const gradeToPoints = {
  'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C+': 5, 'C': 4, 'D+': 3, 'D': 2, 'F': 0
};

function GPAForm({ onSubmit, initialValues = {}, onCancel }) {
  const [course, setCourse] = useState(initialValues.course || '');
  const [grade, setGrade] = useState(initialValues.grade || 'O');
  const [creditHours, setCreditHours] = useState(initialValues.creditHours || 1);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ course, grade, creditHours: parseInt(creditHours, 10) });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input type="text" value={course} onChange={(e) => setCourse(e.target.value)} placeholder="Course Name" required />
      <Select value={grade} onChange={setGrade}>
        {Object.keys(gradeToPoints).map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}
      </Select>
      <Input type="number" value={creditHours} onChange={(e) => setCreditHours(e.target.value)} min="1" max="6" placeholder="Credit Hours" />
      <Button type="submit">Submit</Button>
      {onCancel && <Button variant="destructive" onClick={onCancel}>Cancel</</Button>}
    </form>
  );
}

function CourseList({ courses, onEdit, onDelete }) {
  return (
    <div className="mt-4">
      {courses.map((course, index) => (
        <Card key={index} className="mb-2">
          <CardContent>
            <div className="grid grid-cols-5 gap-4 items-center">
              <span>{course.course}</span>
              <span>{course.grade}</span>
              <span>{course.creditHours}</span>
              <span>{(gradeToPoints[course.grade] * course.creditHours).toFixed(2)}</span>
              <div>
                <Button onClick={() => onEdit(course)}>Edit</Button>
                <Button className="ml-2" variant="destructive" onClick={() => onDelete(index)}>Delete</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function App() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [courses, setCourses] = useState([]);
  const [editCourse, setEditCourse] = useState(null);

  const handleAddCourse = (course) => {
    if (editCourse !== null) {
      const updatedCourses = [...courses];
      updatedCourses[editCourse] = course;
      setCourses(updatedCourses);
      setEditCourse(null);
    } else {
      setCourses([...courses, course]);
    }
    onClose();
  };

  const handleEdit = (course) => {
    setEditCourse(courses.indexOf(course));
    onOpen();
  };

  const handleDelete = (index) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      setCourses(courses.filter((_, i) => i !== index));
    }
  };

  const totalCreditHours = courses.reduce((sum, course) => sum + course.creditHours, 0);
  const totalGradePoints = courses.reduce((sum, course) => sum + (gradeToPoints[course.grade] * course.creditHours), 0);
  const gpa = totalCreditHours > 0 ? (totalGradePoints / totalCreditHours).toFixed(2) : '0.00';

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>GPA Calculator</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={onOpen}>Add Course</Button>
          <CourseList courses={courses} onEdit={handleEdit} onDelete={handleDelete} />
          <div className="mt-4 text-center">
            <h3 className="text-xl font-bold">Current GPA: {gpa}</h3>
          </div>
        </CardContent>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          <GPAForm 
            onSubmit={handleAddCourse} 
            onCancel={onClose}
            initialValues={editCourse !== null ? courses[editCourse] : {}}
          />
        </ModalContent>
      </Modal>
    </div>
  );
}