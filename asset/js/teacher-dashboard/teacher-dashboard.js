(() => {
  // Start shared navigation first; the remaining modules depend on its callbacks.
  const modules = window.TeacherDashboardModules;
  const core = modules.initCore();
  const toolbar = modules.initToolbar(core);

  // Initialize each dashboard feature after all static HTML is available.
  modules.initOverview(core);
  const courses = modules.initCourses();
  const attendance = modules.initAttendance();
  modules.initCourseDetails({ ...core, ...courses, attendance });
  modules.initProfile({ ...core, ...toolbar });
})();