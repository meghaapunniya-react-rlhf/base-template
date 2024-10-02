import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const gradePoints = {
  "O": 5.0,   // Outstanding
  "A+": 4.5,
  "A": 4.0,
  "B+": 3.5,
  "B": 3.0,
  "C+": 2.5,
  "C": 2.0,
  "D+": 1.5,
  "D": 1.0,
  "F": 0.0    // Fail
};

function CourseForm({ addCourse, isEdit, initialData, onSave }) {
  const [courseName, setCourseName] = useState(initialData?.name || "");
  const [grade, setGrade] = useState(initialData?.grade || "A");
  const [creditHours, setCreditHours] = useState(initialData?.creditHours || 3);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (courseName && grade && creditHours) {
      const courseData = {
        name: courseName,
        grade,
        creditHours: Number(creditHours),
        gradePoints: gradePoints[grade] * Number(creditHours),
      };
      if (isEdit) {
        onSave(courseData);
      } else {
        addCourse(courseData);
      }
      setCourseName("");
      setGrade("A");
      setCreditHours(3);
    }
  };

  useEffect(() => {
    if (isEdit && initialData) {
      setCourseName(initialData.name);
      setGrade(initialData.grade);
      setCreditHours(initialData.creditHours);
    }
  }, [isEdit, initialData]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        value={courseName}
        onChange={(e) => setCourseName(e.target.value)}
        placeholder="Course Name"
        required
      />
      <Select value={grade} onValueChange={setGrade}>
        <SelectTrigger>
          <SelectValue placeholder="Select a grade" />
        </SelectTrigger>
        <SelectContent>
          {Object.keys(gradePoints).map((g) => (
            <SelectItem key={g} value={g}>
              {g}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="number"
        value={creditHours}
        onChange={(e) => setCreditHours(e.target.value)}
        min="1"
        max="6"
        required
      />
      <Button type="submit" className="w-full">
        {isEdit ? "Save" : "Add Course"}
      </Button>
    </form>
  );
}

function CourseList({ courses, editCourse, removeCourse }) {
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [isRemoveDialogOpen, setRemoveDialogOpen] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [removeIndex, setRemoveIndex] = useState(null);

  const openEditDialog = (course) => {
    setCurrentCourse(course);
    setEditDialogOpen(true);
  };

  const closeEditDialog = () => {
    setCurrentCourse(null);
    setEditDialogOpen(false);
  };

  const openRemoveDialog = (index) => {
    setRemoveIndex(index);
    setRemoveDialogOpen(true);
  };

  const closeRemoveDialog = () => {
    setRemoveIndex(null);
    setRemoveDialogOpen(false);
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Course Name</TableHead>
          <TableHead>Grade</TableHead>
          <TableHead>Credit Hours</TableHead>
          <TableHead>Grade Points</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {courses.map((course, index) => (
          <TableRow key={index}>
            <TableCell>{course.name}</TableCell>
            <TableCell>{course.grade}</TableCell>
            <TableCell>{course.creditHours}</TableCell>
            <TableCell>{course.gradePoints.toFixed(2)}</TableCell>
            <TableCell>
              <Button variant="outline" size="sm" className="mr-2" onClick={() => openEditDialog(course)}>
                Edit
              </Button>
              <Button variant="destructive" size="sm" className="mr-2" onClick={() => openRemoveDialog(index)}>
                Remove
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Course</DialogTitle>
            <DialogDescription>
              Make changes to your course here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          {currentCourse && (
            <CourseForm
              isEdit={true}
              initialData={currentCourse}
              onSave={(updatedCourse) => {
                editCourse(courses.indexOf(currentCourse), updatedCourse);
                closeEditDialog();
              }}
            />
          )}
          <Button variant="outline" onClick={closeEditDialog}>Cancel</Button>
        </DialogContent>
      </Dialog>

      {/* Remove Confirmation Dialog */}
      <Dialog open={isRemoveDialogOpen} onOpenChange={setRemoveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Removal</DialogTitle>
            <DialogDescription>
              Are you sure you want to remove this course?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="submit" onClick={() => {
              if (removeIndex !== null) {
                removeCourse(removeIndex);
              }
              closeRemoveDialog();
            }}>
              Yes, Remove
            </Button>
            <Button variant="outline" onClick={closeRemoveDialog}>Cancel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Table>
  );
}

function GPAResult({ gpa }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your GPA</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold">{gpa.toFixed(2)}</p>
      </CardContent>
    </Card>
  );
}

export default function App() {
  const [courses, setCourses] = useState([]);
  const [gpa, setGPA] = useState(0);

  useEffect(() => {
    calculateGPA();
  }, [courses]);

  const addCourse = (course) => {
    setCourses([...courses, course]);
  };

  const editCourse = (index, updatedCourse) => {
    const newCourses = [...courses];
    newCourses[index] = updatedCourse;
    setCourses(newCourses);
  };

  const removeCourse = (index) => {
    const newCourses = courses.filter((_, i) => i !== index);
    setCourses(newCourses);
  };

  const calculateGPA = () => {
    if (courses.length === 0) {
      setGPA(0);
      return;
    }
    const totalGradePoints = courses.reduce(
      (sum, course) => sum + course.gradePoints,
      0
    );
    const totalCreditHours = courses.reduce(
      (sum, course) => sum + course.creditHours,
      0
    );
    setGPA(totalGradePoints / totalCreditHours);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 text-center">GPA Calculator</h1>
      <div className="grid gap-6 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Add Course</CardTitle>
            <CardDescription>Enter your course details below</CardDescription>
          </CardHeader>
          <CardContent>
            <CourseForm addCourse={addCourse} />
          </CardContent>
        </Card>
        <GPAResult gpa={gpa} />
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Course List</h2>
        <CourseList
          courses={courses}
          editCourse={editCourse}
          removeCourse={removeCourse}
        />
      </div>
    </div>
  );
}