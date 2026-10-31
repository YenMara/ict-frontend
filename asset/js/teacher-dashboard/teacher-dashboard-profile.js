(() => {
  const modules = (window.TeacherDashboardModules = window.TeacherDashboardModules || {});

  modules.initProfile = function initProfile({ showToast, updateProfileIdentity, closeProfileMenu, showSignOutMessage }) {
    const profileContent = document.getElementById('profileContent');
    const profileForm = document.getElementById('profileEditForm');
    const profileFields = profileForm.elements;
    const profileDisplays = {
      name: document.getElementById('profileNameDisplay'),
      email: document.getElementById('profileEmailDisplay'),
      phone: document.getElementById('profilePhoneDisplay'),
      role: document.getElementById('profileRoleDisplay'),
      position: document.getElementById('profilePositionDisplay'),
      location: document.getElementById('profileLocationDisplay'),
      specialization: document.getElementById('profileSpecializationDisplay'),
      experience: document.getElementById('profileExperienceDisplay'),
      department: document.getElementById('profileDepartmentDisplay'),
      about: document.getElementById('profileAboutDisplay')
    };
    const defaultProfile = Object.fromEntries(
      Object.entries(profileDisplays)
        .filter(([key]) => key !== 'position')
        .map(([key, element]) => [key, element.textContent.trim()])
    );

    let savedProfile = {};
    try { savedProfile = JSON.parse(localStorage.getItem('teacherDashboardProfile') || '{}'); } catch { /* Ignore invalid profile data. */ }
    const profile = { ...defaultProfile, ...savedProfile };

    function renderProfile() {
      Object.entries(profileDisplays).forEach(([key, element]) => {
        element.textContent = key === 'position' ? profile.role : profile[key];
      });
      document.querySelector('.identity-copy strong').textContent = profile.name;
      document.querySelector('.identity-copy span').textContent = profile.role;
      updateProfileIdentity(profile);
    }

    renderProfile();

    document.getElementById('editProfileButton').addEventListener('click', () => {
      Object.entries(profile).forEach(([key, value]) => {
        if (profileFields[key]) profileFields[key].value = value;
      });
      profileContent.hidden = true;
      profileForm.hidden = false;
      profileFields.name.focus();
    });
    profileForm.querySelectorAll('[data-profile-cancel]').forEach((button) => button.addEventListener('click', () => {
      profileForm.hidden = true;
      profileContent.hidden = false;
    }));
    profileForm.addEventListener('submit', (event) => {
      event.preventDefault();
      Object.keys(defaultProfile).forEach((key) => { profile[key] = profileFields[key].value.trim(); });
      if (!profile.name || !profile.email || !profile.role) return;
      renderProfile();
      try { localStorage.setItem('teacherDashboardProfile', JSON.stringify(profile)); } catch { /* Keep the visible update if storage is unavailable. */ }
      profileForm.hidden = true;
      profileContent.hidden = false;
      showToast('Profile updated on this device.');
    });

    document.getElementById('signOut').addEventListener('click', () => showSignOutMessage(showToast));
    document.getElementById('profileMenuSignOut').addEventListener('click', () => {
      showSignOutMessage(showToast);
      closeProfileMenu();
    });
  };
})();
