import React, { useState } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

function gradeToPoints(grade) {
  const gradeMap = {
    'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C+': 5, 'C': 4, 'D+': 3, 'D': 2, 'F': 0
  };
  return gradeMap[grade] || 0;
}

function CourseForm({ onSubmit, initialValues = { name: '', grade: 'A', credits: 1 }, onCancel }) {
  const [course, setCourse] = useState(initialValues);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(course);
    setCourse({ name: '', grade: 'A', credits: 1 });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{initialValues.id ? 'Edit Course' : 'Add Course'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="courseName">Course Name</Label>
              <Input 
                id="courseName" 
                value={course.name} 
                onChange={(e) => setCourse({...course, name: e.target.value})} 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="grade">Grade</Label>
              <Select onValueChange={(value) => setCourse({...course, grade: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Grade" />
                </SelectTrigger>
                <SelectContent>
                  {['O', 'A+', 'A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'F'].map(g => (
                    <SelectItem key={g} value={g}>{g}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="credits">Credit Hours</Label>
              <Input 
                id="credits" 
                type="number" 
                min="1" 
                max="6" 
                value={course.credits} 
                onChange={(e) => setCourse({...course, credits: parseInt(e.target.value, 10)})} 
                required 
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={onCancel}>Cancel</Button>
        <Button type="submit" onClick={handleSubmit}>{initialValues.id ? 'Update' : 'Add'}</Button>
      </CardFooter>
    </Card>
  );
}

export default function App() {
  const [courses, setCourses] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editCourse, setEditCourse] = useState(null);

  const addCourse = (course) => {
    if (course.id) {
      setCourses(courses.map(c => c.id === course.id ? course : c));
    } else {
      setCourses([...courses, { ...course, id: Date.now() }]);
    }
    setIsOpen(false);
  };

  const removeCourse = (id) => {
    if (window.confirm("Are you sure you want to remove this course?")) {
      setCourses(courses.filter(course => course.id !== id));
    }
  };

  const totalCredits = courses.reduce((acc, course) => acc + course.credits, 0);
  const totalGradePoints = courses.reduce((acc, course) => acc + (gradeToPoints(course.grade) * course.credits), 0);
  const gpa = totalCredits ? (totalGradePoints / totalCredits).toFixed(2) : '0.00';

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>GPA Calculator</CardTitle>
          <CardDescription>Calculate your GPA based on your courses.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => {setIsOpen(true); setEditCourse(null);}}>Add Course</Button>
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Credits</TableHead>
                  <TableHead>Grade Points</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell>{course.name}</TableCell>
                    <TableCell>{course.grade}</TableCell>
                    <TableCell>{course.credits}</TableCell>
                    <TableCell>{(gradeToPoints(course.grade) * course.credits).toFixed(2)}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => {setIsOpen(true); setEditCourse(course);}}>Edit</Button>
                      <Button variant="destructive" size="sm" onClick={() => removeCourse(course.id)}>Remove</Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        <CardFooter>
          <p>GPA: <strong>{gpa}</strong></p>
        </CardFooter>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editCourse ? "Edit Course" : "Add New Course"}</DialogTitle>
          </DialogHeader>
          <CourseForm onSubmit={addCourse} initialValues={editCourse || {}} onCancel={() => setIsOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}