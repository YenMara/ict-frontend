(() => {
  const modules = (window.TeacherDashboardModules = window.TeacherDashboardModules || {});

  modules.initAttendance = function initAttendance() {
    const attendanceRecords = new Map();
    const attendanceDateInput = document.getElementById('attendanceDate');
    let selectedAttendanceCourse = '';

    function attendanceDateKey(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    }

    function updateDateLabel() {
      const chosen = new Date(`${attendanceDateInput.value}T00:00:00`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const selectedKey = attendanceDateInput.value;
      const dayLabel = selectedKey === attendanceDateKey(today) ? 'Today' : selectedKey === attendanceDateKey(tomorrow) ? 'Tomorrow' : 'Selected';
      const weekday = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(chosen);
      const month = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(chosen);
      document.getElementById('attendanceDateLabel').textContent = `${dayLabel} — ${weekday} ${month} ${chosen.getDate()} ${chosen.getFullYear()}`;
      document.querySelectorAll('[data-attendance-day]').forEach((button) => {
        const targetDate = button.dataset.attendanceDay === 'today' ? today : tomorrow;
        button.classList.toggle('is-active', selectedKey === attendanceDateKey(targetDate));
      });
    }

    function currentAttendanceRecords() {
      const key = `${selectedAttendanceCourse}|${attendanceDateInput.value}`;
      if (!attendanceRecords.has(key)) attendanceRecords.set(key, {});
      return attendanceRecords.get(key);
    }

    function renderStatus() {
      const records = currentAttendanceRecords();
      const totals = { present: 0, absent: 0, permission: 0 };
      document.querySelectorAll('[data-attendance-row]').forEach((row) => {
        const record = records[row.dataset.studentId] || {};
        row.dataset.attendanceStatus = record.status || '';
        row.querySelectorAll('[data-attendance-value]').forEach((button) => {
          const active = button.dataset.attendanceValue === record.status;
          button.classList.toggle('is-selected', active);
          button.setAttribute('aria-pressed', String(active));
        });
        row.querySelector('.attendance-note').value = record.note || '';
        if (record.status) totals[record.status] += 1;
      });
      document.getElementById('presentCount').textContent = String(totals.present);
      document.getElementById('absentCount').textContent = String(totals.absent);
      document.getElementById('permissionCount').textContent = String(totals.permission);
    }

    attendanceDateInput.value = attendanceDateKey(new Date());
    updateDateLabel();
    attendanceDateInput.addEventListener('change', () => {
      updateDateLabel();
      renderStatus();
    });
    document.querySelectorAll('[data-attendance-day]').forEach((button) => button.addEventListener('click', () => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      if (button.dataset.attendanceDay === 'tomorrow') date.setDate(date.getDate() + 1);
      attendanceDateInput.value = attendanceDateKey(date);
      updateDateLabel();
      renderStatus();
    }));
    document.querySelectorAll('[data-attendance-row]').forEach((row) => {
      row.querySelectorAll('[data-attendance-value]').forEach((button) => button.addEventListener('click', () => {
        const records = currentAttendanceRecords();
        records[row.dataset.studentId] = { ...(records[row.dataset.studentId] || {}), status: button.dataset.attendanceValue };
        renderStatus();
      }));
      row.querySelector('.attendance-note').addEventListener('input', (event) => {
        const records = currentAttendanceRecords();
        records[row.dataset.studentId] = { ...(records[row.dataset.studentId] || {}), note: event.target.value };
      });
    });
    document.getElementById('resetAttendance').addEventListener('click', () => {
      attendanceRecords.delete(`${selectedAttendanceCourse}|${attendanceDateInput.value}`);
      renderStatus();
    });
    document.getElementById('markAllPresent').addEventListener('click', () => {
      const records = currentAttendanceRecords();
      document.querySelectorAll('[data-attendance-row]').forEach((row) => {
        records[row.dataset.studentId] = { ...(records[row.dataset.studentId] || {}), status: 'present' };
      });
      renderStatus();
    });

    function setCourse(code) {
      selectedAttendanceCourse = code;
      updateDateLabel();
      renderStatus();
    }

    return { setCourse, updateDateLabel, renderStatus };
  };
})();
