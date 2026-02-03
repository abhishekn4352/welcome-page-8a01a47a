import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  useTheme,
  alpha,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  LockReset as LockResetIcon,
} from '@mui/icons-material';
import { api } from '../services/api';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const storedProfile = {
    name: localStorage.getItem('fullname') || localStorage.getItem('username') || 'Unknown',
    email: localStorage.getItem('email') || 'unknown@example.com',
    firstName: localStorage.getItem('firstName') || localStorage.getItem('username') || '',
    role: localStorage.getItem('role') || 'USER',
    userId: localStorage.getItem('userId') || '',
  };

  const [editMode, setEditMode] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [profile, setProfile] = useState({
    name: storedProfile.name,
    email: storedProfile.email,
    role: storedProfile.role,
    userId: storedProfile.userId,
  });

  const [editProfile, setEditProfile] = useState(profile);

  useEffect(() => {
    const looksUnknown = !storedProfile.name || storedProfile.name === 'Unknown' || !storedProfile.email || storedProfile.email === 'unknown@example.com';
    if (!looksUnknown) return;

    const hydrate = async () => {
      try {
        const me: any = await api.get('/auth/me');
        const name = me?.fullname ?? me?.name ?? me?.username ?? '';
        if (name) localStorage.setItem('fullname', name);
        if (me?.firstName) localStorage.setItem('firstName', me.firstName);
        if (me?.email) localStorage.setItem('email', me.email);
        if (me?.userId) localStorage.setItem('userId', String(me.userId));
        if (me?.roles) localStorage.setItem('roles', JSON.stringify(me.roles));
        setProfile({
          name: name || 'Unknown',
          email: me.email || 'unknown@example.com',
          role: me.role || 'USER',
          userId: (me.userId && String(me.userId)) || storedProfile.userId,
        });
      } catch {
        // ignore
      }
    };
    hydrate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEdit = () => {
    setEditProfile(profile);
    setEditMode(true);
    setSuccessMessage('');
  };

  const handleSave = async () => {
    try {
      const data: any = await api.put(`/users/${profile.userId}`, {
        fullname: editProfile.name,
        firstName: editProfile.name,
        email: editProfile.email,
        role: editProfile.role,
      });

      localStorage.setItem("fullname", data.item.fullname);
      localStorage.setItem("firstName", data.item.firstName);
      localStorage.setItem("email", data.item.email);
      if (data.item.role) {
        localStorage.setItem("role", data.item.role);
      }

      setProfile({
        ...profile,
        name: data.item.fullname,
        email: data.item.email,
        role: data.item.role,
      });

      setEditMode(false);
      setSuccessMessage('Profile updated successfully');
    } catch (err) {
      console.error(err);
      setSuccessMessage('');
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setSuccessMessage('');
  };

  const handleResetPassword = () => {
    navigate('/reset-password');
  };

  const roleOptions = [
    { value: 'ADMIN', label: 'Administrator' },
    { value: 'USER', label: 'User' },
    { value: 'Log Analyst', label: 'Log Analyst' },
    { value: 'Workflow Editor', label: 'Workflow Editor' },
    { value: 'Execution Approver', label: 'Execution Approver' },
    { value: 'Billing Manager', label: 'Billing Manager' },
  ];

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
      <Card
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        sx={{ maxWidth: 480, width: '100%' }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Avatar & Name */}
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                mb: 2,
                background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                fontSize: '2rem',
                fontWeight: 700,
              }}
            >
              {profile.name.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="h5" fontWeight={600}>
              {profile.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {profile.role}
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Success Message */}
          {successMessage && !editMode && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {successMessage}
            </Alert>
          )}

          {/* Profile Form */}
          {editMode ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
              <TextField
                label="Full Name"
                value={editProfile.name}
                onChange={(e) => setEditProfile({ ...editProfile, name: e.target.value })}
                fullWidth
              />
              <TextField
                label="Email"
                type="email"
                value={editProfile.email}
                onChange={(e) => setEditProfile({ ...editProfile, email: e.target.value })}
                fullWidth
              />
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={editProfile.role}
                  label="Role"
                  onChange={(e) => setEditProfile({ ...editProfile, role: e.target.value })}
                >
                  {roleOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  fullWidth
                >
                  Save
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CloseIcon />}
                  onClick={handleCancel}
                  fullWidth
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          ) : (
            <Box>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
                {[
                  { label: 'Name', value: profile.name },
                  { label: 'Email', value: profile.email },
                  { label: 'Role', value: profile.role },
                ].map((item) => (
                  <Box
                    key={item.label}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: 1,
                      borderBottom: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {item.label}
                    </Typography>
                    <Typography variant="body2" fontWeight={500}>
                      {item.value}
                    </Typography>
                  </Box>
                ))}
              </Box>

              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={handleEdit}
                  fullWidth
                >
                  Edit Profile
                </Button>
                <Button
                  variant="outlined"
                  color="warning"
                  startIcon={<LockResetIcon />}
                  onClick={handleResetPassword}
                  fullWidth
                >
                  Reset Password
                </Button>
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProfilePage;
