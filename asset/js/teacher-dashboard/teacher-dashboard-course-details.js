(() => {
  const modules = (window.TeacherDashboardModules = window.TeacherDashboardModules || {});

  modules.initCourseDetails = function initCourseDetails({ setView, teacherCourseCards, attendance }) {
    function openTeacherCourseDetails(card) {
      const title = card.dataset.name;
      const code = card.dataset.code;
      const studentCount = Number(card.dataset.students || 0);
      const courseCategory = card.querySelector('.teacher-course-meta > span:nth-child(2)')?.textContent || 'Course';
      const mark = title.toLocaleLowerCase().includes('plus plus') ? 'C++' : title.toLocaleLowerCase().includes('web') ? 'WEB' : 'ICT';
      const attendanceRate = card.dataset.status === 'active' ? '33%' : '—';

      document.getElementById('detailCourseTitle').textContent = title;
      document.getElementById('detailCourseCode').textContent = code;
      document.getElementById('detailCourseSchedule').textContent = card.dataset.schedule;
      document.getElementById('detailStudentCount').textContent = String(studentCount);
      document.getElementById('detailCourseRating').textContent = card.dataset.rating;
      document.getElementById('detailCourseLevel').textContent = card.dataset.level;
      document.getElementById('detailCourseMark').textContent = mark;
      document.getElementById('detailCoverMark').textContent = mark;
      document.getElementById('detailCoverCode').textContent = `${code} · ${courseCategory}`;
      document.getElementById('detailSideStudents').textContent = String(studentCount);
      document.getElementById('detailStartDate').textContent = card.dataset.start;
      document.getElementById('detailDuration').textContent = card.dataset.duration;
      document.getElementById('detailTotalSessions').textContent = card.dataset.sessions;
      document.getElementById('detailEnrolledDate').textContent = card.dataset.enrolled;
      document.getElementById('detailStudentLocation').textContent = card.dataset.location;
      document.querySelector('.detail-enrolled-copy').textContent = card.dataset.enrolled;
      document.querySelector('.detail-student-card-location').textContent = card.dataset.location;
      document.getElementById('detailReportRate').textContent = attendanceRate;
      document.getElementById('detailReportRing').style.setProperty('--report-progress', card.dataset.status === 'active' ? '33%' : '0%');
      document.getElementById('detailReportMessage').textContent = studentCount
        ? `${studentCount} student enrolled in this course. Average attendance is ${attendanceRate}.`
        : 'No students are enrolled yet. Attendance information will appear after the course begins.';
      document.getElementById('detailStudentTableWrap').hidden = studentCount === 0;
      document.getElementById('detailStudentCards').hidden = studentCount === 0 || !document.querySelector('[data-student-layout="grid"]').classList.contains('is-active');
      document.getElementById('detailNoStudents').hidden = studentCount !== 0;
      document.getElementById('detailAttendanceTable').hidden = studentCount === 0;
      document.getElementById('detailAttendanceEmpty').hidden = studentCount !== 0;

      const hasSessionRecords = code === 'ICT-004';
      document.getElementById('sessionAccordion').hidden = !hasSessionRecords;
      document.getElementById('sessionLogSummary').hidden = !hasSessionRecords;
      document.querySelector('.session-log-overview').hidden = !hasSessionRecords;
      document.getElementById('detailSessionEmpty').hidden = hasSessionRecords;
      document.getElementById('attendanceSummary').hidden = studentCount === 0;
      document.getElementById('attendanceActions').hidden = studentCount === 0;
      attendance.setCourse(code);
      document.getElementById('detailStudentsPanel').querySelector('.student-view-toggle').hidden = studentCount === 0;

      document.querySelectorAll('.course-detail-tab').forEach((tab) => {
        const active = tab.dataset.detailTab === 'students';
        tab.setAttribute('aria-selected', String(active));
        tab.classList.toggle('is-active', active);
      });
      document.querySelectorAll('.course-detail-tab-panel').forEach((panel) => {
        panel.hidden = panel.id !== 'detailStudentsPanel';
      });

      const relatedCards = [...document.querySelectorAll('[data-related-course]')];
      relatedCards.forEach((relatedCard) => { relatedCard.hidden = relatedCard.dataset.relatedCourse === code; });
      document.querySelector('.related-course-count').textContent = `${relatedCards.filter((relatedCard) => !relatedCard.hidden).length} related courses`;
      setView('course-detail');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    document.querySelectorAll('.teacher-course-details-button').forEach((button) => {
      button.addEventListener('click', () => openTeacherCourseDetails(button.closest('[data-teacher-course]')));
    });
    document.querySelectorAll('.related-course-card').forEach((relatedCard) => {
      function openRelatedCourse() {
        const course = teacherCourseCards.find((card) => card.dataset.code === relatedCard.dataset.relatedCourse);
        if (course) openTeacherCourseDetails(course);
      }
      relatedCard.addEventListener('click', openRelatedCourse);
      relatedCard.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          openRelatedCourse();
        }
      });
    });
    document.getElementById('backToCourses').addEventListener('click', () => setView('courses'));

    document.querySelectorAll('.course-detail-tab').forEach((tab) => tab.addEventListener('click', () => {
      document.querySelectorAll('.course-detail-tab').forEach((item) => {
        const active = item === tab;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-selected', String(active));
      });
      document.querySelectorAll('.course-detail-tab-panel').forEach((panel) => {
        panel.hidden = panel.id !== tab.getAttribute('aria-controls');
      });
    }));

    document.querySelectorAll('.session-log-card-toggle').forEach((button) => button.addEventListener('click', () => {
      const card = button.closest('.session-log-card');
      const detail = document.getElementById(button.getAttribute('aria-controls'));
      const expanded = button.getAttribute('aria-expanded') !== 'true';
      button.setAttribute('aria-expanded', String(expanded));
      detail.hidden = !expanded;
      card.classList.toggle('is-open', expanded);
    }));

    document.querySelectorAll('[data-student-layout]').forEach((button) => button.addEventListener('click', () => {
      document.querySelectorAll('[data-student-layout]').forEach((item) => item.classList.toggle('is-active', item === button));
      const showCards = button.dataset.studentLayout === 'grid';
      document.getElementById('detailStudentTableWrap').hidden = showCards;
      document.getElementById('detailStudentCards').hidden = !showCards || Number(document.getElementById('detailStudentCount').textContent) === 0;
    }));
  };
})();
